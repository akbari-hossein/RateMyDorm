from django.db import models
from university.models import University

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

    class Meta:
        unique_together = ('university', 'name')
        
    def __str__(self):
        return f"{self.name} ({self.university.name})"
