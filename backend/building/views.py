from django.shortcuts import render
from rest_framework import viewsets
from .models import Building
from .serializers import BuildingSerializer

# Create your views here.

class BuildingViewSet(viewsets.ModelViewSet):
    queryset = Building.objects.all()
    serializer_class = BuildingSerializer
