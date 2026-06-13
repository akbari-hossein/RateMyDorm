from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from .models import University
from .serializers import UniversitySerializer

# Create your views here.

class UniversityViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows universities to be viewed.
    """
    queryset = University.objects.all()
    serializer_class = UniversitySerializer
    permission_classes = [IsAuthenticated] # Only authenticated users can access this viewset
