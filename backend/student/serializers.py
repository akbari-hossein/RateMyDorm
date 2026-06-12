from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        # Added 'id', 'university', and 'current_building' to match the updated model
        fields = ('id', 'telegram_id', 'username', 'first_name', 'last_name', 'university', 'current_building')
        # Telegram ID should be read-only so no one can alter it via API
        read_only_fields = ('telegram_id',)