from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from university.models import University
from building.models import Building

class StudentManager(BaseUserManager):
    def create_user(self, telegram_id, username=None, password=None, **extra_fields): # password اضافه شد
        if not telegram_id:
            raise ValueError('Telegram ID is required')
        
        if not username:
            username = str(telegram_id)

        user = self.model(telegram_id=telegram_id, username=username, **extra_fields)
        
        # اگر پسورد داده شده بود اون رو ست کن، در غیر این صورت غیرقابل استفاده‌اش کن
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
            
        user.save(using=self._db)
        return user

    def create_superuser(self, telegram_id, username=None, password=None, **extra_fields): # password اضافه شد
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        # پسورد به متد پایین پاس داده میشه
        return self.create_user(telegram_id, username, password, **extra_fields)

class Student(AbstractBaseUser):
    # Telegram fields
    telegram_id = models.CharField(max_length=64, unique=True)
    username = models.CharField(max_length=255, blank=True, null=True)
    first_name = models.CharField(max_length=255, blank=True, null=True)
    last_name = models.CharField(max_length=255, blank=True, null=True)
    university = models.ForeignKey(University, on_delete=models.SET_NULL, null=True, blank=True)
    current_building = models.ForeignKey(Building, on_delete=models.SET_NULL, null=True, blank=True)

    # django auth fields
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'telegram_id'
    REQUIRED_FIELDS = []

    objects = StudentManager()


    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser