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
                'email': 'beatriz@spectra.com',
                'username': 'beatriz',
                'password': 'therapist123',
                'first_name': 'Beatriz',
                'last_name': 'Fonseca',
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
            # ── Pacientes originais (notas expandidas) ──────────────────────
            {
                'name': 'Leonardo Silva',
                'birth_date': '2017-03-10',
                'guardian_name': 'Maria Silva',
                'guardian_email': 'maria@spectra.com',
                'notes': (
                    'Diagnóstico: TEA nível 2 (CID-10: F84.0), com comorbidade de TDAH predominantemente '
                    'hiperativo-impulsivo (CID-10: F90.1), confirmado por avaliação neuropsicológica em janeiro de 2023. '
                    'Leonardo tem 7 anos e frequenta o 1º ano do ensino fundamental em escola regular com suporte de '
                    'cuidador em tempo integral. Apresenta atraso significativo na linguagem expressiva, comunicando-se '
                    'principalmente por vocalizações, gestos e algumas palavras isoladas. A compreensão receptiva é '
                    'superior à expressiva. Demonstra alta responsividade à terapia ABA, especialmente em contextos '
                    'lúdicos com reforçadores tangíveis (bolas, blocos de encaixe coloridos e música instrumental). '
                    'Apresenta comportamentos repetitivos como alinhar objetos e girar peças, que não interferem '
                    'significativamente na rotina. A hiperatividade dificulta a manutenção da atenção por mais de '
                    '5 minutos em tarefas não preferidas; estratégias de first-then e token economy têm sido eficazes '
                    'para aumentar o tempo em tarefa. Não apresenta comportamentos autolesivos. A família é altamente '
                    'engajada e realiza generalização das habilidades no ambiente doméstico com orientação da terapeuta.'
                ),
            },
            {
                'name': 'Sofia Rodrigues',
                'birth_date': '2016-07-22',
                'guardian_name': 'João Rodrigues',
                'guardian_email': 'joao.rod@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 1 (CID-10: F84.0), com comorbidade de Transtorno de Ansiedade '
                    'Generalizada (CID-10: F41.1), diagnosticada por equipe multiprofissional em março de 2022. '
                    'Sofia tem 8 anos e está no 2º ano do ensino fundamental em escola regular sem suporte individual, '
                    'com acompanhamento pedagógico especializado duas vezes por semana. Possui comunicação verbal '
                    'funcional, formando frases completas, porém com dificuldades pragmáticas como manutenção do '
                    'tópico, leitura de pistas não-verbais e manejo de situações de mudança inesperada de rotina, '
                    'que frequentemente desencadeiam crises de ansiedade. Demonstra interesse intenso em animais, '
                    'especialmente cachorros e golfins, e esse tema tem sido utilizado como motivador em sessões. '
                    'A ansiedade se manifesta principalmente por choro, recusa e comportamentos de fuga diante de '
                    'tarefas novas ou ambientes barulhentos. Estratégias de dessensibilização gradual, modelação '
                    'e ensino de auto-regulação emocional têm apresentado resultados positivos. O pai participa '
                    'ativamente das sessões de orientação familiar quinzenais.'
                ),
            },
            {
                'name': 'Pedro Alves',
                'birth_date': '2018-11-05',
                'guardian_name': 'Fernanda Alves',
                'guardian_email': 'fernanda@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 2 (CID-10: F84.0), com hipersensibilidade sensorial significativa '
                    '(tátil, auditiva e olfativa) identificada em avaliação de integração sensorial pela terapeuta '
                    'ocupacional em outubro de 2023. Pedro tem 6 anos e está em fase de adaptação à pré-escola, '
                    'com frequência parcial de 3 dias por semana. Comunica-se por meio de palavras isoladas e '
                    'alguns sinais de LIBRAS adaptados que a família introduziu. Responde bem a agendas visuais '
                    'com pictogramas, as quais foram implementadas tanto na clínica quanto no ambiente doméstico. '
                    'Apresenta comportamentos de recusa intensa a estímulos táteis inesperados (toque não-anunciado, '
                    'texturas específicas de alimentos e roupas), o que impacta a rotina de higiene e alimentação. '
                    'A mãe relata episódios frequentes de choro intenso e auto-regulação prejudicada em ambientes '
                    'barulhentos, como supermercados e festas. O plano terapêutico atual prioriza: (1) integração '
                    'sensorial com dieta sensorial personalizada; (2) expansão do repertório comunicativo via PECS '
                    'e CAA; (3) habilidades de vida diária com cadeia de tarefas para higiene pessoal.'
                ),
            },
            {
                'name': 'Clara Mendes',
                'birth_date': '2015-04-18',
                'guardian_name': 'Roberto Mendes',
                'guardian_email': 'roberto@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 3 (CID-10: F84.0), com comorbidade de Epilepsia focal (CID-10: G40.1), '
                    'controlada com uso de Valproato de Sódio 500mg/dia, sob acompanhamento neurológico mensal. '
                    'Clara tem 9 anos e está matriculada em escola especial, com frequência de 5 dias por semana. '
                    'Não utiliza comunicação verbal funcional; a comunicação ocorre principalmente por meio de '
                    'vocalizações, expressões faciais e pointing para objetos de interesse imediato. Um sistema de '
                    'CAA com tablet foi introduzido há 4 meses e Clara demonstra progresso gradual no uso de '
                    'pictogramas para expressar necessidades básicas (comer, beber, banheiro, descansar). '
                    'Requer suporte intensivo em todas as atividades de vida diária. Apresenta comportamentos '
                    'desafiadores como birras prolongadas (até 20 minutos) e recusa alimentar para texturas lisas. '
                    'A equipe realiza reunião mensal com a escola especial e a família para alinhamento de '
                    'estratégias e monitoramento dos programas comportamentais. O pai é o principal cuidador e '
                    'relata cansaço significativo; foi encaminhado para grupo de apoio a familiares.'
                ),
            },
            # ── Novos pacientes ─────────────────────────────────────────────
            {
                'name': 'Gabriel Ferreira',
                'birth_date': '2016-09-14',
                'guardian_name': 'Luciana Ferreira',
                'guardian_email': 'luciana.ferreira@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 1 (CID-10: F84.0), com comorbidade de TDAH predominantemente '
                    'desatento (CID-10: F90.0), diagnosticados em avaliação multidisciplinar em junho de 2022. '
                    'Gabriel tem 9 anos e cursa o 3º ano do ensino fundamental em escola regular, com bom '
                    'desempenho acadêmico nas disciplinas de ciências e matemática, mas apresenta dificuldades '
                    'significativas em língua portuguesa (especialmente produção textual) e nas interações '
                    'sociais com colegas. A desatenção manifesta-se por esquecimentos frequentes de materiais, '
                    'dificuldade em seguir instruções com múltiplos passos e tendência a "desligar" em atividades '
                    'que considera pouco estimulantes. Demonstra interesse especial em dinossauros e astronomia, '
                    'o que é amplamente utilizado como motivador nas sessões. Possui vocabulário rico e raciocínio '
                    'lógico acima da média para a faixa etária, porém tem dificuldade em calibrar a comunicação '
                    'ao interlocutor (fala muito sobre seus interesses sem perceber o desinteresse do outro). '
                    'O plano terapêutico foca em: habilidades pragmáticas de comunicação, estratégias de '
                    'organização e autorregulação da atenção, e ensino explícito de habilidades sociais.'
                ),
            },
            {
                'name': 'Isabela Santana',
                'birth_date': '2019-02-28',
                'guardian_name': 'Camila Santana',
                'guardian_email': 'camila.santana@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 2 (CID-10: F84.0), com comorbidade de Transtorno de Ansiedade '
                    'de Separação (CID-10: F93.0), identificada em avaliação psicológica em setembro de 2023. '
                    'Isabela tem 6 anos e ainda não está matriculada em escola; a família está em processo de '
                    'busca por instituição com suporte adequado. Comunica-se com frases curtas de 2 a 3 palavras '
                    'e apresenta ecolalia funcional e não-funcional. A ansiedade de separação é intensa: chora '
                    'por até 30 minutos no início de cada sessão quando a mãe se afasta, o que tem sido trabalhado '
                    'com protocolo de dessensibilização gradual ao longo dos últimos 2 meses, com progresso '
                    'observável (redução para 10 minutos nas últimas 3 semanas). Demonstra forte interesse em '
                    'música e responde muito bem a atividades mediadas por canções. Apresenta comportamentos '
                    'ritualísticos em relação à ordem dos objetos e às rotinas de entrada e saída da sala de '
                    'atendimento, que têm sido gradualmente flexibilizados. A mãe participa de todas as sessões '
                    'e está em processo de treinamento para manejo da ansiedade de separação no contexto doméstico.'
                ),
            },
            {
                'name': 'Mateus Oliveira',
                'birth_date': '2014-06-03',
                'guardian_name': 'Paulo Oliveira',
                'guardian_email': 'paulo.oliveira@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 2 (CID-10: F84.0), com comorbidade de Transtorno Obsessivo-Compulsivo '
                    '(CID-10: F42), avaliado por psiquiatra infantil em fevereiro de 2023, com uso de Fluoxetina '
                    '10mg/dia sob acompanhamento. Mateus tem 11 anos e está no 5º ano do ensino fundamental, '
                    'com suporte de professora de recurso no contra-turno. Possui comunicação verbal fluente, '
                    'com discurso organizado, mas apresenta rigidez cognitiva acentuada e dificuldade em tolerar '
                    'situações ambíguas ou sem regras claras. Os comportamentos compulsivos incluem verificação '
                    'repetitiva de materiais escolares, necessidade de simetria na organização do ambiente e '
                    'rituais de entrada em novos espaços. A diferenciação entre características do TEA e do TOC '
                    'é monitorada em conjunto com a equipe psiquiátrica. Demonstra interesse intenso em xadrez '
                    'e jogos de estratégia, habilidade que tem sido utilizada para treino de flexibilidade '
                    'cognitiva. O plano terapêutico integra técnicas de ABA com elementos de TCC adaptada, '
                    'incluindo exposição e prevenção de resposta para os rituais compulsivos.'
                ),
            },
            {
                'name': 'Laura Pimentel',
                'birth_date': '2017-12-19',
                'guardian_name': 'Renata Pimentel',
                'guardian_email': 'renata.pimentel@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 1 (CID-10: F84.0), com comorbidade de Dislexia do Desenvolvimento '
                    '(CID-10: F81.0), identificada em avaliação neuropsicológica em abril de 2024. Laura tem '
                    '7 anos e está no 1º ano do ensino fundamental. Apresenta comunicação verbal desenvolvida '
                    'para a faixa etária, com boa capacidade de narrar eventos e expressar emoções quando '
                    'está regulada. As dificuldades escolares se concentram na decodificação fonêmica e na '
                    'fluência leitora, causando frustração e comportamentos de recusa escolar (relatos da '
                    'mãe de 2 a 3 episódios por semana). Demonstra habilidade acima da média para memória '
                    'visual e construção com blocos (LEGO). O trabalho terapêutico integra: (1) habilidades '
                    'sociais e regulação emocional, focando na tolerância à frustração escolar; (2) estratégias '
                    'de compensação visual para apoio à leitura; (3) interface com a escola para adaptações '
                    'curriculares. A mãe é professora e demonstra alta compreensão do perfil da filha, '
                    'sendo parceira ativa no processo terapêutico.'
                ),
            },
            {
                'name': 'Heitor Campos',
                'birth_date': '2018-04-07',
                'guardian_name': 'Sandra Campos',
                'guardian_email': 'sandra.campos@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 2 (CID-10: F84.0), com comorbidade de Transtorno de Processamento '
                    'Auditivo Central (TPAC), confirmado por fonoaudióloga em julho de 2023. Heitor tem 7 anos '
                    'e frequenta o 1º ano do ensino fundamental com suporte de intérprete educacional. '
                    'Apresenta linguagem expressiva com vocabulário funcional, porém com dificuldade na '
                    'compreensão de instruções longas, especialmente em ambientes com ruído de fundo, o que '
                    'é agravado pelo TPAC. A escola adaptou o ambiente com painéis absorventes de som e '
                    'o professor utiliza microfone de lapela. Demonstra interesse em veículos e transportes, '
                    'e esse tema motiva alto engajamento nas atividades. Apresenta comportamento de "congelar" '
                    '(parar e não responder) quando recebe instruções que não processou adequadamente, '
                    'frequentemente interpretado erroneamente como recusa. A equipe trabalha com a escola '
                    'e a família para diferenciação entre não-compreensão e recusa, e para uso consistente '
                    'de suportes visuais que acompanhem as instruções verbais.'
                ),
            },
            {
                'name': 'Valentina Cruz',
                'birth_date': '2015-08-30',
                'guardian_name': 'André Cruz',
                'guardian_email': 'andre.cruz@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 3 (CID-10: F84.0), com comorbidade de Deficiência Intelectual '
                    'Moderada (CID-10: F71) e Transtorno do Sono (CID-10: G47.0), em acompanhamento com '
                    'neurologista pediátrico. Valentina tem 10 anos e está matriculada em escola especial '
                    'em período integral. Não possui comunicação verbal funcional; utiliza sistema de CAA '
                    'com prancha de alta tecnologia (tablet com software Tobii Snap Core First) para '
                    'expressar necessidades e preferências em contexto estruturado. O distúrbio do sono '
                    '(insônia de manutenção, acordando 3 a 4 vezes por noite) impacta diretamente o '
                    'desempenho nas sessões e na escola; a família está em processo de implementação de '
                    'protocolo de higiene do sono orientado pela equipe. Apresenta comportamento autolesivo '
                    'de baixa intensidade (bater a mão na cabeça) associado a momentos de frustração e '
                    'transições não-sinalizadas. O plano de comportamento positivo (PBS) está em vigência, '
                    'com estratégias de antecipação de transições, enriquecimento ambiental e reforçamento '
                    'diferencial de comportamentos alternativos (RDA). O pai é o cuidador principal e '
                    'recebe suporte mensal da equipe clínica.'
                ),
            },
            {
                'name': 'Enzo Barbosa',
                'birth_date': '2020-01-15',
                'guardian_name': 'Tatiane Barbosa',
                'guardian_email': 'tatiane.barbosa@email.com',
                'notes': (
                    'Diagnóstico: TEA nível 2 (CID-10: F84.0), com comorbidade de Atraso Global do '
                    'Desenvolvimento (CID-10: F89), recebeu diagnóstico recente em março de 2024 após '
                    'avaliação multidisciplinar. Enzo tem 5 anos e ainda não está em escola; a família '
                    'aguarda vaga em CMEI com suporte. Não utiliza comunicação verbal; comunica-se por '
                    'gestos, pointing e contato ocular intencional. Apresenta habilidades de imitação '
                    'motora emergentes, que têm sido trabalhadas como porta de entrada para o desenvolvimento '
                    'da linguagem. Demonstra prazer em atividades de encaixe, empilhamento e exploração '
                    'de objetos com diferentes texturas. A família recebeu o diagnóstico recentemente e '
                    'ainda está em processo de elaboração e aceitação; a mãe relata sentimentos de culpa '
                    'e sobrecarga, tendo sido encaminhada para acompanhamento psicológico individual. '
                    'O plano terapêutico atual prioriza: (1) desenvolvimento de pré-requisitos para '
                    'linguagem (imitação, atenção compartilhada, contato ocular funcional); (2) introdução '
                    'de sistema de CAA simplificado; (3) treinamento intensivo de pais com foco em '
                    'naturalistic developmental behavioral interventions (NDBI).'
                ),
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
        therapist_beatriz = users.get('beatriz')
        now = timezone.now()

        sessions_data = [
            # ── Leonardo Silva ──────────────────────────────────────────────
            # Sessões históricas (últimos 3 meses)
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=88),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos focada em PECS Fase 2 - persistência comunicativa. '
                    'Leonardo praticou o protocolo "esperar enquanto o comunicador não responde": '
                    'mantinha a imagem por até 10 segundos antes de repetir. '
                    'Foram realizadas 20 tentativas com 60% de sucesso. '
                    'Reforço: acesso a tablet com desenho animado por 3 minutos após cada acerto.'
                ),
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=75),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com foco em imitação verbal de sons vocálicos (/a/, /o/, /u/). '
                    'Atividades com jogos sonoros: apito, tamborim e bolha de sabão. '
                    'Leonardo emitiu sons vocálicos em 8 de 15 oportunidades (53%成功率). '
                    'Progresso em relação à linha de base (2/15). Reforço: snack de cereal.'
                ),
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=61),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos dedicada ao treino de contato visual funcional. '
                    'Protocolo: olhar-pegar (mandatório para receber item desejado). '
                    'Leonardo atingiu 70% de contato visual espontâneo (7/10 tentativas). '
                    'Uso de preferir-historinha como recurso motivador.'
                ),
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=47),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com foco em auto-regulação emocional. '
                    'Ensino da estratégia "parar-respirar-continuar" com suporte visual. '
                    'Leonardo apresentou 3 episódios de birra durante transições (reduceis). '
                    'Utilizou o cartão de respiração em 2 de 3 oportunidades. '
                    'Reforço: tempo extra no tablet (5 min追加).'
                ),
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=33),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos de habilidades sociais via jogo paralelo -> compartilhado. '
                    'Atividade: construção conjunta com blocos. Leonardo aceitou dividir espaço '
                    'com a terapeuta após negociação visual. Manteve interação por 12 minutos contínuos. '
                    'Uso de reforçador social: elogio específico ("que bom trabalho em equipe!").'
                ),
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=19),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos de atenção compartilhada via jogo de causa-e-feito. '
                    'Atividade: bola que rola e cai no balde, com alternância de turnos. '
                    'Leonardo solicitou continuidade do jogo em 4 oportunidades (vocalização + gesto). '
                    'Indicador de atenção joint emergente: seguiu olhar da terapeuta para objeto 3x.'
                ),
            },
            # Sessões mais recentes (manter as existentes)
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=14),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos focada em comunicação funcional via PECS Fase 1. '
                    'Leonardo chegou agitado, possivelmente devido à mudança de trajeto relatada pela mãe. '
                    'Foi necessário período de transição de 8 minutos com atividade de escolha livre '
                    'antes de iniciar a parte estruturada. Após regulação, engajou-se bem nas atividades. '
                    'Reforçadores primários utilizados: uva-passa e suco de maçã. Reforçadores secundários: '
                    'elogio verbal e acesso a 2 minutos de música após cada bloco de tentativas.'
                ),
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=7),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com foco em imitação verbal e expansão de solicitações. '
                    'Leonardo apresentou boa disposição desde a chegada, o que facilitou a transição '
                    'para as atividades estruturadas sem necessidade de período de espera. A token economy '
                    '(5 fichas para ganhar acesso a 5 minutos de atividade preferida) funcionou bem para '
                    'manter o tempo em tarefa acima de 8 minutos por bloco. A mãe aguardou na sala de espera '
                    'e foi orientada ao final sobre as estratégias a generalizar em casa durante a semana.'
                ),
            },
            # Sessões agendadas
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=7),
                'status': 'scheduled',
                'notes': (
                    'Sessão de acompanhamento do programa PECS Fase 2. '
                    'Avaliar generalização das habilidades de persistência comunicativa. '
                    'Testar com novo interlocutor (terapeuta auxiliar).'
                ),
            },
            {
                'patient': patients['Leonardo'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=14),
                'status': 'scheduled',
                'notes': (
                    'Sessão de orientação familiar com presença da mãe. '
                    'Revisão de progresso das últimas 4 semanas. '
                    'Alinhamento de estratégias para generalização em casa.'
                ),
            },
            # ── Sofia Rodrigues ─────────────────────────────────────────────
            {
                'patient': patients['Sofia'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=10),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com foco em habilidades sociais e manejo da ansiedade em '
                    'situações de mudança de atividade. Sofia chegou ansiosa relatando que houve uma '
                    'substituição de professor na escola naquela manhã, o que a deixou desregulada. '
                    'Os primeiros 15 minutos foram dedicados a estratégias de regulação: respiração '
                    'diafragmática guiada, uso do termômetro de emoções e conversa sobre a situação '
                    'na escola com validação emocional. Após regulação, foi possível trabalhar a '
                    'atividade planejada de role-play de interação social com apoio de fantoches.'
                ),
            },
            {
                'patient': patients['Sofia'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=5),
                'status': 'scheduled',
                'notes': (
                    'Sessão programada para continuidade do módulo de habilidades sociais: reconhecimento '
                    'de expressões faciais e prosódia emocional com uso de cartões ilustrados e vídeos '
                    'curtos. Introduzir exercício de "detetive social" onde Sofia identifica emoções em '
                    'cenas do cotidiano escolar. Verificar com a mãe se houve novos episódios de ansiedade '
                    'na escola na semana corrente e ajustar conteúdo se necessário.'
                ),
            },
            # ── Pedro Alves ─────────────────────────────────────────────────
            {
                'patient': patients['Pedro'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=12),
                'status': 'completed',
                'notes': (
                    'Sessão inicial de avaliação funcional e estabelecimento de vínculo terapêutico. '
                    'Pedro chegou acompanhado pela mãe e demonstrou resistência intensa à separação '
                    'na porta da sala, necessitando de 15 minutos de transição gradual com a mãe '
                    'presente e se afastando progressivamente. A sessão foi conduzida majoritariamente '
                    'em contexto de brincar livre para coleta de informações sobre preferências, '
                    'repertório comunicativo e respostas a diferentes estímulos sensoriais. '
                    'Observou-se hipersensibilidade tátil clara ao contato com massinha de modelar '
                    'e papel crepom. Tolera bem texturas lisas e superfícies firmes.'
                ),
            },
            {
                'patient': patients['Pedro'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=2),
                'status': 'scheduled',
                'notes': (
                    'Segunda sessão programada com objetivo de iniciar a dieta sensorial individualizada '
                    'e introduzir o primeiro conjunto de pictogramas da agenda visual para a rotina '
                    'da sessão (chegada, atividade 1, lanche, atividade 2, despedida). Incluir atividade '
                    'de integração sensorial com caixa de areia cinética, avaliando resposta tátil. '
                    'Verificar com a mãe a implementação da agenda visual em casa e eventuais dificuldades.'
                ),
            },
            {
                'patient': patients['Pedro'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=9),
                'status': 'scheduled',
                'notes': (
                    'Sessão de continuidade com revisão da agenda visual e expansão do vocabulário '
                    'em PECS. Planejar atividades de matching e discriminação de imagens como pré-requisito '
                    'para o PECS Fase 1. Incluir dieta sensorial com atividades proprioceptivas '
                    '(empurrar e puxar objetos, atividades com resistência) para regulação inicial.'
                ),
            },
            # ── Clara Mendes ─────────────────────────────────────────────────
            {
                'patient': patients['Clara'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=3),
                'status': 'canceled',
                'notes': (
                    'Sessão cancelada pela família com 2 horas de antecedência. O responsável informou '
                    'que Clara apresentou crise epiléptica na noite anterior com duração de 3 minutos, '
                    'seguida de sono prolongado (período pós-ictal). Neurologista foi acionado e orientou '
                    'repouso por 24 horas e monitoramento. Sessão reagendada. Equipe foi informada e '
                    'anotação realizada no prontuário para acompanhamento da frequência de crises no mês.'
                ),
            },
            {
                'patient': patients['Clara'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=1),
                'status': 'completed',
                'notes': (
                    'Sessão de 45 minutos (reduzida em relação ao padrão de 50 devido ao estado de '
                    'Clara no início — apresentava irritabilidade e baixa tolerância à frustração). '
                    'A sessão foi reestruturada para priorizar atividades de regulação sensorial e '
                    'comunicação básica via CAA, suspendendo os programas de habilidades acadêmicas '
                    'funcionais planejados. Foram realizadas atividades de integração sensorial com '
                    'cobertor weighted (10 min), balanço linear (8 min) e exploração de caixa de areia. '
                    'Clara se regulou progressivamente e finalizou a sessão de forma tranquila.'
                ),
            },
            # ── Gabriel Ferreira ─────────────────────────────────────────────
            {
                'patient': patients['Gabriel'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=11),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com foco em habilidades pragmáticas de comunicação. '
                    'Gabriel chegou animado e iniciou imediatamente um monólogo sobre dinossauros '
                    'do período Jurássico, o que foi utilizado como ponto de entrada para trabalhar '
                    'a habilidade de "checar o interesse do ouvinte" e fazer perguntas ao interlocutor. '
                    'Foram realizados role-plays de conversas equilibradas usando o "balão de fala" '
                    'como suporte visual para o tempo de cada turno conversacional. Gabriel compreendeu '
                    'bem a proposta e conseguiu moderar o monólogo quando recebeu o sinal combinado.'
                ),
            },
            {
                'patient': patients['Gabriel'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=4),
                'status': 'scheduled',
                'notes': (
                    'Sessão programada para continuidade do treino de habilidades conversacionais, '
                    'com introdução do exercício de "perspectiva do outro" usando o recurso de '
                    'histórias sociais. Trabalhar especificamente a habilidade de identificar quando '
                    'o interlocutor está entediado ou querendo mudar o assunto, utilizando cenas em '
                    'vídeo como estímulo. Verificar com a mãe relatos de generalização no ambiente escolar.'
                ),
            },
            # ── Isabela Santana ───────────────────────────────────────────────
            {
                'patient': patients['Isabela'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=9),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com protocolo de dessensibilização à separação materna em '
                    'andamento (semana 6). A mãe permaneceu na sala pelos primeiros 10 minutos, '
                    'aguardou do lado de fora com a porta entreaberta por 15 minutos e, então, '
                    'retirou-se para a sala de espera pelo restante da sessão. Isabela chorou por '
                    'aproximadamente 8 minutos após a saída definitiva da mãe (redução em relação '
                    'aos 18 minutos da semana anterior). A música foi utilizada como regulador, '
                    'e a canção favorita de Isabela ("Aquarela" de Toquinho) funcionou como âncora '
                    'de regulação emocional. Finalizou a sessão engajada e sorrindo.'
                ),
            },
            {
                'patient': patients['Isabela'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=6),
                'status': 'scheduled',
                'notes': (
                    'Sessão planejada para avançar para a etapa 7 do protocolo de dessensibilização: '
                    'mãe sai imediatamente ao início da sessão, sem período de permanência. Preparar '
                    'estratégias de antecipação (usar o painel de rotina da sessão para mostrar que '
                    'a mãe volta ao final) e ter o recurso musical disponível imediatamente. '
                    'Documentar tempo até regulação e comparar com sessão anterior.'
                ),
            },
            # ── Mateus Oliveira ───────────────────────────────────────────────
            {
                'patient': patients['Mateus'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=8),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos integrando estratégias de ABA e TCC adaptada para manejo '
                    'de comportamentos compulsivos. Mateus relatou semana difícil na escola: ficou '
                    '20 minutos verificando a mochila antes de entrar na sala de aula, gerando '
                    'conflito com a professora. Realizou-se análise funcional do comportamento de '
                    'verificação junto com Mateus, identificando o antecedente (dúvida sobre ter '
                    'trazido a agenda) e a consequência (alívio temporário da ansiedade). '
                    'Introduziu-se a técnica de "adiamento da compulsão" com registro em cartão, '
                    'que Mateus aceitou bem. Praticou 3 tentativas de exposição com prevenção de '
                    'resposta durante a sessão com sucesso parcial.'
                ),
            },
            {
                'patient': patients['Mateus'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=7),
                'status': 'scheduled',
                'notes': (
                    'Sessão para revisão do uso do cartão de adiamento da compulsão na semana. '
                    'Planejar nova rodada de exposição com prevenção de resposta para o ritual '
                    'de verificação da mochila, aumentando o tempo de adiamento de 2 para 5 minutos. '
                    'Trabalhar flexibilidade cognitiva via jogo de xadrez com variante de regras '
                    'modificadas (técnica de "xadrez caótico" para treinamento de adaptação a mudanças). '
                    'Verificar com o pai relatos sobre os rituais em casa e na escola.'
                ),
            },
            # ── Laura Pimentel ────────────────────────────────────────────────
            {
                'patient': patients['Laura'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=6),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com foco em regulação emocional e tolerância à frustração '
                    'associada às dificuldades escolares. Laura chegou com expressão de raiva, '
                    'relatando que havia "errado tudo" na atividade de leitura em sala. Os primeiros '
                    '10 minutos foram dedicados à validação emocional e ao uso do termômetro de '
                    'emoções para nomear e graduar o que sentia. Em seguida, foi realizada atividade '
                    'de construção com LEGO (competência preservada) como regulador positivo, '
                    'transitando após 15 minutos para atividade de pré-leitura com suporte visual '
                    'de alta estrutura (cartões de rima com imagens). Laura finalizou a sessão '
                    'regulada e com autoavaliação positiva sobre a parte de construção.'
                ),
            },
            {
                'patient': patients['Laura'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=8),
                'status': 'scheduled',
                'notes': (
                    'Sessão para continuidade do trabalho de regulação emocional e introdução de '
                    'estratégias de compensação visual para leitura (uso de régua de leitura colorida '
                    'e fonte OpenDyslexic em materiais impressos). Planejar atividade de "livro do '
                    'que eu sei fazer bem" para fortalecimento da autoestima e narrativa de competência. '
                    'Conversar com a mãe sobre adaptações formais para solicitar à escola.'
                ),
            },
            # ── Heitor Campos ─────────────────────────────────────────────────
            {
                'patient': patients['Heitor'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=5),
                'status': 'completed',
                'notes': (
                    'Sessão de 50 minutos com foco em compreensão de instruções e uso de suportes '
                    'visuais complementares à comunicação verbal. Heitor estava bem-disposto e '
                    'engajou-se com facilidade nas atividades temáticas de veículos. Foram '
                    'trabalhadas instruções de 2 passos com suporte visual simultâneo (pictograma '
                    'ao lado da instrução falada), e Heitor respondeu corretamente em 7 de 10 '
                    'tentativas, sendo que nas 3 tentativas sem suporte visual o desempenho caiu '
                    'para 2 de 5 acertos, confirmando a dependência do suporte visual para '
                    'processamento auditivo em contexto ruidoso.'
                ),
            },
            {
                'patient': patients['Heitor'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=1),
                'status': 'scheduled',
                'notes': (
                    'Sessão para generalização das instruções com suporte visual para contexto '
                    'de grupo pequeno (2 pacientes), simulando o ambiente de sala de aula. '
                    'Treinar Heitor no uso do sinal combinado ("não entendi") para solicitar '
                    'repetição de instrução, reduzindo o comportamento de congelar. '
                    'Preparar material de orientação para a escola sobre o uso do sinal combinado '
                    'e sobre a diferença entre não-compreensão e recusa.'
                ),
            },
            # ── Valentina Cruz ────────────────────────────────────────────────
            {
                'patient': patients['Valentina'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=4),
                'status': 'completed',
                'notes': (
                    'Sessão de 45 minutos com foco em comunicação via CAA e manejo do comportamento '
                    'autolesivo (BAL) em transições. Valentina apresentou 2 episódios de BAL (bater '
                    'a mão na cabeça) durante a transição da atividade de encaixe para a atividade '
                    'de lanche, ambos de baixa intensidade e duração inferior a 10 segundos. '
                    'O protocolo PBS foi aplicado: antecipação visual da transição com 3 minutos '
                    'de antecedência, uso de timer visual e reforçamento imediato de espera calma. '
                    'No uso do CAA, Valentina selecionou espontaneamente os ícones "água" e '
                    '"descansar" em 2 ocasiões distintas, sendo ambas funcionais e atendidas.'
                ),
            },
            {
                'patient': patients['Valentina'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=6),
                'status': 'scheduled',
                'notes': (
                    'Sessão de continuidade com revisão dos dados de frequência do BAL nas últimas '
                    '2 semanas e ajuste do protocolo PBS se necessário. Expandir o vocabulário '
                    'funcional no CAA para incluir ícones de emoções básicas (feliz, triste, '
                    'com dor, com medo). Conversar com o pai sobre a implementação do protocolo '
                    'de higiene do sono e avaliar adesão e eficácia inicial.'
                ),
            },
            # ── Enzo Barbosa ──────────────────────────────────────────────────
            {
                'patient': patients['Enzo'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=13),
                'status': 'completed',
                'notes': (
                    'Sessão inicial de avaliação de pré-requisitos para linguagem e estabelecimento '
                    'de vínculo terapêutico. Enzo foi acompanhado pela mãe durante toda a sessão '
                    '(protocolo de inclusão parental total nas primeiras 4 semanas). Foram observadas '
                    'habilidades de imitação motora grosseira presentes (palmas, bater na mesa), '
                    'imitação motora fina ausente, atenção compartilhada emergente (segue o apontar '
                    'do terapeuta em 3 de 8 tentativas) e contato ocular intencional presente em '
                    'contextos de solicitação. A mãe foi orientada sobre as estratégias de NDBI '
                    'a implementar em casa: seguir a liderança da criança, comentar sem exigir, '
                    'posicionar-se no nível visual de Enzo e criar oportunidades de comunicação.'
                ),
            },
            {
                'patient': patients['Enzo'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=3),
                'status': 'scheduled',
                'notes': (
                    'Segunda sessão com foco em imitação motora fina e expansão da atenção '
                    'compartilhada. Planejar atividades de imitação em frente ao espelho e '
                    'jogos de causa-e-efeito (brinquedos musicais, bolas que rolam). '
                    'Revisar com a mãe as estratégias NDBI da semana anterior: o que funcionou, '
                    'o que gerou dificuldade e ajustar orientações. Introduzir o primeiro '
                    'pictograma de CAA (ícone de "mais") em contexto de atividade preferida.'
                ),
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
            sessions[key].append(session)

        return sessions

    def create_evolutions(self, sessions, users):
        evolutions_data = [
            # ── Leonardo – sessão 1 (88 dias atrás / PECS Fase 2) ───────────
            {
                'session_key': 'Leonardo_completed',
                'session_index': 0,
                'objective': (
                    'Ensinar persistência comunicativa via PECS Fase 2: Leonardo mantém '
                    'a imagem até obter resposta do comunicador.'
                ),
                'activities': (
                    'Protocolo "esperar resposta": terapeuta segura imagem sem entregar item. '
                    'Leonardo espera até 10 segundos. 20 tentativas, 12 acertos (60%).'
                ),
                'behavior': (
                    'Leonardo demonstrou frustração leve em 4 tentativas (empurra imagem). '
                    'Nos acertos, entregou imagem com firmeza. Manteve motivação alta.'
                ),
                'progress': (
                    'Linha de base: 0% de persistência. Resultado: 60% — progresso significativo. '
                    'Critério: 80% para avançAR de fase.'
                ),
                'next_steps': (
                    'Aumentar tempo de espera para 15 segundos. Introduzir 2 comunicadores.'
                ),
                'released_to_family': True,
            },
            # ── Leonardo – sessão 2 (75 dias atrás / Imitação verbal) ────────
            {
                'session_key': 'Leonardo_completed',
                'session_index': 1,
                'objective': (
                    'Estabelecer imitação verbal de vogais em contexto lúdico.'
                ),
                'activities': (
                    'Jogos sonoros: apito, tamborim, bolha de sabão. '
                    '15 oportunidades de imitação após modelagem.'
                ),
                'behavior': (
                    'Leonardo emitiu /a/, /o/, /u/ em 8 de 15 tentativas (53%). '
                    'Associou som à ação de soprar. Sem comportamentos disruptivos.'
                ),
                'progress': (
                    'Linha de base: 2/15 (13%). Sessão atual: 8/15 (53%). '
                    'Aumento de 40 pontos percentuais.'
                ),
                'next_steps': (
                    'Continuar com sons bilabiais (/p/, /b/, /m/). Usar snack como reforçador.'
                ),
                'released_to_family': False,
            },
            # ── Leonardo – sessão 3 (61 dias atrás / Contato visual) ──────────
            {
                'session_key': 'Leonardo_completed',
                'session_index': 2,
                'objective': (
                    'Aumentar contato visual funcional para 80% das solicitações.'
                ),
                'activities': (
                    'Protocolo "olhar-pegar": item dado apenas após contato visual >1s. '
                    '10 tentativas com preferir-historinha como motivador.'
                ),
                'behavior': (
                    'Leonardo alcançou 70% de contato visual espontâneo (7/10). '
                    'Nos outros 3, precisou de prompt visual (sinal de "olha").'
                ),
                'progress': (
                    'Linha de base: 30%. Sessão: 70%. Muito bom progresso.'
                ),
                'next_steps': (
                    'Reduzir prompt visual. Chegar a 80% sem ajuda.'
                ),
                'released_to_family': True,
            },
            # ── Leonardo – sessão 4 (47 dias atrás / Regulação emocional) ─────
            {
                'session_key': 'Leonardo_completed',
                'session_index': 3,
                'objective': (
                    'Ensinar estratégia "parar-respirar-continuar" com suporte visual.'
                ),
                'activities': (
                    'Cartão visual de respiração. 3 episódios de birra durante transições. '
                    'Prática da estratégia em cada episódio.'
                ),
                'behavior': (
                    '3 birras breves (30-60 seg). Usou cartão de respiração em 2/3 oportunidades. '
                    'Autoregulação improving.'
                ),
                'progress': (
                    'Antes: 0 uso da estratégia. Agora: 2/3 oportunidades (67%).'
                ),
                'next_steps': (
                    'Praticar estratégia em ambiente natural (casa, escola).'
                ),
                'released_to_family': False,
            },
            # ── Leonardo – sessão 5 (33 dias atrás / Habilidades sociais) ─────
            {
                'session_key': 'Leonardo_completed',
                'session_index': 4,
                'objective': (
                    'Transicionar de jogo paralelo para interação compartilhada.'
                ),
                'activities': (
                    'Construção conjunta com blocos. Negoção visual de espaço. '
                    'Turnos alternados por 12 minutos.'
                ),
                'behavior': (
                    'Leonardo aceitou dividir espaço. Manteve interação 12 min contínuos. '
                    'Iniciou contato visual espontâneo para verificar terapeuta 4x.'
                ),
                'progress': (
                    'Primeira sessão de interação compartilhada. Objetivo atingido!'
                ),
                'next_steps': (
                    'Introduzir segundo paciente em atividade estruturada (sessão dupla).'
                ),
                'released_to_family': True,
            },
            # ── Leonardo – sessão 6 (19 dias atrás / Atenção compartilhada) ───
            {
                'session_key': 'Leonardo_completed',
                'session_index': 5,
                'objective': (
                    'Desenvolver atenção compartilhada via jogo de causa-e-feito.'
                ),
                'activities': (
                    'Bola que rola e cai no balde. Alternância de turnos. '
                    '4 oportunidades de solicitação de continuidade.'
                ),
                'behavior': (
                    'Leonardo solicitou continuidade 4x (vocalização + gesto). '
                    'Seguiu olhar da terapeuta para objeto 3x — atenção joint emergente!'
                ),
                'progress': (
                    'Primeira evidência clara de atenção compartilhada. Marco importante!'
                ),
                'next_steps': (
                    'Generalizar atenção joint com outros jogos e interlocutores.'
                ),
                'released_to_family': False,
            },
            # ── Leonardo – sessão 7 (14 dias atrás / PECS Fase 1) ─────────────
            {
                'session_key': 'Leonardo_completed',
                'session_index': 6,
                'objective': (
                    'Estabelecer troca comunicativa funcional via PECS Fase 1: Leonardo entrega '
                    'espontaneamente a imagem de um item desejado ao comunicador para obtê-lo, '
                    'sem prompting físico.'
                ),
                'activities': (
                    'Treino de tentativas discretas (DTT) com 4 itens altamente preferidos '
                    '(uva-passa, bolinha vermelha, bolha de sabão e música no tablet). '
                    'Foram realizadas 30 tentativas distribuídas em 3 blocos de 10, com intervalo '
                    'de 2 minutos de atividade livre entre blocos. A terapeuta posicionou-se em '
                    'frente a Leonardo com o item visível e a imagem correspondente disponível '
                    'sobre a mesa. Prompting físico total foi utilizado nas primeiras tentativas '
                    'e retirado gradualmente ao longo dos blocos (fading). Ao final, foram '
                    'realizadas 5 tentativas de generalização com a terapeuta auxiliar como '
                    'novo comunicador.'
                ),
                'behavior': (
                    'Leonardo demonstrou motivação alta pelos itens selecionados. Apresentou '
                    'comportamento de olhar alternado entre o item e a terapeuta em 6 tentativas, '
                    'indicando intencionalidade comunicativa emergente. Houve 2 episódios breves '
                    'de distração (se levantou e foi em direção à janela), sendo redirecionado '
                    'com prompt gestual. Não foram observados comportamentos disruptivos. '
                    'Na generalização com a terapeuta auxiliar, entregou a imagem em 3 de 5 '
                    'tentativas com prompting mínimo (toque no cotovelo).'
                ),
                'progress': (
                    'Linha de base (semana anterior): 2 solicitações espontâneas por sessão. '
                    'Resultado desta sessão: 8 solicitações espontâneas (sem prompting físico) '
                    'nas tentativas de probe inseridas nos blocos. Critério de domínio para '
                    'avanço de fase: 80% de independência em 3 sessões consecutivas com 2 '
                    'comunicadores distintos. Desempenho atual: 67% de independência com '
                    'comunicador principal.'
                ),
                'next_steps': (
                    'Continuar PECS Fase 1 até atingir critério de domínio (80% com 2 '
                    'comunicadores). Introduzir gradualmente novos comunicadores (mãe, '
                    'professora de apoio). Iniciar planejamento de PECS Fase 2 '
                    '(persistência — o que fazer quando o comunicador não responde imediatamente). '
                    'Orientar mãe a criar 3 oportunidades diárias de solicitação via PECS em casa.'
                ),
                'released_to_family': True,
            },
            # ── Leonardo – sessão 8 (7 dias atrás) ───────────────────────────
            {
                'session_key': 'Leonardo_completed',
                'session_index': 7,
                'objective': (
                    'Expandir repertório de solicitações espontâneas via PECS para 5 itens '
                    'distintos e iniciar imitação verbal de sons vocálicos em contexto lúdico.'
                ),
                'activities': (
                    'Bloco 1 (20 min): PECS Fase 1 com 5 itens (adicionados: espaguete de '
                    'brinquedo e apito). 25 tentativas distribuídas em 2 blocos. '
                    'Bloco 2 (20 min): Imitação verbal com jogos sonoros — bolha de sabão '
                    '(incentiva sopro e vocalização), apito colorido e instrumento de percussão. '
                    'A terapeuta modelava sons vocálicos (/a/, /o/, /u/) após cada ação com '
                    'o brinquedo e aguardava 5 segundos para tentativa de imitação. '
                    'Bloco 3 (10 min): Token economy — Leonardo acumulou fichas em atividades '
                    'dos blocos anteriores e trocou por 8 minutos de acesso ao tablet com música.'
                ),
                'behavior': (
                    'Leonardo iniciou a sessão regulado e motivado. Permaneceu em tarefa por '
                    'blocos de até 12 minutos sem necessidade de redirecionamento, o que representa '
                    'melhora em relação à sessão anterior (máximo de 8 minutos). '
                    'Vocalizou /a/ e /u/ de forma espontânea em 4 ocasiões durante o jogo '
                    'com o apito, associando a vocalização à ação de soprar — comportamento '
                    'não observado em sessões anteriores. Apresentou 1 episódio de birra '
                    'breve (30 seg) quando o acesso ao tablet foi encerrado, resolvido com '
                    'antecipação verbal da próxima atividade.'
                ),
                'progress': (
                    'PECS: independência de 80% com comunicador principal para 3 dos 5 itens '
                    '(uva-passa, bolinha, música). Itens novos (espaguete e apito) ainda com '
                    'prompting mínimo (50% de independência). Critério de domínio ainda não '
                    'atingido para todos os itens com 2 comunicadores. '
                    'Imitação verbal: 4 vocalizações espontâneas de vogais — aumento significativo '
                    'em relação à linha de base (0 vocalizações espontâneas em contexto de imitação).'
                ),
                'next_steps': (
                    'Atingir 80% de independência nos itens novos no PECS. Introduzir mãe como '
                    'comunicador secundário nas últimas 10 tentativas da próxima sessão. '
                    'Continuar programa de imitação verbal com foco em sons bilabiais (/p/, /b/, /m/). '
                    'Introduzir palavras funcionais "mais" e "terminou" em contexto de atividade '
                    'preferida (tablet), associando palavra falada ao gesto de apontar.'
                ),
                'released_to_family': False,
            },
            # ── Sofia – sessão (10 dias atrás) ──────────────────────────────
            {
                'session_key': 'Sofia_completed',
                'session_index': 0,
                'objective': (
                    'Desenvolver habilidades de regulação emocional diante de mudanças inesperadas '
                    'na rotina e treinar estratégias de auto-regulação para uso independente no '
                    'contexto escolar.'
                ),
                'activities': (
                    'Bloco 1 (15 min): Regulação emocional emergencial — respiração diafragmática '
                    '(3 séries de 4 respirações), uso do termômetro de emoções (escala 1-5) para '
                    'nomear e graduar o que sentia sobre a situação escolar, e conversa estruturada '
                    'com validação emocional ("faz sentido se sentir assim quando algo muda de repente"). '
                    'Bloco 2 (25 min): Role-play de interação social com fantoches — dois cenários '
                    '(pedir para entrar na brincadeira e lidar com um "não" dos colegas). '
                    'Sofia escolheu os fantoches e dirigiu o segundo cenário de forma espontânea. '
                    'Bloco 3 (10 min): Revisão das estratégias de regulação e construção do '
                    '"cartão de bolso" com 3 estratégias escolhidas por Sofia para usar na escola.'
                ),
                'behavior': (
                    'Sofia chegou visivelmente ansiosa (relatou coração acelerado e estômago '
                    '"apertado"). Respondeu bem às estratégias de regulação do bloco 1, atingindo '
                    'nível 2 no termômetro de emoções ao final do bloco (entrou em nível 4). '
                    'No role-play, demonstrou iniciativas sociais adequadas e criatividade na '
                    'condução do cenário. Em um momento, o fantoche do colega disse "não pode entrar", '
                    'e Sofia ficou imóvel por 8 segundos antes de continuar — comportamento de '
                    'congelamento típico diante de rejeição. Foi possível trabalhar a situação '
                    'in loco com a terapeuta modelando a resposta verbal adequada.'
                ),
                'progress': (
                    'Regulação emocional: tempo para atingir nível 2 no termômetro caiu de '
                    '25 minutos (sessão de 3 semanas atrás) para 15 minutos nesta sessão. '
                    'Habilidades sociais: aumentou de 2 para 5 iniciativas sociais espontâneas '
                    'durante o role-play sem prompting verbal. Sofia utilizou espontaneamente '
                    'a estratégia de respiração 1 vez durante a sessão quando ficou frustrada '
                    'com o fantoche, o que representa uso funcional e independente da estratégia.'
                ),
                'next_steps': (
                    'Verificar uso do cartão de bolso na escola com a mãe (seguir com a pedagoga '
                    'de apoio sobre integração do cartão na rotina escolar). Trabalhar cenas '
                    'de rejeição social com gradação de dificuldade crescente. Introduzir o '
                    'exercício de "detetive social" para identificação de emoções em rostos '
                    'e vozes de cenas cotidianas (vídeos curtos sem áudio + com áudio).'
                ),
                'released_to_family': False,
            },
            # ── Pedro – sessão (12 dias atrás) ──────────────────────────────
            {
                'session_key': 'Pedro_completed',
                'session_index': 0,
                'objective': (
                    'Realizar avaliação funcional inicial do repertório comportamental, comunicativo '
                    'e sensorial de Pedro, e estabelecer aliança terapêutica com a criança e a família.'
                ),
                'activities': (
                    'Sessão de avaliação em contexto naturalístico de brincar livre. '
                    'Disponibilizados materiais variados: blocos de encaixe, massinha, '
                    'papel crepom, areia cinética, carrinhos e panelinhas de cozinha de brinquedo. '
                    'A terapeuta observou e registrou: (1) repertório de imitação motora; '
                    '(2) respostas a diferentes texturas; (3) vocalizações e tentativas '
                    'comunicativas; (4) comportamentos de interesse restrito ou repetitivo; '
                    '(5) tolerância à presença do adulto desconhecido. '
                    'A mãe foi entrevistada com o roteiro do VINELAND-3 (habilidades adaptativas) '
                    'durante os primeiros 20 minutos enquanto Pedro explorava o ambiente.'
                ),
                'behavior': (
                    'Pedro explorou os materiais de forma sistemática, testando cada item '
                    'individualmente. Retirou a mão imediatamente ao contato com massinha '
                    '(expressão de nojo, vocalização de recusa) e com papel crepom (mesmo padrão). '
                    'Tolerou bem os blocos de encaixe, carrinhos e a areia cinética por mais '
                    'de 3 minutos. Imitou 2 gestos da terapeuta (palmas e bater na mesa) '
                    'de forma espontânea. Não utilizou palavras, comunicou-se por pointing, '
                    'toque no braço da terapeuta e vocalizações afirmativas (/uh/) e negativas '
                    '(/eh/ com balanço de cabeça). Tolerou a presença da terapeuta a 50 cm '
                    'sem sinais de desconforto após os primeiros 10 minutos.'
                ),
                'progress': (
                    'Avaliação inicial concluída. Perfil preliminar: hipersensibilidade tátil '
                    'marcada para texturas moles e irregulares; imitação motora grosseira presente; '
                    'comunicação pré-verbal com intencionalidade comunicativa clara; tolerância '
                    'a adulto desconhecido dentro do esperado para o perfil. Dados do VINELAND-3 '
                    'coletados com a mãe: atraso significativo em comunicação expressiva e '
                    'habilidades de vida diária; socialização e motricidade dentro da faixa '
                    'esperada para o nível de desenvolvimento.'
                ),
                'next_steps': (
                    'Elaborar Plano de Intervenção Individualizado (PII) com base na avaliação. '
                    'Prioridades: (1) dieta sensorial para hipersensibilidade tátil; '
                    '(2) introdução de agenda visual para estruturar a rotina das sessões; '
                    '(3) PECS Fase 1 com itens preferidos identificados hoje. '
                    'Encaminhar para avaliação de integração sensorial pela TO parceira da clínica.'
                ),
                'released_to_family': True,
            },
            # ── Clara – sessão (1 dia atrás) ─────────────────────────────────
            {
                'session_key': 'Clara_completed',
                'session_index': 0,
                'objective': (
                    'Promover regulação sensorial e emocional após semana com intercorrência '
                    'neurológica, e manter engajamento com o sistema de CAA em contexto '
                    'de baixa demanda.'
                ),
                'activities': (
                    'Bloco 1 – Regulação sensorial (23 min): cobertor weighted sobre o colo e '
                    'ombros (10 min), seguido de balanço linear em rede (8 min) com ritmo lento '
                    'e música instrumental de baixo volume, finalizando com exploração livre '
                    'de caixa de areia cinética (5 min). '
                    'Bloco 2 – CAA e comunicação (17 min): atividade de encaixe de peças grandes '
                    'com oportunidades estruturadas de solicitação via tablet CAA. '
                    'A terapeuta criou situações de falta de peça para motivar a solicitação '
                    'de "mais". Foram realizadas 10 tentativas de solicitação, aceitando também '
                    'pointing para o tablet como forma comunicativa alternativa.'
                ),
                'behavior': (
                    'Clara chegou com expressão fechada e resistiu ao contato visual nos '
                    'primeiros 5 minutos. Ao início do cobertor weighted, relaxou progressivamente '
                    '(musculatura facial e ombros visivelmente mais relaxados em 4 minutos). '
                    'No balanço, verbalizou /ah/ e /oh/ com tom de prazer, comportamentos '
                    'vocais presentes apenas em estados de alta regulação. '
                    'No bloco de CAA, selecionou o ícone "água" de forma espontânea ao perceber '
                    'a garrafinha sobre a mesa (não estava no plano, mas foi atendida imediatamente '
                    'como reforçamento do comportamento comunicativo funcional) e o ícone '
                    '"mais" em 4 de 10 tentativas com prompting mínimo (apontar para o tablet).'
                ),
                'progress': (
                    'Regulação sensorial: atingiu estado de regulação em 23 minutos (média das '
                    'últimas 4 sessões sem intercorrência: 15 minutos — aumento esperado dado '
                    'o contexto da semana com crise epiléptica). '
                    'CAA: 4 seleções com prompting mínimo + 1 espontânea (ícone "água") — '
                    'melhor desempenho comunicativo espontâneo registrado até o momento. '
                    'BAL: 0 episódios nesta sessão (média de 2-3 nas sessões anteriores), '
                    'possivelmente favorecido pelo formato de baixa demanda adotado.'
                ),
                'next_steps': (
                    'Retomar programas suspensos (habilidades funcionais) na próxima sessão '
                    'se Clara estiver regulada desde a chegada. Discutir com o neurologista '
                    'o impacto da crise no desempenho nas sessões seguintes. '
                    'Expandir vocabulário do CAA: adicionar ícones "terminou", "não quero" '
                    'e "ajuda" nas próximas 2 sessões. Reforçar com o pai a importância de '
                    'manter a rotina de sinalização de transições em casa.'
                ),
                'released_to_family': True,
            },
            # ── Gabriel – sessão (11 dias atrás) ─────────────────────────────
            {
                'session_key': 'Gabriel_completed',
                'session_index': 0,
                'objective': (
                    'Desenvolver a habilidade de regulação do turno conversacional: fazer '
                    'perguntas ao interlocutor, verificar o interesse do outro e modular '
                    'o tempo de fala sobre temas de interesse próprio.'
                ),
                'activities': (
                    'Bloco 1 (10 min): Conversa livre sobre dinossauros — a terapeuta '
                    'registrou o tempo de monólogo e o número de perguntas feitas a ela. '
                    'Linha de base observacional: 8 minutos de monólogo, 0 perguntas. '
                    'Bloco 2 (25 min): Ensino explícito do conceito de "turno conversacional" '
                    'com o suporte visual do "balão de fala" (cartão com ampulheta de 30 seg '
                    'que passa de mão em mão). Role-play de conversa sobre dinossauros e '
                    'sobre o tema preferido da terapeuta (culinária), com inversão de papéis. '
                    'Bloco 3 (15 min): Prática naturalística — conversa livre com o suporte '
                    'do balão de fala, com Gabriel sendo responsável por passar o balão.'
                ),
                'behavior': (
                    'Gabriel compreendeu rapidamente a proposta do balão de fala e demonstrou '
                    'motivação para o exercício, comparando-o a uma "regra de jogo". '
                    'No bloco 2, fez 5 perguntas para a terapeuta sobre culinária (tema não '
                    'preferido), sendo 2 genuínas e 3 claramente formuladas para "cumprir o '
                    'protocolo" — diferença apontada pela terapeuta com humor e sem julgamento. '
                    'No bloco 3, passou o balão em 4 de 6 momentos adequados, perdendo os '
                    '2 momentos em que estava no meio de uma informação que considerava '
                    '"muito importante". Reconheceu a dificuldade quando questionado.'
                ),
                'progress': (
                    'Linha de base: 0 perguntas espontâneas ao interlocutor, monólogo de 8 min. '
                    'Resultado desta sessão (bloco naturalístico): 4 perguntas espontâneas, '
                    'monólogo máximo de 2 minutos antes de passar o balão. '
                    'Reconhecimento do conceito de turno conversacional: presente e verbalizado '
                    'pelo próprio Gabriel ("eu sei que fico falando muito de dinossauro").'
                ),
                'next_steps': (
                    'Retirar gradualmente o suporte do balão de fala, substituindo por '
                    'sinal gestual discreto (toque no ombro). Introduzir o exercício de '
                    '"perspectiva do outro" com histórias sociais ilustradas. Solicitar à '
                    'mãe que registre situações de conversa em casa onde Gabriel utiliza '
                    'espontaneamente o turno conversacional, para análise na próxima sessão.'
                ),
                'released_to_family': False,
            },
            # ── Isabela – sessão (9 dias atrás) ──────────────────────────────
            {
                'session_key': 'Isabela_completed',
                'session_index': 0,
                'objective': (
                    'Avançar no protocolo de dessensibilização à separação materna (etapa 6): '
                    'mãe permanece 10 min, aguarda 15 min do lado de fora com porta entreaberta '
                    'e retira-se para a sala de espera pelo tempo restante. Manter comunicação '
                    'funcional e engajamento em atividades mediadas por música.'
                ),
                'activities': (
                    'Etapa de transição (25 min): conforme protocolo de dessensibilização, '
                    'com presença gradualmente reduzida da mãe. Durante o período sem a mãe, '
                    'a terapeuta utilizou imediatamente a playlist preferida de Isabela '
                    '(músicas do Toquinho e do Palavra Cantada) como âncora de regulação. '
                    'Atividades durante a sessão: encaixe de figuras geométricas com música '
                    'de fundo, jogo de imitar gestos da música ("Se essa rua fosse minha") '
                    'e atividade de "banda musical" com instrumentos de percussão pequenos. '
                    'Nos últimos 5 minutos, a mãe entrou suavemente e Isabela a cumprimentou '
                    'com abraço — reforçando o retorno previsível da figura de apego.'
                ),
                'behavior': (
                    'Isabela demonstrou ansiedade antecipada antes da sessão, relatada pela '
                    'mãe na sala de espera ("ela perguntou 5 vezes se eu ia ficar"). '
                    'No momento da saída definitiva da mãe, chorou por 8 minutos (anterior: '
                    '18 min), sendo consolada pela música e pelo engajamento gradual '
                    'da terapeuta com os instrumentos. O choro cessou de forma autônoma, '
                    'sem necessidade de retorno da mãe — marco importante no protocolo. '
                    'Após regulação, participou das atividades musicais com alto engajamento '
                    'e iniciou espontaneamente vocalizações de letras de música.'
                ),
                'progress': (
                    'Protocolo de dessensibilização: tempo de choro pós-separação reduziu de '
                    '18 para 8 minutos (redução de 56% em relação à semana anterior). '
                    'Regulação autônoma atingida sem retorno da mãe pela primeira vez no protocolo. '
                    'Comunicação funcional: 3 solicitações espontâneas durante a sessão '
                    '("mais música", "essa" apontando para instrumento, "não" ao encerrar atividade).'
                ),
                'next_steps': (
                    'Avançar para etapa 7: mãe sai imediatamente no início da sessão. '
                    'Manter a música como estratégia de regulação de transição. '
                    'Introduzir painel visual "a mamãe volta quando o relógio chegar aqui" '
                    'como suporte de antecipação temporal. Orientar a mãe a manter a '
                    'despedida breve e confiante, sem demonstrar ansiedade visível.'
                ),
                'released_to_family': True,
            },
            # ── Mateus – sessão (8 dias atrás) ───────────────────────────────
            {
                'session_key': 'Mateus_completed',
                'session_index': 0,
                'objective': (
                    'Realizar análise funcional do comportamento de verificação da mochila '
                    'e introduzir a técnica de adiamento da compulsão como primeira estratégia '
                    'de exposição com prevenção de resposta (EPR).'
                ),
                'activities': (
                    'Bloco 1 (20 min): Análise funcional colaborativa — a terapeuta e Mateus '
                    'preencheram juntos um "diagrama ABC" (Antecedente-Comportamento-Consequência) '
                    'descrevendo o episódio da semana na escola. Mateus identificou o antecedente '
                    '("não sei se trouxe a agenda") e a consequência ("fico menos nervoso por '
                    'um tempo"). A terapeuta introduziu o conceito de "ciclo da ansiedade" '
                    'com analogia de jogo de vídeogame (a compulsão é um "power-up falso" '
                    'que não resolve o boss final). '
                    'Bloco 2 (20 min): Introdução da técnica de adiamento + treino de EPR. '
                    'Mateus praticou adiar a verificação por 2 minutos em 3 tentativas simuladas '
                    '(a terapeuta escondia um item da mesa e Mateus registrava a dúvida no '
                    'cartão e aguardava o timer). '
                    'Bloco 3 (10 min): Partida de xadrez para encerramento, reforçando flexibilidade '
                    'e auto-regulação em contexto de jogo.'
                ),
                'behavior': (
                    'Mateus engajou-se ativamente na análise funcional e demonstrou boa '
                    'capacidade de insight ao reconhecer o padrão do ciclo da ansiedade. '
                    'Nas tentativas de EPR simulada: conseguiu aguardar os 2 minutos em 2 '
                    'de 3 tentativas; na terceira tentativa, "verificou" o item escondido '
                    'aos 90 segundos, reconhecendo imediatamente que havia cedido. '
                    'Verbalizou "é mais difícil do que parece na teoria" — demonstrando '
                    'autoconsciência adequada. No xadrez, fez movimento inusual no final '
                    'do jogo e ficou visivelmente tenso por 15 segundos antes de aceitar a '
                    'perda — foi possível trabalhar o momento in loco.'
                ),
                'progress': (
                    'Primeira sessão formal de EPR: desempenho de 67% (2/3 tentativas bem-sucedidas) '
                    'com duração de 2 minutos é considerado bom início para EPR. '
                    'Insight sobre o ciclo da ansiedade: presente e verbalizado pelo próprio Mateus. '
                    'Uso do cartão de registro: aceito e utilizado sem resistência — aderência '
                    'ao instrumento é pré-requisito para EPR ambulatorial eficaz.'
                ),
                'next_steps': (
                    'Revisar uso do cartão de adiamento na semana. Aumentar tempo de adiamento '
                    'de 2 para 5 minutos nas próximas tentativas de EPR. Trabalhar o ritual '
                    'de simetria da mesa escolar (segundo ritual em grau de angústia segundo '
                    'a hierarquia construída com Mateus). Continuar o xadrez como ferramenta '
                    'de treino de tolerância à incerteza e à derrota.'
                ),
                'released_to_family': False,
            },
            # ── Laura – sessão (6 dias atrás) ────────────────────────────────
            {
                'session_key': 'Laura_completed',
                'session_index': 0,
                'objective': (
                    'Trabalhar regulação emocional diante de situações de frustração escolar '
                    'associadas às dificuldades de leitura, e iniciar atividade de pré-leitura '
                    'com suporte visual de alta estrutura em estado regulado.'
                ),
                'activities': (
                    'Bloco 1 – Regulação emocional (25 min): Acolhimento da frustração com '
                    'conversa estruturada ("o que aconteceu, o que senti, o que meu corpo fez"). '
                    'Uso do termômetro de emoções para graduar a raiva (Laura marcou 4/5). '
                    'Atividade de construção livre com LEGO por 15 minutos como regulador '
                    'positivo (competência preservada e prazerosa). Laura construiu um '
                    'zoológico com animais de LEGO e narrou a história espontaneamente — '
                    'habilidade expressiva verbal intacta e criativa. '
                    'Bloco 2 – Pré-leitura com suporte visual (20 min): cartões de rima '
                    'com imagens (ex.: BOLA/ESCOLA com ilustrações), atividade de '
                    '"encontrar o par sonoro" sem exigência de leitura convencional. '
                    'Suporte visual de alta estrutura reduziu a demanda de decodificação '
                    'fonêmica e permitiu sucesso na tarefa.'
                ),
                'behavior': (
                    'Laura entrou na sala com sobrancelhas franzidas e cruzou os braços '
                    'ao sentar — linguagem corporal de raiva clara. Respondeu ao '
                    'acolhimento com frases curtas inicialmente, abrindo-se progressivamente. '
                    'No LEGO, relaxou visivelmente e iniciou narrativa espontânea e elaborada '
                    'sobre os animais do zoológico. Na atividade de rima, acertou 8 de 10 '
                    'pares sem errar nenhum dos pares com suporte visual completo. '
                    'Em 1 cartão sem imagem (inserido intencionalmente), ficou travada por '
                    '12 segundos e depois disse "esse eu não sei, não tem figura" — '
                    'demonstrando consciência da estratégia compensatória que utiliza.'
                ),
                'progress': (
                    'Regulação emocional: tempo para atingir nível 2 no termômetro foi de '
                    '22 minutos (benchmark anterior: 30 minutos — redução de 27%). '
                    'Pré-leitura: 80% de acerto com suporte visual completo. Sem suporte: '
                    '0% (1 tentativa) — confirma dependência de suporte visual como estratégia '
                    'compensatória funcional. Narrativa espontânea: 4 minutos de narração '
                    'coerente e criativa — recurso preservado a ser explorado terapeuticamente.'
                ),
                'next_steps': (
                    'Introduzir régua de leitura colorida e avaliar impacto na tarefa de '
                    'decodificação na próxima sessão. Criar com Laura o "livro do que eu '
                    'sei fazer bem" — primeiro capítulo sobre LEGO e narração de histórias. '
                    'Elaborar carta de orientação para a escola solicitando: uso de fonte '
                    'ampliada, régua de leitura, tempo adicional em atividades escritas '
                    'e avaliação oral como alternativa. Compartilhar relatório parcial '
                    'com a mãe na próxima sessão de orientação familiar.'
                ),
                'released_to_family': False,
            },
            # ── Heitor – sessão (5 dias atrás) ───────────────────────────────
            {
                'session_key': 'Heitor_completed',
                'session_index': 0,
                'objective': (
                    'Avaliar a dependência do suporte visual para compreensão de instruções '
                    'de 2 passos em diferentes condições de ruído e introduzir o sinal '
                    'combinado de "não entendi" para solicitação de repetição.'
                ),
                'activities': (
                    'Bloco 1 (15 min): Instrução de 2 passos COM suporte visual simultâneo '
                    '(pictograma ao lado da fala) em ambiente silencioso — 10 tentativas. '
                    'Bloco 2 (15 min): Instrução de 2 passos SEM suporte visual em '
                    'ambiente silencioso — 5 tentativas. '
                    'Bloco 3 (10 min): Instrução de 2 passos SEM suporte visual com ruído '
                    'de fundo controlado (gravação de sala de aula em volume baixo) — '
                    '5 tentativas. '
                    'Bloco 4 (10 min): Ensino do sinal combinado "não entendi" (mão aberta '
                    'em frente ao rosto) com modelação e prática em 6 oportunidades '
                    'criadas intencionalmente (instrução deliberadamente rápida e baixa).'
                ),
                'behavior': (
                    'Heitor engajou-se bem nos blocos 1 e 2, demonstrando entusiasmo '
                    'pelos materiais temáticos de veículos utilizados nas instruções '
                    '("coloque o caminhão na garagem e empurre o trem para a ponte"). '
                    'No bloco 3, apresentou o comportamento de "congelar" em 3 de 5 '
                    'tentativas, olhando para a terapeuta por até 6 segundos sem agir. '
                    'No bloco 4, aprendeu o sinal com facilidade e o utilizou '
                    'espontaneamente na 5ª oportunidade — dentro do que se esperava '
                    'para uma primeira exposição ao sinal.'
                ),
                'progress': (
                    'Com suporte visual, ambiente silencioso: 7/10 acertos (70%). '
                    'Sem suporte visual, ambiente silencioso: 2/5 acertos (40%). '
                    'Sem suporte visual, com ruído: 1/5 acertos (20%) + 3 congelamentos. '
                    'Dados confirmam hipótese de dependência significativa do suporte '
                    'visual, especialmente em ambiente com ruído — consistente com TPAC. '
                    'Aprendizado do sinal "não entendi": 1 uso espontâneo em 6 tentativas '
                    '(17% — esperado para primeira exposição).'
                ),
                'next_steps': (
                    'Generalizar o sinal "não entendi" em contexto de grupo pequeno (2 crianças). '
                    'Preparar material de orientação para a escola descrevendo: diferença entre '
                    'não-compreensão e recusa, protocolo de uso do sinal combinado e como '
                    'o professor deve responder (repetir com suporte visual, não apenas '
                    'aumentar o volume). Encaminhar dados da sessão para a fonoaudióloga '
                    'responsável pelo acompanhamento do TPAC.'
                ),
                'released_to_family': True,
            },
            # ── Valentina – sessão (4 dias atrás) ────────────────────────────
            {
                'session_key': 'Valentina_completed',
                'session_index': 0,
                'objective': (
                    'Manter e expandir o uso funcional do sistema de CAA para expressão de '
                    'necessidades básicas, e aplicar o protocolo PBS para redução de '
                    'comportamento autolesivo (BAL) em momentos de transição.'
                ),
                'activities': (
                    'Bloco 1 – Regulação e CAA (20 min): Atividade de encaixe de peças grandes '
                    'com oportunidades estruturadas de uso do CAA. A terapeuta criou '
                    '10 oportunidades de solicitação: 5 para "mais peças" e 5 para "ajuda". '
                    'O tablet com Tobii Snap Core First foi posicionado a 30 cm da mão '
                    'dominante de Valentina. '
                    'Bloco 2 – Transições com PBS (15 min): 3 transições planejadas entre '
                    'atividades, cada uma antecipada com timer visual de 3 minutos, '
                    'aviso verbal + pictograma e reforçamento imediato de espera calma. '
                    'Bloco 3 – Lanche funcional (10 min): Valentina utilizou o CAA para '
                    'solicitar itens do lanche (já familiarizado com os ícones "água", '
                    '"bolacha" e "terminou").'
                ),
                'behavior': (
                    'Valentina chegou com disposição adequada (sem sinais de privação de '
                    'sono excessiva relatada pelo pai). Nas oportunidades de CAA do bloco 1: '
                    'selecionou "mais" com prompting mínimo (apontar para o tablet) em 4/5 '
                    'tentativas, e "ajuda" com prompting médio (guia de mão) em 3/5 tentativas. '
                    'Nos 2 episódios de BAL registrados, ambos ocorreram no início '
                    'da transição (antes do timer completar), ambos de baixa intensidade '
                    '(duração menor que 5 segundos). Após o timer e o aviso visual, '
                    'não houve BAL nas transições subsequentes — sugerindo que a '
                    'antecipação está funcionando como estratégia de prevenção.'
                ),
                'progress': (
                    'CAA – "mais": 4/5 com prompting mínimo (80%) — próximo do critério de '
                    'domínio para redução de prompting. '
                    'CAA – "ajuda": 3/5 com prompting médio (60%) — em andamento. '
                    'CAA espontâneo: seleção de "água" no lanche sem prompting (1 ocorrência). '
                    'BAL: 2 episódios (ambos no início de transições) vs. média de 4-5 por '
                    'sessão nas últimas 3 semanas — redução de ~55%, atribuída à implementação '
                    'consistente do protocolo PBS.'
                ),
                'next_steps': (
                    'Reduzir nível de prompting para "mais" (de apontar para o tablet para '
                    'olhar expectante). Intensificar treino de "ajuda" mantendo prompting atual. '
                    'Adicionar ícones "feliz", "triste" e "com dor" ao vocabulário do CAA. '
                    'Verificar com o pai a implementação do protocolo de transições em casa '
                    '(avaliar adesão e barreiras). Solicitar ao pai dados de frequência de '
                    'BAL em casa na semana anterior à próxima sessão.'
                ),
                'released_to_family': False,
            },
            # ── Enzo – sessão (13 dias atrás) ────────────────────────────────
            {
                'session_key': 'Enzo_completed',
                'session_index': 0,
                'objective': (
                    'Avaliar repertório de imitação motora, atenção compartilhada e '
                    'intenção comunicativa como pré-requisitos para o desenvolvimento '
                    'da linguagem, e iniciar orientação parental em estratégias NDBI.'
                ),
                'activities': (
                    'Sessão de avaliação e orientação com inclusão parental total (mãe '
                    'presente durante toda a sessão). '
                    'Parte 1 – Avaliação de imitação (15 min): A terapeuta modelou 10 ações '
                    'motoras grosseiras (palmas, bater mesa, levantar braços, bater pés) '
                    'e 5 ações motoras finas (pinça, empilhar 2 cubos, girar colher). '
                    'Parte 2 – Avaliação de atenção compartilhada (15 min): Atividades '
                    'de apontar + seguir olhar com 8 tentativas cada. '
                    'Parte 3 – Observação de comunicação espontânea (10 min): Brincar '
                    'livre com brinquedos de causa-e-efeito e empilhamento. '
                    'Parte 4 – Orientação parental (10 min): A terapeuta demonstrou as '
                    '5 estratégias NDBI básicas com a mãe praticando cada uma com Enzo.'
                ),
                'behavior': (
                    'Enzo explorou os brinquedos de forma ativa e prazerosa. '
                    'Imitação motora grosseira: 6/10 ações imitadas de forma espontânea '
                    '(palmas, bater mesa, levantar braços — as mais dinâmicas e visualmente '
                    'salientes). Imitação motora fina: 0/5 — ausente nesta avaliação. '
                    'Seguir apontar da terapeuta: 3/8 tentativas com olhar para o objeto '
                    'indicado (atenção compartilhada responsiva emergente). '
                    'Intenção comunicativa: pointing para brinquedo desejado em 4 '
                    'ocasiões espontâneas, toque no braço da terapeuta em 2 ocasiões '
                    '(comunicação pré-verbal intencional confirmada). '
                    'A mãe praticou as estratégias NDBI com engajamento e fez '
                    'perguntas pertinentes sobre como aplicá-las na troca de fraldas '
                    'e na hora do banho.'
                ),
                'progress': (
                    'Avaliação inicial concluída. Perfil de pré-requisitos: imitação '
                    'motora grosseira emergente (60%); imitação motora fina ausente; '
                    'atenção compartilhada responsiva emergente (38%); intencionalidade '
                    'comunicativa presente (pointing e toque ao adulto). '
                    'Orientação parental: mãe demonstrou compreensão das 5 estratégias '
                    'NDBI e praticou todas durante a sessão com assistência da terapeuta. '
                    'Diagnóstico recente ainda em elaboração pela família — mãe mostrou '
                    'emocionar-se em 1 momento ao observar Enzo imitando palmas.'
                ),
                'next_steps': (
                    'Iniciar programa formal de imitação motora fina (empilhar, apontar, '
                    'encaixar) como pré-requisito para linguagem. Expandir atenção '
                    'compartilhada com jogos de causa-e-efeito e atividades com espelho. '
                    'Introduzir o primeiro ícone de CAA ("mais") em contexto de atividade '
                    'altamente preferida. Verificar na próxima sessão como a mãe '
                    'implementou as estratégias NDBI na rotina doméstica e ajustar '
                    'orientações conforme dificuldades relatadas.'
                ),
                'released_to_family': True,
            },
        ]

        for evo_data in evolutions_data:
            key = evo_data['session_key']
            idx = evo_data.get('session_index', 0)

            if key not in sessions:
                continue
            session_list = sessions[key]
            if idx >= len(session_list):
                continue

            session = session_list[idx]
            TherapeuticEvolution.objects.create(
                session=session,
                created_by=session.therapist,
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