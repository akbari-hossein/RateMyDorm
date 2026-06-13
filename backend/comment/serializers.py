from rest_framework import serializers
from .models import Comment
from building.models import Building
from student.models import Student

class CommentSerializer(serializers.ModelSerializer):
    student = serializers.StringRelatedField(read_only=True)
    building = serializers.StringRelatedField(read_only=True)
    building_id = serializers.IntegerField(source="building.id", read_only=True)

    class Meta:
        model = Comment
        fields = "__all__"

class CommentCreateSerializer(serializers.ModelSerializer):
    content = serializers.CharField(allow_blank=False)
    building_id = serializers.IntegerField(required=True, help_text='Id of the building this comment is for')
    rating = serializers.IntegerField(min_value=1, max_value=5, required=True)

    class Meta:
        model = Comment
        fields = (
            'id',
            'content',
            'rating',
            'created_at',
            'student',
            'building_id',
            'image',
        )
        read_only_fields = ('id', 'created_at', 'student')

    def create(self, validated_data):
        content = validated_data['content']
        building_id = validated_data['building_id']
        rating = validated_data['rating']
        image = validated_data.get('image')
        try:
            building = Building.objects.get(id=building_id)
        except Building.DoesNotExist:
            raise serializers.ValidationError('Building does not exist, please enter correct building id')
        user = self.context['request'].user
        comment = Comment.objects.create(
            content=content,
            building=building,
            student=user,
            rating=rating,
            image=image
        )
        return comment