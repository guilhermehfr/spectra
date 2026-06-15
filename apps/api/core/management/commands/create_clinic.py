import dj_database_url
from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connections

from core.models import CustomUser, Tenant


class Command(BaseCommand):
    help = 'Create a new clinic (tenant) with its own database'

    def add_arguments(self, parser):
        parser.add_argument('--name', required=True, help='Clinic display name')
        parser.add_argument('--db-url', required=True, help='Clinic PostgreSQL connection string')
        parser.add_argument('--subdomain', required=True, help='Clinic subdomain identifier')

    def handle(self, *args, **options):
        name = options['name']
        db_url = options['db_url']
        subdomain = options['subdomain']

        # 1. Create Tenant record in central database
        tenant = Tenant.objects.using('default').create(
            name=name,
            db_url=db_url,
            subdomain=subdomain,
        )
        self.stdout.write(f'Tenant "{name}" created (id={tenant.id})')

        # 2. Register tenant database connection dynamically
        parsed = dj_database_url.parse(db_url)
        parsed.setdefault('ATOMIC_REQUESTS', False)
        parsed.setdefault('AUTOCOMMIT', True)
        parsed.setdefault('CONN_MAX_AGE', 0)
        parsed.setdefault('CONN_HEALTH_CHECKS', False)
        parsed.setdefault('OPTIONS', {})
        parsed.setdefault('TIME_ZONE', None)
        for setting in ['NAME', 'USER', 'PASSWORD', 'HOST', 'PORT']:
            parsed.setdefault(setting, '')
        parsed.setdefault(
            'TEST',
            {
                'CHARSET': None,
                'COLLATION': None,
                'MIGRATE': True,
                'MIRROR': None,
                'NAME': None,
            },
        )
        settings.DATABASES['tenant'] = parsed
        if connections['tenant']:
            connections['tenant'].close()

        # 3. Run migrations on tenant database
        self.stdout.write('Running migrations on tenant database...')
        call_command('migrate', database='tenant')
        self.stdout.write(self.style.SUCCESS('Migrations applied'))

        # 4. Create default users in the central database
        users_data = [
            (f'{subdomain}_admin', f'admin@{subdomain}.spectra.com', 'admin123', 'admin'),
            (
                f'{subdomain}_therapist',
                f'therapist@{subdomain}.spectra.com',
                'therapist123',
                'therapist',
            ),
            (f'{subdomain}_family', f'family@{subdomain}.spectra.com', 'family123', 'family'),
        ]
        for username, email, password, role in users_data:
            CustomUser.objects.create_user(
                username=username,
                email=email,
                password=password,
                role=role,
                is_active=True,
                tenant=tenant,
            )
            self.stdout.write(f'  Created {role}: {email} (tenant_id={tenant.id})')

        # 5. Cleanup
        del settings.DATABASES['tenant']

        self.stdout.write(
            self.style.SUCCESS(
                f'Clinic "{name}" created successfully!\n'
                f'  Tenant ID: {tenant.id}\n'
                f'  Subdomain: {subdomain}\n'
                f'  Admin ({subdomain}_admin): admin@{subdomain}.spectra.com / admin123\n'
                f'  Therapist ({subdomain}_therapist):'
                f' therapist@{subdomain}.spectra.com / therapist123\n'
                f'  Family ({subdomain}_family): family@{subdomain}.spectra.com / family123'
            )
        )
