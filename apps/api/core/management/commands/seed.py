from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import CustomUser, Patient, Session, TherapeuticEvolution


class Command(BaseCommand):
    help = 'Seed the database with test data for development'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing seed data...')
        self.clear_data()
        
        self.stdout.write('Creating users...')
        users = self.create_users()
        
        self.stdout.write('Creating patients...')
        patients = self.create_patients(users)
        
        self.stdout.write('Creating sessions...')
        sessions = self.create_sessions(users, patients)
        
        self.stdout.write('Creating evolutions...')
        self.create_evolutions(sessions, users)
        
        self.verify_data()
        self.stdout.write(self.style.SUCCESS('Seed completed successfully!'))

    def clear_data(self):
        TherapeuticEvolution.objects.all().delete()
        Session.objects.all().delete()
        Patient.objects.all().delete()
        CustomUser.objects.filter(email__endswith='@spectra.com').delete()

    def create_users(self):
        users_data = [
            {
                'email': 'admin@spectra.com',
                'username': 'admin',
                'password': 'admin123',
                'first_name': 'Admin',
                'last_name': 'User',
                'role': 'admin',
            },
            {
                'email': 'ana@spectra.com',
                'username': 'ana',
                'password': 'therapist123',
                'first_name': 'Ana',
                'last_name': 'Costa',
                'role': 'therapist',
            },
            {
                'email': 'carlos@spectra.com',
                'username': 'carlos',
                'password': 'therapist123',
                'first_name': 'Carlos',
                'last_name': 'Mendes',
                'role': 'therapist',
            },
            {
                'email': 'maria@spectra.com',
                'username': 'maria',
                'password': 'family123',
                'first_name': 'Maria',
                'last_name': 'Silva',
                'role': 'family',
            },
        ]
        
        users = {}
        for user_data in users_data:
            user = CustomUser.objects.create_user(
                email=user_data['email'],
                username=user_data['username'],
                password=user_data['password'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                role=user_data['role'],
                is_active=True,
            )
            users[user_data['role']] = user
            users[user_data['username']] = user
        
        return users

    def create_patients(self, users):
        patients_data = [
            {
                'name': 'Leonardo Silva',
                'birth_date': '2017-03-10',
                'guardian_name': 'Maria Silva',
                'guardian_email': 'maria@spectra.com',
                'notes': 'Patient with TEA level 2. Highly responsive to ABA therapy.',
            },
            {
                'name': 'Sofia Rodrigues',
                'birth_date': '2016-07-22',
                'guardian_name': 'João Rodrigues',
                'guardian_email': 'joao.rod@email.com',
                'notes': 'Patient with TEA level 1. Good verbal communication.',
            },
            {
                'name': 'Pedro Alves',
                'birth_date': '2018-11-05',
                'guardian_name': 'Fernanda Alves',
                'guardian_email': 'fernanda@email.com',
                'notes': 'Patient with TEA level 2. Benefits from visual schedules.',
            },
            {
                'name': 'Clara Mendes',
                'birth_date': '2015-04-18',
                'guardian_name': 'Roberto Mendes',
                'guardian_email': 'roberto@email.com',
                'notes': 'Patient with TEA level 3. Requires more individual support.',
            },
        ]
        
        patients = {}
        for patient_data in patients_data:
            patient = Patient.objects.create(
                name=patient_data['name'],
                birth_date=patient_data['birth_date'],
                guardian_name=patient_data['guardian_name'],
                guardian_email=patient_data['guardian_email'],
                notes=patient_data['notes'],
            )
            patients[patient.name.split()[0]] = patient
        
        return patients

    def create_sessions(self, users, patients):
        therapist_ana = users.get('ana')
        therapist_carlos = users.get('carlos')
        now = timezone.now()
        
        sessions_data = [
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=14),
                'status': 'completed',
                'notes': 'Session completed successfully.',
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=7),
                'status': 'completed',
                'notes': 'Good progress on verbal requests.',
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=3),
                'status': 'scheduled',
                'notes': 'Scheduled follow-up session.',
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=7),
                'status': 'scheduled',
                'notes': 'Parent meeting scheduled.',
            },
            {
                'patient': patients['Sofia'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=10),
                'status': 'completed',
                'notes': 'Focused on social skills.',
            },
            {
                'patient': patients['Sofia'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=5),
                'status': 'scheduled',
                'notes': 'Scheduled session.',
            },
            {
                'patient': patients['Pedro'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=2),
                'status': 'scheduled',
                'notes': 'Initial assessment session.',
            },
            {
                'patient': patients['Clara'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=3),
                'status': 'canceled',
                'notes': 'Canceled due to patient illness.',
            },
            {
                'patient': patients['Clara'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=1),
                'status': 'completed',
                'notes': 'Sensory integration activities.',
            },
        ]
        
        sessions = {}
        for session_data in sessions_data:
            session = Session.objects.create(
                patient=session_data['patient'],
                therapist=session_data['therapist'],
                date_time=session_data['date_time'],
                status=session_data['status'],
                notes=session_data['notes'],
            )
            key = f"{session.patient.name.split()[0]}_{session_data['status']}"
            if key not in sessions:
                sessions[key] = []
            if isinstance(sessions[key], list):
                sessions[key].append(session)
        
        return sessions

    def create_evolutions(self, sessions, users):
        evolutions_data = [
            {
                'session_key': ('Leonardo_completed', 0),
                'objective': 'Improve verbal requests using Picture Exchange Communication System (PECS)',
                'activities': 'Used PECS Phase 1 pictures for requesting desired items. Practiced "I want" exchanges.',
                'behavior': 'Leonardo showed consistent interest in using pictures to request. Required minimal prompting.',
                'progress': 'Good progress - increased spontaneous requests from 2 to 8 per session.',
                'next_steps': 'Introduce PECS Phase 2 with sentence strips. Practice combining 2 pictures.',
                'released_to_family': True,
            },
            {
                'session_key': ('Leonardo_completed', 1),
                'objective': 'Continue developing verbal imitation and vocalizations',
                'activities': 'Echo practice with vowels and consonants. Ball pop games for fun.',
                'behavior': 'Improved vowel sounds. More engaged when activities are play-based.',
                'progress': 'Increased vocalizations from 3 to 7 per session. Beginning to pair words with actions.',
                'next_steps': 'Continue play-based sound games. Introduce "more" and "up" words.',
                'released_to_family': False,
            },
            {
                'session_key': 'Sofia_completed',
                'objective': 'Develop peer interaction skills during structured activities',
                'activities': 'Turn-taking games with therapist. Parallel play with peer video modeling.',
                'behavior': 'Sofia appropriately requested turns. Made eye contact when asking for help.',
                'progress': 'Improved from 2 to 5 peer interactions per session without prompting.',
                'next_steps': 'Introduce simple cooperative play activities with a peer.',
                'released_to_family': False,
            },
            {
                'session_key': 'Clara_completed',
                'objective': 'Sensory regulation using weighted blanket and tactile activities',
                'activities': 'Weighted blanket time. Playdoh tactile play. Swing activities.',
                'behavior': 'Clara became regulated after 10 minutes with weighted blanket.',
                'progress': ' Able to achieve sensory regulation within 15 minutes (down from 25).',
                'next_steps': 'Continue sensory integration activities. Begin self-regulation checklist.',
                'released_to_family': True,
            },
            {
                'session_key': 'Leonardo_completed',
                'objective': 'Generalization of "more" and "all done" requests',
                'activities': 'Block building with request opportunities. Puzzle activities.',
                'behavior': 'Used "more" and "all done" spontaneously in 3 contexts.',
                'progress': 'Successfully generalized requests across 3 different activities.',
                'next_steps': 'Expand to "I need help" and "open" requests.',
                'released_to_family': True,
            },
        ]
        
        session_list = []
        for key in ['Leonardo_completed', 'Sofia_completed', 'Clara_completed']:
            if key in sessions:
                session_list.extend(sessions[key])
        
        for i, evo_data in enumerate(evolutions_data):
            if i < len(session_list):
                session = session_list[i]
                TherapeuticEvolution.objects.create(
                    session=session,
                    objective=evo_data['objective'],
                    activities=evo_data['activities'],
                    behavior=evo_data['behavior'],
                    progress=evo_data['progress'],
                    next_steps=evo_data['next_steps'],
                    released_to_family=evo_data['released_to_family'],
                )

    def verify_data(self):
        user_count = CustomUser.objects.filter(email__endswith='@spectra.com').count()
        patient_count = Patient.objects.count()
        session_count = Session.objects.count()
        evolution_count = TherapeuticEvolution.objects.count()
        
        self.stdout.write(self.style.SUCCESS(
            f'\nData verification:\n'
            f'  Users: {user_count}\n'
            f'  Patients: {patient_count}\n'
            f'  Sessions: {session_count}\n'
            f'  Evolutions: {evolution_count}\n'
        ))