import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from .models import Student
from .serializers import StudentSerializer
from .utils import validate_telegram_data

User = get_user_model()

# 1. Friend's ViewSet (Updated)
class StudentViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing student instances.
    """
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    # In the future, we will restrict this so students can only see/edit themselves
    permission_classes = [AllowAny] 


# 2. Our Telegram Auth View
class TelegramAuthView(APIView):
    """
    API View to handle Telegram Mini App authentication using initData.
    """
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        init_data = request.data.get('initData')
        if not init_data:
            return Response({"error": _("initData is required.")}, status=status.HTTP_400_BAD_REQUEST)

        try:
            validated_data = validate_telegram_data(init_data)
            user_data_str = validated_data.get('user')
            if not user_data_str:
                return Response({"error": _("User data missing in initData.")}, status=status.HTTP_400_BAD_REQUEST)
                
            user_data = json.loads(user_data_str)
            telegram_id = str(user_data.get('id'))
            username = user_data.get('username', '')
            first_name = user_data.get('first_name', '')
            last_name = user_data.get('last_name', '')

            student_user, created = User.objects.get_or_create(
                telegram_id=telegram_id,
                defaults={
                    'username': username if username else telegram_id,
                    'first_name': first_name,
                    'last_name': last_name,
                }
            )

            refresh = RefreshToken.for_user(student_user)
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "is_new_user": created,
                "user": StudentSerializer(student_user).data # Using the serializer for clean output
            }, status=status.HTTP_200_OK)

        except ValidationError as e:
            return Response({"error": str(e.message)}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": _("An unexpected error occurred.")}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)