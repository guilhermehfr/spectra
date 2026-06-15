from core.tenant_context import get_tenant_db

central_models = ['tenant', 'customuser']


class TenantNotSetError(Exception):
    pass


class TenantDatabaseRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label != 'core':
            return 'default'
        if model._meta.model_name in central_models:
            return 'default'
        tenant_db = get_tenant_db()
        if tenant_db is None:
            raise TenantNotSetError('No tenant database set for this request')
        return tenant_db

    def db_for_write(self, model, **hints):
        return self.db_for_read(model, **hints)

    def allow_relation(self, obj1, obj2, **hints):
        db_set = {self.db_for_read(obj1._meta.model), self.db_for_read(obj2._meta.model)}
        if len(db_set) == 1:
            return True
        # Allow cross-DB FKs between central and tenant models
        model_names = {obj1._meta.model_name, obj2._meta.model_name}
        return any(m in central_models for m in model_names)

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        if app_label != 'core':
            return db == 'default'
        if model_name in central_models:
            return db == 'default'
        return db != 'default'
