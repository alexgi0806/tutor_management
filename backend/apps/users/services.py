from django.contrib.auth import authenticate
from .models import User, Tutor, Parent, Student


class UserService:
    @staticmethod
    def change_password(user, old_password, new_password):
        """Change user password"""
        if not user.check_password(old_password):
            return False
        user.set_password(new_password)
        user.save()
        return True

    @staticmethod
    def get_user_by_email(email):
        """Get user by email"""
        try:
            return User.objects.get(email=email)
        except User.DoesNotExist:
            return None

    @staticmethod
    def deactivate_user(user):
        """Deactivate user"""
        user.status = 'inactive'
        user.save()
        return user


class TutorService:
    @staticmethod
    def get_verified_tutors():
        """Get all verified tutors"""
        return Tutor.objects.filter(is_verified=True).order_by('-rating')

    @staticmethod
    def update_rating(tutor, new_rating):
        """Update tutor rating"""
        tutor.rating = new_rating
        tutor.save()
        return tutor

    @staticmethod
    def verify_tutor(tutor):
        """Mark tutor as verified"""
        tutor.is_verified = True
        tutor.save()
        return tutor


class StudentService:
    @staticmethod
    def get_students_by_parent(parent):
        """Get all students of a parent"""
        return parent.students.all()

    @staticmethod
    def create_student(parent, validated_data):
        """Create a new student"""
        student = Student.objects.create(parent=parent, **validated_data)
        return student


class ParentService:
    @staticmethod
    def get_parent_info(parent):
        """Get parent information with students"""
        return {
            'parent': parent,
            'students_count': parent.students.count(),
            'students': StudentService.get_students_by_parent(parent)
        }
