from rest_framework import routers
from university.views import UniversityViewSet
from building.views import BuildingViewSet
from student.views import StudentViewSet, TelegramAuthView
from comment.views import CommentsListAPIView, CommentsCreateAPIView, CommentsDetailAPIView
from django.urls import path, include

router = routers.DefaultRouter()
router.register(r'universities', UniversityViewSet)
router.register(r'buildings', BuildingViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('students/auth/telegram/', TelegramAuthView.as_view(), name='telegram-auth'),
    path('comments/', CommentsListAPIView.as_view(), name='comment-list'),
    path('comments/create/', CommentsCreateAPIView.as_view(), name='comment-create'),
    path('comments/<int:pk>/', CommentsDetailAPIView.as_view(), name='comment-detail'),
]
