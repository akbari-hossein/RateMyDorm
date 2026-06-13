from rest_framework import serializers
from .models import Comment
from building.models import Building
from django.contrib.auth import get_user_model

User = get_user_model()

class CommentSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)
    building = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'

class CommentCreateSerializer(serializers.ModelSerializer):
    content = serializers.CharField(allow_blank=False)
    # This automatically validates existence and approval status
    building = serializers.PrimaryKeyRelatedField(
        queryset=Building.objects.filter(is_approved=True)
    )
    rating = serializers.IntegerField(required=True, min_value=1, max_value=5)

    class Meta:
        model = Comment
        fields = (
            'id',
            'content',
            'rating',
            'created_at',
            'student',
            'building',
            'image',
        )
        read_only_fields = ('id', 'created_at', 'student')

    def create(self, validated_data):
        # Inject the student from the request context
        user = self.context['request'].user
        validated_data['student'] = user
        return super().create(validated_data)