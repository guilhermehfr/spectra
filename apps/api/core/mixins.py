class RoleBasedAccessMixin:
    """Filtra querysets baseado no role do usuário logado."""

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user

        if not user.is_authenticated:
            return qs.none()

        if user.is_admin():
            return qs

        if user.is_therapist():
            return self.filter_for_therapist(qs, user)

        if user.is_family():
            return self.filter_for_family(qs, user)

        return qs.none()

    def filter_for_therapist(self, qs, user):
        raise NotImplementedError

    def filter_for_family(self, qs, user):
        raise NotImplementedError
