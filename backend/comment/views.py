from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer

class CommentsListAPIView(generics.ListAPIView):
    # Only return approved comments
    # Optimization: select_related fetches student and building in the same SQL JOIN
    queryset = Comment.objects.filter(
        is_approved=True, 
        building__is_approved=True
    ).select_related('student', 'building').order_by('-created_at')
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    
    # Allow frontend to filter by building (e.g., ?building=1)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['building']

class CommentsCreateAPIView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentCreateSerializer
    permission_classes = [IsAuthenticated]
    # authentication_classes = [JWTAuthentication] # Uncomment if needed later

class CommentsDetailAPIView(generics.RetrieveAPIView):
    # Prevent direct access to unapproved comments via ID
    queryset = Comment.objects.filter(is_approved=True)
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]