from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import timedelta
from core.models import CustomUser, Patient, Session, TherapeuticEvolution


class Command(BaseCommand):
    help = 'Popular o banco de dados com dados de teste para desenvolvimento'

    def handle(self, *args, **options):
        self.stdout.write('Limpando dados existentes...')
        self.clear_data()

        self.stdout.write('Criando usuários...')
        users = self.create_users()

        self.stdout.write('Criando pacientes...')
        patients = self.create_patients(users)

        self.stdout.write('Criando sessões...')
        sessions = self.create_sessions(users, patients)

        self.stdout.write('Criando evoluções...')
        self.create_evolutions(sessions, users)

        self.verify_data()
        self.stdout.write(self.style.SUCCESS('Seed concluído com sucesso!'))

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
                'notes': 'Paciente com TEA nível 2. Altamente responsivo à terapia ABA.',
            },
            {
                'name': 'Sofia Rodrigues',
                'birth_date': '2016-07-22',
                'guardian_name': 'João Rodrigues',
                'guardian_email': 'joao.rod@email.com',
                'notes': 'Paciente com TEA nível 1. Boa comunicação verbal.',
            },
            {
                'name': 'Pedro Alves',
                'birth_date': '2018-11-05',
                'guardian_name': 'Fernanda Alves',
                'guardian_email': 'fernanda@email.com',
                'notes': 'Paciente com TEA nível 2. Se beneficia de agendas visuais.',
            },
            {
                'name': 'Clara Mendes',
                'birth_date': '2015-04-18',
                'guardian_name': 'Roberto Mendes',
                'guardian_email': 'roberto@email.com',
                'notes': 'Paciente com TEA nível 3. Requer mais suporte individual.',
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
                'notes': 'Sessão concluída com sucesso.',
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=7),
                'status': 'completed',
                'notes': 'Bom progresso em solicitações verbais.',
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=3),
                'status': 'scheduled',
                'notes': 'Sessão de acompanhamento agendada.',
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=7),
                'status': 'scheduled',
                'notes': 'Reunião com responsáveis agendada.',
            },
            {
                'patient': patients['Sofia'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=10),
                'status': 'completed',
                'notes': 'Focado em habilidades sociais.',
            },
            {
                'patient': patients['Sofia'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=5),
                'status': 'scheduled',
                'notes': 'Sessão agendada.',
            },
            {
                'patient': patients['Pedro'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=2),
                'status': 'scheduled',
                'notes': 'Sessão de avaliação inicial.',
            },
            {
                'patient': patients['Clara'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=3),
                'status': 'canceled',
                'notes': 'Cancelado devido a doença do paciente.',
            },
            {
                'patient': patients['Clara'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=1),
                'status': 'completed',
                'notes': 'Atividades de integração sensorial.',
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
                'objective': 'Melhorar solicitações verbais usando o Sistema de Comunicação por Troca de Imagens (PECS)',
                'activities': 'Utilizadas imagens do PECS Fase 1 para solicitar itens desejados. Praticadas trocas "Eu quero".',
                'behavior': 'Leonardo mostrou interesse consistente em usar imagens para solicitar. Necesitou prompting mínimo.',
                'progress': 'Bom progresso - aumentou solicitações espontâneas de 2 para 8 por sessão.',
                'next_steps': 'Introduzir PECS Fase 2 com frases. Praticar combinação de 2 imagens.',
                'released_to_family': True,
            },
            {
                'session_key': ('Leonardo_completed', 1),
                'objective': 'Continuar desenvolvendo imitação verbal e vocalizações',
                'activities': 'Prática de eco com vogais e consoantes. Jogos de estoura bolhas para diversão.',
                'behavior': 'Melhorou sons de vogais. Mais engajado quando atividades são lúdicas.',
                'progress': 'Aumentou vocalizações de 3 para 7 por sessão. Começando a associar palavras com ações.',
                'next_steps': 'Continuar jogos sonoros lúdicos. Introduzir palavras "mais" e "pra cima".',
                'released_to_family': False,
            },
            {
                'session_key': 'Sofia_completed',
                'objective': 'Desenvolver habilidades de interação com pares durante atividades estruturadas',
                'activities': 'Jogos de alternância com terapeuta. Brincadeira paralela com modelagem em vídeo.',
                'behavior': 'Sofia solicitou turnos de forma apropriada. Fez contato visual ao pedir ajuda.',
                'progress': 'Melhorou de 2 para 5 interações com pares por sessão sem prompting.',
                'next_steps': 'Introduzir atividades cooperativas simples com um par.',
                'released_to_family': False,
            },
            {
                'session_key': 'Clara_completed',
                'objective': 'Regulação sensorial usando cobertor weighted e atividades táteis',
                'activities': 'Tempo com cobertor weighted. Brincadeira com massinha. Atividades de balanço.',
                'behavior': 'Clara se regulou após 10 minutos com o cobertor weighted.',
                'progress': 'Capaz de atingir regulação sensorial em 15 minutos (reduzido de 25).',
                'next_steps': 'Continuar atividades de integração sensorial. Iniciar lista de autorregulação.',
                'released_to_family': True,
            },
            {
                'session_key': 'Leonardo_completed',
                'objective': 'Generalização de solicitações "mais" e "terminou"',
                'activities': 'Construção com blocos com oportunidades de solicitação. Atividades de quebra-cabeça.',
                'behavior': 'Usou "mais" e "terminou" espontaneamente em 3 contextos.',
                'progress': 'Generalizou solicitações com sucesso em 3 atividades diferentes.',
                'next_steps': 'Expandir para "preciso de ajuda" e "abre".',
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
                    created_by=session.therapist,  # Author is the therapist who conducted the session
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
            f'\nVerificação de dados:\n'
            f'  Usuários: {user_count}\n'
            f'  Pacientes: {patient_count}\n'
            f'  Sessões: {session_count}\n'
            f'  Evoluções: {evolution_count}\n'
        ))