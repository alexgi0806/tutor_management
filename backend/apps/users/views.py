from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .models import User, Tutor, Parent, Student
from .serializers import (
    UserSerializer, UserCreateSerializer, TutorSerializer,
    ParentSerializer, StudentSerializer, StudentCreateUpdateSerializer
)
from .services import UserService, TutorService, StudentService


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
        permission_classes = [AllowAny]
        return super().create(request, *args, **kwargs)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get current user details"""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        """Change user password"""
        service = UserService()
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if service.change_password(request.user, old_password, new_password):
            return Response({'detail': 'Password changed successfully.'})
        return Response(
            {'detail': 'Old password is incorrect.'},
            status=status.HTTP_400_BAD_REQUEST
        )


class TutorViewSet(viewsets.ModelViewSet):
    queryset = Tutor.objects.all()
    serializer_class = TutorSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['is_verified', 'rating']
    search_fields = ['full_name', 'university', 'major']
    ordering_fields = ['rating', 'created_at']

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_profile(self, request):
        """Get current tutor's profile"""
        try:
            tutor = request.user.tutor_profile
            serializer = self.get_serializer(tutor)
            return Response(serializer.data)
        except Tutor.DoesNotExist:
            return Response(
                {'detail': 'Tutor profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )


class ParentViewSet(viewsets.ModelViewSet):
    queryset = Parent.objects.all()
    serializer_class = ParentSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ['full_name', 'phone']

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_profile(self, request):
        """Get current parent's profile"""
        try:
            parent = request.user.parent_profile
            serializer = self.get_serializer(parent)
            return Response(serializer.data)
        except Parent.DoesNotExist:
            return Response(
                {'detail': 'Parent profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ['parent', 'grade_level']
    search_fields = ['full_name', 'school_name']

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return StudentCreateUpdateSerializer
        return StudentSerializer

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def my_students(self, request):
        """Get all students of current parent"""
        try:
            parent = request.user.parent_profile
            students = parent.students.all()
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data)
        except Parent.DoesNotExist:
            return Response(
                {'detail': 'Parent profile not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
