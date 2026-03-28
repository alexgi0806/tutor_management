from django.core.management.base import BaseCommand
from django.utils import timezone
from faker import Faker
from apps.users.models import User, Tutor, Parent, Student
from apps.classes.models import Class
from apps.finance.models import Enrollment, Transaction
from apps.feedback.models import Review
import random
from decimal import Decimal


class Command(BaseCommand):
    help = 'Seed database with realistic test data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear all data before seeding'
        )

    def handle(self, *args, **options):
        fake = Faker()
        
        # Helper function to generate short phone numbers
        def generate_phone():
            return f"+{random.randint(1,999)}{random.randint(1000000,9999999)}"[:20]
        
        if options['clear']:
            self.stdout.write(self.style.WARNING('Clearing database...'))
            User.objects.all().delete()
            Tutor.objects.all().delete()
            Parent.objects.all().delete()
            Student.objects.all().delete()
            Class.objects.all().delete()
            Enrollment.objects.all().delete()
            Transaction.objects.all().delete()
            Review.objects.all().delete()
        
        self.stdout.write(self.style.SUCCESS('Starting database seeding...'))

        # Skip seeding if data already exists
        if User.objects.filter(username='admin').exists():
            self.stdout.write(self.style.WARNING('Admin user already exists. Skipping seeding.'))
            return

        # Create Admin Users
        self.stdout.write('Creating admin users...')
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@tutoring.com',
            password='admin123',
            role='admin',
            phone='0900000000',
            status='active'
        )

        # Create Tutor Users and Profiles
        self.stdout.write('Creating tutors...')
        tutors_data = []
        for i in range(10):
            user = User.objects.create_user(
                username=f'tutor_{i+1}',
                email=f'tutor{i+1}@example.com',
                password='tutor123',
                role='tutor',
                phone=generate_phone(),
                status='active'
            )
            tutor = Tutor.objects.create(
                user=user,
                full_name=fake.name(),
                gender=random.choice(['M', 'F', 'O']),
                birthday=fake.date_of_birth(minimum_age=22, maximum_age=50),
                address=fake.address(),
                university=fake.company(),
                major=random.choice(['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology']),
                experience_summary=fake.text(max_nb_chars=200),
                rating=round(random.uniform(3.5, 5.0), 1),
                is_verified=random.choice([True, False])
            )
            tutors_data.append(tutor)

        # Create Parent Users and Profiles
        self.stdout.write('Creating parents...')
        parents_data = []
        for i in range(15):
            user = User.objects.create_user(
                username=f'parent_{i+1}',
                email=f'parent{i+1}@example.com',
                password='parent123',
                role='parent',
                phone=generate_phone(),
                status='active'
            )
            parent = Parent.objects.create(
                user=user,
                full_name=fake.name(),
                phone=generate_phone(),
                address=fake.address()
            )
            parents_data.append(parent)

        # Create Student Users and Profiles
        self.stdout.write('Creating students...')
        students_data = []
        for i in range(30):
            student_user = None
            if random.choice([True, False]):
                student_user = User.objects.create_user(
                    username=f'student_{i+1}',
                    email=f'student{i+1}@example.com',
                    password='student123',
                    role='student',
                    phone=generate_phone(),
                    status='active'
                )
            
            student = Student.objects.create(
                user=student_user,
                parent=random.choice(parents_data),
                full_name=fake.name(),
                gender=random.choice(['M', 'F', 'O']),
                birthday=fake.date_of_birth(minimum_age=5, maximum_age=18),
                grade_level=random.choice(['K1', 'K2', 'K3', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9', 'G10', 'G11', 'G12']),
                school_name=fake.company(),
                note=fake.text(max_nb_chars=100)
            )
            students_data.append(student)

        # Create Classes
        self.stdout.write('Creating classes...')
        classes_data = []
        subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'History', 'Geography']
        
        for i in range(20):
            tutor = random.choice(tutors_data) if random.choice([True, False]) else None
            cls = Class.objects.create(
                tutor=tutor,
                created_by=admin_user,
                subject_name=random.choice(subjects),
                schedule_detail=fake.text(max_nb_chars=100),
                sessions_per_week=random.randint(1, 5),
                salary_per_month=Decimal(str(random.randint(500, 2000))),
                address_teaching=fake.address(),
                requirements=fake.text(max_nb_chars=150),
                status=random.choice(['open', 'assigned', 'teaching', 'completed'])
            )
            classes_data.append(cls)

        # Create Enrollments
        self.stdout.write('Creating enrollments...')
        enrollments_data = []
        for i in range(25):
            student = random.choice(students_data)
            cls = random.choice(classes_data)
            
            try:
                enrollment = Enrollment.objects.create(
                    class_id=cls,
                    student_id=student,
                    parent_id=student.parent,
                    status=random.choice(['pending_payment', 'active', 'dropped', 'completed'])
                )
                enrollments_data.append(enrollment)
            except Exception as e:
                pass  # Skip duplicate enrollments

        # Create Transactions
        self.stdout.write('Creating transactions...')
        for enrollment in enrollments_data:
            for _ in range(random.randint(1, 3)):
                transaction = Transaction.objects.create(
                    user_id=enrollment.parent_id.user,
                    enrollment_id=enrollment,
                    amount=Decimal(str(random.randint(100, 1000))),
                    type=random.choice(['tuition_fee', 'commission', 'refund']),
                    status=random.choice(['pending', 'success', 'failed'])
                )

        # Create Reviews
        self.stdout.write('Creating reviews...')
        for cls in classes_data:
            if cls.tutor:
                for _ in range(random.randint(1, 5)):
                    user = random.choice([admin_user] + [s.user for s in students_data if s.user])
                    if user:
                        try:
                            Review.objects.create(
                                class_id=cls,
                                user_id=user,
                                star_rating=random.randint(1, 5),
                                comment=fake.text(max_nb_chars=200) if random.choice([True, False]) else None
                            )
                        except Exception as e:
                            pass  # Skip duplicate reviews

        self.stdout.write(self.style.SUCCESS('Database seeding completed!'))
        self.stdout.write(self.style.SUCCESS(f'Created:'))
        self.stdout.write(self.style.SUCCESS(f'  - 1 Admin user'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(tutors_data)} Tutors'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(parents_data)} Parents'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(students_data)} Students'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(classes_data)} Classes'))
        self.stdout.write(self.style.SUCCESS(f'  - {len(enrollments_data)} Enrollments'))
        self.stdout.write(self.style.SUCCESS(f'  - {Transaction.objects.count()} Transactions'))
        self.stdout.write(self.style.SUCCESS(f'  - {Review.objects.count()} Reviews'))
