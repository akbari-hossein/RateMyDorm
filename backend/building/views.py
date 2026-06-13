from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from .models import Building
from .serializers import BuildingSerializer

# Create your views here.

class BuildingViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows buildings to be viewed and filtered.
    """
    serializer_class = BuildingSerializer
    filter_backends = [DjangoFilterBackend] # Enable filtering
    filterset_fields = ['university', 'gender']# Allow filtering

    def get_queryset(self):
        # Only return approved buildings for listing and retrieval
        return Building.objects.filter(is_approved=True)

    def get_permissions(self):
        # Allow anyone to view the list and details of buildings, but require authentication for creating, updating, or deleting
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Set the created_by field to the currently authenticated user when creating a new building
        serializer.save(created_by=self.request.user)