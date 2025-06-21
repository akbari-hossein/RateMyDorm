from django.db import models
from university.models import University

class Building(models.Model):
    university = models.ForeignKey(University, on_delete=models.CASCADE, related_name='buildings')
    name = models.CharField(max_length=255)
    address = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name} ({self.university.name})"
