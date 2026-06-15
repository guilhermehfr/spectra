import contextvars

_tenant_db: contextvars.ContextVar[str | None] = contextvars.ContextVar('tenant_db', default=None)
_tenant_id: contextvars.ContextVar[int | None] = contextvars.ContextVar('tenant_id', default=None)


def set_tenant_db(db_url: str) -> None:
    _tenant_db.set(db_url)


def get_tenant_db() -> str | None:
    return _tenant_db.get()


def clear_tenant_db() -> None:
    _tenant_db.set(None)


def set_tenant_id(tenant_id: int) -> None:
    _tenant_id.set(tenant_id)


def get_tenant_id() -> int | None:
    return _tenant_id.get()


def clear_tenant_id() -> None:
    _tenant_id.set(None)
