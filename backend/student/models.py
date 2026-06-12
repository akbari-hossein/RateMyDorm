from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from university.models import University
from building.models import Building

class StudentManager(BaseUserManager):
    def create_user(self, telegram_id, username=None, **extra_fields):
        if not telegram_id:
            raise ValueError('Telegram ID is required')
        # If username is not provided, use the telegram_id as the username
        if not username:
            username = str(telegram_id)

        user = self.model(telegram_id=telegram_id, username=username, **extra_fields)
        user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, telegram_id, username=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        # Ensure that the superuser has the correct permissions
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(telegram_id, username, **extra_fields)

class Student(AbstractBaseUser):
    # Telegram fields
    telegram_id = models.CharField(max_length=64, unique=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    university = models.ForeignKey(University, on_delete=models.SET_NULL, null=True, blank=True)
    current_building = models.ForeignKey(Building, on_delete=models.SET_NULL, null=True, blank=True)

    #django auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'telegram_id'
    REQUIRED_FIELDS = []

    objects = StudentManager()

    def __str__(self):
        return self.username or str(self.telegram_id)
