from django.shortcuts import render
from rest_framework import viewsets
from .models import University
from .serializers import UniversitySerializer

# Create your views here.

class UniversityViewSet(viewsets.ModelViewSet):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
