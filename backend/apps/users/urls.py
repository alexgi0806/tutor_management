from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, TutorViewSet, ParentViewSet, StudentViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tutors', TutorViewSet)
router.register(r'parents', ParentViewSet)
router.register(r'students', StudentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
