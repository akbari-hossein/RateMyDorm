from django.db import models
from university.models import University
from django.conf import settings

class Building(models.Model):
    GENDER_CHOICES = [
        ('M', 'male'),
        ('F', 'female'),
    ]
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='building')
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True, null=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, default='M')
    facilities = models.TextField(blank=True, null=True)
    is_approved = models.BooleanField(default=False, verbose_name="approved by admin")
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Registrar"
    )
    
    class Meta:
        unique_together = ('university', 'name')
        
    def __str__(self):
        return f"{self.name} ({self.university.name})"
