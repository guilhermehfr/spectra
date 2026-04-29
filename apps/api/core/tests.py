from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from core.models import Patient, Session

User = get_user_model()

class SpectraTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.therapist = User.objects.create_user(
            username='therapist1',
            password='password123',
            role='therapist'
        )
        self.patient = Patient.objects.create(
            name='Patient One'
        )
        self.session = Session.objects.create(
            patient=self.patient,
            therapist=self.therapist,
            date_time='2024-01-01T10:00:00Z',
            status='scheduled'
        )

    def test_soft_delete_patient(self):
        # Authenticate
        self.client.force_authenticate(user=self.therapist)
        
        # Soft delete
        url = reverse('core:patient-detail', args=[self.patient.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify it's soft deleted
        self.patient.refresh_from_db()
        self.assertTrue(self.patient.is_deleted)
        
        # Ensure it doesn't show up in normal queries
        self.assertEqual(Patient.objects.count(), 0)
        
        # Ensure it's still available in all_objects
        self.assertEqual(Patient.all_objects.count(), 1)

