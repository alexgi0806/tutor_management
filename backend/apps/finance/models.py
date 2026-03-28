from django.db import models
from apps.classes.models import Class
from apps.users.models import User, Student, Parent


class Enrollment(models.Model):
    STATUS_CHOICES = (
        ('pending_payment', 'Pending Payment'),
        ('active', 'Active'),
        ('dropped', 'Dropped'),
        ('completed', 'Completed'),
    )
    
    class_id = models.ForeignKey(Class, on_delete=models.CASCADE, related_name='enrollments')
    student_id = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    parent_id = models.ForeignKey(Parent, on_delete=models.SET_NULL, null=True, blank=True, related_name='enrollments')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending_payment')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ['class_id', 'student_id']
        ordering = ['-enrolled_at']
        indexes = [
            models.Index(fields=['status', 'class_id']),
            models.Index(fields=['student_id']),
        ]

    def __str__(self):
        return f"{self.student_id.full_name} - {self.class_id.subject_name} ({self.status})"


class Transaction(models.Model):
    TYPE_CHOICES = (
        ('tuition_fee', 'Tuition Fee'),
        ('commission', 'Commission'),
        ('refund', 'Refund'),
    )
    
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
    )
    
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    enrollment_id = models.ForeignKey(Enrollment, on_delete=models.SET_NULL, null=True, blank=True, related_name='transactions')
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['type', 'status']),
            models.Index(fields=['user_id']),
        ]

    def __str__(self):
        return f"{self.user_id.username} - {self.amount} ({self.type})"
