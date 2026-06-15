import contextlib

import dj_database_url
import jwt
from django.conf import settings
from django.db import connections
from django.http import HttpRequest

from core.models import Tenant
from core.tenant_context import (
    clear_tenant_db,
    clear_tenant_id,
    set_tenant_db,
    set_tenant_id,
)

SKIP_PATHS = ['/api/auth/login/', '/api/health/']


class TenantMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def _register_tenant_db(self, db_url: str) -> None:
        parsed = dj_database_url.parse(db_url)
        conn_defaults = {
            'TIME_ZONE': None,
            'ATOMIC_REQUESTS': False,
            'AUTOCOMMIT': True,
            'CONN_MAX_AGE': 0,
            'CONN_HEALTH_CHECKS': False,
            'OPTIONS': {},
        }
        for k, v in conn_defaults.items():
            parsed.setdefault(k, v)
        for k in ['USER', 'PASSWORD', 'HOST', 'PORT']:
            parsed.setdefault(k, '')
        parsed.setdefault('TEST', {
            'CHARSET': None, 'COLLATION': None, 'MIGRATE': True,
            'MIRROR': None, 'NAME': None,
        })
        parsed.setdefault('DISABLE_SERVER_SIDE_CURSORS', False)
        settings.DATABASES['tenant'] = parsed
        # delete cached connection so it re-creates with real engine
        with contextlib.suppress(Exception):
            del connections['tenant']

    def __call__(self, request: HttpRequest):
        if any(request.path.startswith(p) for p in SKIP_PATHS):
            return self.get_response(request)

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return self.get_response(request)

        token = auth_header.removeprefix('Bearer ')
        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=['HS256'],
                options={'verify_exp': False},
            )
        except jwt.InvalidTokenError:
            return self.get_response(request)

        tenant_id = payload.get('tenant_id')
        if tenant_id is None:
            return self.get_response(request)

        try:
            tenant = Tenant.objects.using('default').get(id=tenant_id)
        except Tenant.DoesNotExist:
            return self.get_response(request)

        self._register_tenant_db(tenant.db_url)
        set_tenant_db('tenant')
        set_tenant_id(tenant_id)
        response = self.get_response(request)
        clear_tenant_id()
        clear_tenant_db()
        return response
