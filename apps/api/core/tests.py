from datetime import date, timedelta

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from core.models import Patient, Session, TherapeuticEvolution

User = get_user_model()


class SpectraTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_user(
            username='admin1',
            email='admin@example.com',
            password='password123',
            role='admin'
        )
        self.therapist = User.objects.create_user(
            username='therapist1',
            email='therapist1@example.com',
            password='password123',
            role='therapist'
        )
        self.therapist2 = User.objects.create_user(
            username='therapist2',
            email='therapist2@example.com',
            password='password123',
            role='therapist'
        )
        self.family = User.objects.create_user(
            username='family1',
            email='family1@example.com',
            password='password123',
            role='family'
        )

        self.patient = Patient.objects.create(
            name='Patient One',
            guardian_name='Guardian One',
            guardian_email='guardian1@example.com'
        )
        self.patient2 = Patient.objects.create(
            name='Patient Two',
            guardian_name='Guardian Two',
            guardian_email='guardian2@example.com',
            birth_date=date(2001, 1, 1)
        )
        self.session = Session.objects.create(
            patient=self.patient,
            therapist=self.therapist,
            date_time=timezone.now() + timedelta(days=1),
            status='scheduled'
        )
        self.session_completed = Session.objects.create(
            patient=self.patient2,
            therapist=self.therapist,
            date_time=timezone.now() + timedelta(days=2),
            status='completed'
        )
        self.session_other_therapist = Session.objects.create(
            patient=self.patient,
            therapist=self.therapist2,
            date_time=timezone.now() + timedelta(days=3),
            status='scheduled'
        )

    def test_soft_delete_patient(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse('core:patient-detail', args=[self.patient.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.patient.refresh_from_db()
        self.assertTrue(self.patient.is_deleted)
        self.assertEqual(Patient.objects.count(), 1)
        self.assertEqual(Patient.all_objects.count(), 2)

    def test_patient_list_pagination(self):
        for i in range(21):
            Patient.objects.create(
                name=f'Paged Patient {i}',
                guardian_name=f'Guardian {i}',
                guardian_email=f'guardian{i}@example.com'
            )

        self.client.force_authenticate(user=self.therapist)
        url = reverse('core:patient-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        expected_count = Patient.objects.count()
        self.assertEqual(response.data['count'], expected_count)
        self.assertEqual(len(response.data['results']), min(20, expected_count))

    def test_patient_filter_birth_date(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse('core:patient-list-create')
        response = self.client.get(url, {'birth_date': '2001-01-01'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.patient2.id)

    def test_patient_search(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse('core:patient-list-create')
        response = self.client.get(url, {'search': 'Two'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['id'], self.patient2.id)

    def test_family_forbidden_patient_list(self):
        self.client.force_authenticate(user=self.family)
        url = reverse('core:patient-list-create')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_sessions_list_permissions(self):
        url = reverse('core:session-list-create')

        self.client.force_authenticate(user=self.therapist)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 2)
        therapist_ids = {item['therapist'] for item in response.data['results']}
        self.assertEqual(therapist_ids, {self.therapist.id})

        self.client.force_authenticate(user=self.admin)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)

    def test_sessions_filter_status(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('core:session-list-create')
        response = self.client.get(url, {'status': 'completed'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)
        self.assertEqual(response.data['results'][0]['status'], 'completed')

    def test_evolution_requires_completed_session(self):
        self.client.force_authenticate(user=self.therapist)
        url = reverse('core:evolution-list-create')

        payload = {
            'session': self.session.id,
            'objective': 'Obj',
            'activities': 'Act',
            'behavior': 'Beh',
            'progress': 'Prog',
            'next_steps': 'Next',
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        payload['session'] = self.session_completed.id
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(TherapeuticEvolution.objects.count(), 1)

    def test_login_returns_tokens(self):
        url = reverse('core:login')
        response = self.client.post(
            url,
            {'email': 'therapist1@example.com', 'password': 'password123'},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertIn('user', response.data)

