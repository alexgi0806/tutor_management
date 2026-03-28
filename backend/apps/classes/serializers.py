from rest_framework import serializers
from .models import Class
from apps.users.serializers import TutorSerializer, UserSerializer


class ClassSerializer(serializers.ModelSerializer):
    tutor = TutorSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    tutor_id = serializers.PrimaryKeyRelatedField(
        queryset=Class.objects.model,
        source='tutor',
        write_only=True,
        required=False
    )
    
    class Meta:
        model = Class
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']


class ClassCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = [
            'subject_name', 'schedule_detail', 'sessions_per_week',
            'salary_per_month', 'address_teaching', 'requirements', 'status', 'tutor'
        ]
