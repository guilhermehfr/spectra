from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils import timezone

from core.models import CustomUser, Patient, Session, TherapeuticEvolution


class Command(BaseCommand):
    help = 'Populate the database with test data for development'

    def handle(self, *args, **options):
        self.stdout.write('Clearing existing data...')
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
            {
                'name': 'Leonard Silva',
                'birth_date': '2017-03-10',
                'guardian_name': 'Maria Silva',
                'guardian_email': 'maria@spectra.com',
                'notes': (
                    'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid ADHD predominantly '
                    'hyperactive-impulsive (ICD-10: F90.1), confirmed by neuropsychological assessment in January 2023. '
                    'Leonard is 7 years old and attends the 1st grade of elementary school in a regular school with full-time '
                    'caregiver support. He shows significant delay in expressive language, communicating '
                    'primarily through vocalizations, gestures, and some isolated words. Receptive understanding is '
                    'superior to expressive. Demonstrates high responsiveness to ABA therapy, especially in playful '
                    'contexts with tangible reinforcers (balls, colorful building blocks, and instrumental music). '
                    'Displays repetitive behaviors like lining up objects and spinning pieces, which do not significantly '
                    'interfere with his routine. Hyperactivity makes it difficult to maintain attention for more than '
                    '5 minutes in non-preferred tasks; first-then and token economy strategies have been effective '
                    'for increasing time-on-task. Does not exhibit self-injurious behaviors. The family is highly '
                    "engaged and performs generalization of skills in the home environment with the therapist's guidance."
                ),
            },
            {
                'name': 'Sophia Rodrigues',
                'birth_date': '2016-07-22',
                'guardian_name': 'João Rodrigues',
                'guardian_email': 'joao.rod@email.com',
                'notes': (
                    'Diagnosis: ASD level 1 (ICD-10: F84.0), with comorbid Generalized Anxiety Disorder '
                    '(ICD-10: F41.1), diagnosed by a multidisciplinary team in March 2022. '
                    'Sophia is 8 years old and is in the 2nd grade of elementary school in a regular school without individual support, '
                    'with specialized pedagogical monitoring twice a week. Possesses functional verbal communication, '
                    'forming complete sentences, but with pragmatic difficulties such as topic maintenance, '
                    'reading non-verbal cues, and managing situations of unexpected routine changes, '
                    'which often trigger anxiety crises. Shows intense interest in animals, '
                    'especially dogs and dolphins, and this theme has been used as a motivator in sessions. '
                    'Anxiety manifests mainly through crying, refusal, and escape behaviors in the face of '
                    'new tasks or noisy environments. Gradual desensitization, modeling, '
                    'and emotional self-regulation teaching strategies have shown positive results. Her father participates '
                    'actively in the biweekly family guidance sessions.'
                ),
            },
            {
                'name': 'Peter Alves',
                'birth_date': '2018-11-05',
                'guardian_name': 'Fernanda Alves',
                'guardian_email': 'fernanda@email.com',
                'notes': (
                    'Diagnosis: ASD level 2 (ICD-10: F84.0), with significant sensory hypersensitivity '
                    '(tactile, auditory, and olfactory) identified in a sensory integration assessment by the occupational '
                    'therapist in October 2023. Peter is 6 years old and is in the preschool adaptation phase, '
                    'attending 3 days a week. Communicates through isolated words and '
                    'some adapted LIBRAS (Brazilian Sign Language) signs that the family introduced. Responds well to visual schedules '
                    'with pictograms, which were implemented both in the clinic and in the home environment. '
                    'Displays intense refusal behaviors to unexpected tactile stimuli (unannounced touch, '
                    'specific textures of food and clothing), which impacts hygiene and feeding routines. '
                    'His mother reports frequent episodes of intense crying and impaired self-regulation in '
                    'noisy environments, such as supermarkets and parties. The current therapeutic plan prioritizes: (1) sensory '
                    'integration with a personalized sensory diet; (2) expansion of communicative repertoire via PECS '
                    'and AAC; (3) daily living skills with task chaining for personal hygiene.'
                ),
            },
            {
                'name': 'Claire Mendes',
                'birth_date': '2015-04-18',
                'guardian_name': 'Roberto Mendes',
                'guardian_email': 'roberto@email.com',
                'notes': (
                    'Diagnosis: ASD level 3 (ICD-10: F84.0), with comorbid focal Epilepsy (ICD-10: G40.1), '
                    'controlled with the use of Sodium Valproate 500mg/day, under monthly neurological follow-up. '
                    'Claire is 9 years old and is enrolled in a special school, attending 5 days a week. '
                    'Does not use functional verbal communication; communication occurs mainly through '
                    'vocalizations, facial expressions, and pointing to objects of immediate interest. An AAC '
                    'system with a tablet was introduced 4 months ago and Claire shows gradual progress in using '
                    'pictograms to express basic needs (eating, drinking, bathroom, resting). '
                    'Requires intensive support in all activities of daily living. Exhibits challenging behaviors '
                    'like prolonged tantrums (up to 20 minutes) and food refusal for smooth textures. '
                    'The team holds a monthly meeting with the special school and family to align '
                    'strategies and monitor behavioral programs. Her father is the primary caregiver and '
                    'reports significant exhaustion; he was referred to a support group for family members.'
                ),
            },
            {
                'name': 'Gabriel Ferreira',
                'birth_date': '2016-09-14',
                'guardian_name': 'Luciana Ferreira',
                'guardian_email': 'luciana.ferreira@email.com',
                'notes': (
                    'Diagnosis: ASD level 1 (ICD-10: F84.0), with comorbid ADHD predominantly '
                    'inattentive (ICD-10: F90.0), diagnosed in a multidisciplinary assessment in June 2022. '
                    'Gabriel is 9 years old and is in the 3rd grade of elementary school in a regular school, with good '
                    'academic performance in science and math subjects, but shows significant difficulties '
                    'in Portuguese (especially text production) and in social interactions '
                    'with peers. Inattention manifests through frequent forgetting of materials, '
                    'difficulty following multi-step instructions, and a tendency to "zone out" in activities '
                    'that he considers not very stimulating. Shows special interest in dinosaurs and astronomy, '
                    'which is widely used as a motivator in sessions. Possesses a rich vocabulary and '
                    'logical reasoning above average for his age group, but has difficulty calibrating communication '
                    "to the interlocutor (talks a lot about his interests without noticing the other person's disinterest). "
                    'The therapeutic plan focuses on: pragmatic communication skills, '
                    'organization and attention self-regulation strategies, and explicit social skills teaching.'
                ),
            },
            {
                'name': 'Isabella Santana',
                'birth_date': '2019-02-28',
                'guardian_name': 'Camila Santana',
                'guardian_email': 'camila.santana@email.com',
                'notes': (
                    'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Separation Anxiety Disorder '
                    '(ICD-10: F93.0), identified in a psychological assessment in September 2023. '
                    'Isabella is 6 years old and is not yet enrolled in a school; the family is in the process of '
                    'searching for an institution with appropriate support. Communicates with short phrases of 2 to 3 words '
                    'and exhibits functional and non-functional echolalia. Separation anxiety is intense: she cries '
                    'for up to 30 minutes at the start of each session when her mother walks away, which has been worked on '
                    'with a gradual desensitization protocol over the last 2 months, with observable progress '
                    '(reduction to 10 minutes in the last 3 weeks). Shows a strong interest in '
                    'music and responds very well to activities mediated by songs. Exhibits ritualistic behaviors '
                    'regarding the order of objects and the entry and exit routines of the therapy '
                    'room, which have been gradually flexibilized. Her mother participates in all sessions '
                    'and is in the process of training to manage separation anxiety in the home context.'
                ),
            },
            {
                'name': 'Matthew Oliveira',
                'birth_date': '2014-06-03',
                'guardian_name': 'Paulo Oliveira',
                'guardian_email': 'paulo.oliveira@email.com',
                'notes': (
                    'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Obsessive-Compulsive Disorder '
                    '(ICD-10: F42), assessed by a child psychiatrist in February 2023, with use of Fluoxetine '
                    '10mg/day under supervision. Matthew is 11 years old and is in the 5th grade of elementary school, '
                    'with support from a resource teacher in the alternate shift. Has fluent verbal communication, '
                    'with organized discourse, but shows marked cognitive rigidity and difficulty tolerating '
                    'situations that are ambiguous or lack clear rules. Compulsive behaviors include repetitive '
                    'checking of school materials, a need for symmetry in the organization of the environment, and '
                    'rituals when entering new spaces. The differentiation between ASD and OCD characteristics '
                    'is monitored together with the psychiatric team. Shows intense interest in chess '
                    'and strategy games, a skill that has been used for cognitive flexibility training. '
                    'The therapeutic plan integrates ABA techniques with elements of adapted CBT, '
                    'including exposure and response prevention for compulsive rituals.'
                ),
            },
            {
                'name': 'Laura Pimentel',
                'birth_date': '2017-12-19',
                'guardian_name': 'Renata Pimentel',
                'guardian_email': 'renata.pimentel@email.com',
                'notes': (
                    'Diagnosis: ASD level 1 (ICD-10: F84.0), with comorbid Developmental Dyslexia '
                    '(ICD-10: F81.0), identified in a neuropsychological assessment in April 2024. Laura is '
                    '7 years old and is in the 1st grade of elementary school. Exhibits developed verbal communication '
                    'for her age group, with good ability to narrate events and express emotions when '
                    'she is regulated. School difficulties are concentrated in phonemic decoding and '
                    'reading fluency, causing frustration and school refusal behaviors (reports from her '
                    'mother of 2 to 3 episodes per week). Demonstrates above-average ability for visual '
                    'memory and construction with blocks (LEGO). The therapeutic work integrates: (1) social '
                    'skills and emotional regulation, focusing on school frustration tolerance; (2) visual '
                    'compensation strategies to support reading; (3) interface with the school for curricular '
                    "adaptations. Her mother is a teacher and demonstrates high understanding of her daughter's profile, "
                    'being an active partner in the therapeutic process.'
                ),
            },
            {
                'name': 'Hector Campos',
                'birth_date': '2018-04-07',
                'guardian_name': 'Sandra Campos',
                'guardian_email': 'sandra.campos@email.com',
                'notes': (
                    'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Central Auditory Processing Disorder '
                    '(CAPD), confirmed by a speech therapist in July 2023. Hector is 7 years old '
                    'and attends the 1st grade of elementary school with the support of an educational interpreter. '
                    'Presents expressive language with functional vocabulary, but with difficulty in the '
                    'comprehension of long instructions, especially in environments with background noise, which '
                    'is aggravated by CAPD. The school adapted the environment with sound-absorbing panels and '
                    'the teacher uses a lapel microphone. Shows interest in vehicles and transport, '
                    'and this theme motivates high engagement in activities. Exhibits a "freezing" behavior '
                    '(stopping and not responding) when receiving instructions he did not process adequately, '
                    'often misinterpreted as refusal. The team works with the school '
                    'and the family for differentiation between non-comprehension and refusal, and for consistent use '
                    'of visual supports that accompany verbal instructions.'
                ),
            },
            {
                'name': 'Valentina Cruz',
                'birth_date': '2015-08-30',
                'guardian_name': 'André Cruz',
                'guardian_email': 'andre.cruz@email.com',
                'notes': (
                    'Diagnosis: ASD level 3 (ICD-10: F84.0), with comorbid Moderate Intellectual Disability '
                    '(ICD-10: F71) and Sleep Disorder (ICD-10: G47.0), in follow-up with a '
                    'pediatric neurologist. Valentina is 10 years old and is enrolled in a full-time special '
                    'school. Does not have functional verbal communication; uses an AAC system '
                    'with a high-tech board (tablet with Tobii Snap Core First software) to '
                    'express needs and preferences in a structured context. The sleep disorder '
                    '(maintenance insomnia, waking up 3 to 4 times a night) directly impacts '
                    'performance in sessions and at school; the family is in the process of implementing a '
                    'sleep hygiene protocol guided by the team. Exhibits low-intensity self-injurious behavior '
                    '(hitting her hand on her head) associated with moments of frustration and '
                    'un-signaled transitions. The positive behavior plan (PBS) is in effect, '
                    'with strategies for anticipating transitions, environmental enrichment, and differential '
                    'reinforcement of alternative behaviors (DRA). Her father is the primary caregiver and '
                    'receives monthly support from the clinical team.'
                ),
            },
            {
                'name': 'Enzo Barbosa',
                'birth_date': '2020-01-15',
                'guardian_name': 'Tatiane Barbosa',
                'guardian_email': 'tatiane.barbosa@email.com',
                'notes': (
                    'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Global Developmental Delay '
                    '(ICD-10: F89), received a recent diagnosis in March 2024 after '
                    'multidisciplinary assessment. Enzo is 5 years old and is not yet in school; the family '
                    'is waiting for a spot in a daycare center with support. Does not use verbal communication; communicates through '
                    'gestures, pointing, and intentional eye contact. Exhibits emerging motor imitation '
                    'skills, which have been worked on as a gateway for language development. '
                    'Shows pleasure in fitting, stacking, and exploring objects with different '
                    'textures. The family received the diagnosis recently and '
                    'is still in the process of processing and acceptance; the mother reports feelings of guilt '
                    'and burnout, having been referred for individual psychological support. '
                    'The current therapeutic plan prioritizes: (1) development of prerequisites for '
                    'language (imitation, joint attention, functional eye contact); (2) introduction '
                    'of a simplified AAC system; (3) intensive parent training with a focus on '
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
            # ── Leonard Silva ──────────────────────────────────────────────
            # Historical sessions (last 3 months)
            {
                'patient': patients['Leonard'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=88),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on PECS Phase 2 - communicative persistence. '
                    'Leonard practiced the protocol "wait while the communicator does not respond": '
                    'held the image for up to 10 seconds before repeating. '
                    '20 trials were conducted with 60% success. '
                    'Reinforcement: access to tablet with cartoons for 3 minutes after each correct response.'
                ),
            },
            {
                'patient': patients['Leonard'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=75),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on verbal imitation of vowel sounds (/a/, /o/, /u/). '
                    'Activities with sound games: whistle, tambourine, and soap bubbles. '
                    'Leonard produced vowel sounds in 8 out of 15 opportunities (53%). '
                    'Progress from baseline (2/15). Reinforcement: cereal snack.'
                ),
            },
            {
                'patient': patients['Leonard'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=61),
                'status': 'completed',
                'notes': (
                    '50-minute session dedicated to functional eye contact training. '
                    'Protocol: look-take (mandatory to receive desired item). '
                    'Leonard achieved 70% spontaneous eye contact (7/10 trials). '
                    'Used storybook preference as motivational resource.'
                ),
            },
            {
                'patient': patients['Leonard'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=47),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on emotional self-regulation. '
                    'Teaching the "stop-breathe-continue" strategy with visual support. '
                    'Leonard had 3 tantrum episodes during transitions. '
                    'Used the breathing card in 2 out of 3 opportunities. '
                    'Reinforcement: extra time on tablet (5 min additional).'
                ),
            },
            {
                'patient': patients['Leonard'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=33),
                'status': 'completed',
                'notes': (
                    '50-minute session on social skills via parallel -> shared play. '
                    'Activity: joint construction with blocks. Leonard agreed to share space '
                    'with the therapist after visual negotiation. Maintained interaction for 12 continuous minutes. '
                    'Use of social reinforcer: specific praise ("what great teamwork!").'
                ),
            },
            {
                'patient': patients['Leonard'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=19),
                'status': 'completed',
                'notes': (
                    '50-minute session on joint attention via cause-and-effect play. '
                    'Activity: ball that rolls and falls into a bucket, with turn-taking. '
                    'Leonard requested continuation of the game on 4 occasions (vocalization + gesture). '
                    "Emergent joint attention indicator: followed therapist's gaze to object 3x."
                ),
            },
            # More recent sessions (keep existing)
            {
                'patient': patients['Leonard'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=14),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on functional communication via PECS Phase 1. '
                    'Leonard arrived agitated, possibly due to a route change reported by his mother. '
                    'An 8-minute transition period with free-choice activity was necessary '
                    'before starting the structured part. After regulation, he engaged well in the activities. '
                    'Primary reinforcers used: raisins and apple juice. Secondary reinforcers: '
                    'verbal praise and access to 2 minutes of music after each block of trials.'
                ),
            },
            {
                'patient': patients['Leonard'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=7),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on verbal imitation and expansion of requests. '
                    'Leonard showed good disposition since arrival, which facilitated the transition '
                    'to structured activities without needing a waiting period. The token economy '
                    '(5 tokens to earn access to 5 minutes of preferred activity) worked well to '
                    'maintain time-on-task above 8 minutes per block. The mother waited in the waiting room '
                    'and was guided at the end about strategies to generalize at home during the week.'
                ),
            },
            # Scheduled sessions
            {
                'patient': patients['Leonard'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=7),
                'status': 'scheduled',
                'notes': (
                    'Follow-up session for PECS Phase 2 program. '
                    'Assess generalization of communicative persistence skills. '
                    'Test with a new communication partner (assistant therapist).'
                ),
            },
            {
                'patient': patients['Leonard'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=14),
                'status': 'scheduled',
                'notes': (
                    'Family guidance session with mother present. '
                    'Progress review of the last 4 weeks. '
                    'Alignment of strategies for generalization at home.'
                ),
            },
            # ── Sophia Rodrigues ─────────────────────────────────────────────
            {
                'patient': patients['Sophia'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=10),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on social skills and anxiety management in '
                    'situations of activity change. Sophia arrived anxious reporting a '
                    'teacher substitution at school that morning, which left her dysregulated. '
                    'The first 15 minutes were dedicated to regulation strategies: guided '
                    'diaphragmatic breathing, use of the emotions thermometer, and conversation about '
                    'the situation at school with emotional validation. After regulation, it was possible to work the '
                    'planned role-play activity of social interaction with puppet support.'
                ),
            },
            {
                'patient': patients['Sophia'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=5),
                'status': 'scheduled',
                'notes': (
                    'Session scheduled for continuity of the social skills module: recognition '
                    'of facial expressions and emotional prosody using illustrated cards and short '
                    'videos. Introduce the "social detective" exercise where Sophia identifies emotions in '
                    'everyday school scenes. Check with the mother if there were new episodes of anxiety '
                    'at school in the current week and adjust content if necessary.'
                ),
            },
            # ── Peter Alves ─────────────────────────────────────────────────
            {
                'patient': patients['Peter'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=12),
                'status': 'completed',
                'notes': (
                    'Initial session for functional assessment and therapeutic bond establishment. '
                    'Peter arrived accompanied by his mother and showed intense resistance to separation '
                    'at the door, requiring 15 minutes of gradual transition with the mother '
                    'present and progressively moving away. The session was conducted mostly '
                    'in free-play context to gather information about preferences, '
                    'communicative repertoire, and responses to different sensory stimuli. '
                    'Clear tactile hypersensitivity was observed upon contact with modeling clay '
                    'and crepe paper. Tolerates smooth textures and firm surfaces well.'
                ),
            },
            {
                'patient': patients['Peter'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=2),
                'status': 'scheduled',
                'notes': (
                    'Second scheduled session with the goal of starting the individualized sensory diet '
                    'and introducing the first set of pictograms from the visual schedule for the session '
                    'routine (arrival, activity 1, snack, activity 2, goodbye). Include sensory '
                    'integration activity with a kinetic sand box, assessing tactile response. '
                    'Check with the mother about the implementation of the visual schedule at home and any difficulties.'
                ),
            },
            {
                'patient': patients['Peter'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=9),
                'status': 'scheduled',
                'notes': (
                    'Continuity session with review of the visual schedule and expansion of vocabulary '
                    'in PECS. Plan matching and image discrimination activities as prerequisites '
                    'for PECS Phase 1. Include sensory diet with proprioceptive activities '
                    '(push and pull objects, resistance activities) for initial regulation.'
                ),
            },
            # ── Claire Mendes ─────────────────────────────────────────────────
            {
                'patient': patients['Claire'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=3),
                'status': 'canceled',
                'notes': (
                    'Session canceled by the family with 2 hours notice. The caregiver reported '
                    'that Claire had an epileptic seizure the previous night lasting 3 minutes, '
                    'followed by prolonged sleep (post-ictal period). Neurologist was contacted and advised '
                    'rest for 24 hours and monitoring. Session rescheduled. Team was informed and '
                    'note recorded in the chart for tracking seizure frequency in the month.'
                ),
            },
            {
                'patient': patients['Claire'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=1),
                'status': 'completed',
                'notes': (
                    "45-minute session (reduced from the standard 50 due to Claire's "
                    'state at the start — she showed irritability and low frustration tolerance). '
                    'The session was restructured to prioritize sensory regulation activities and '
                    'basic communication via AAC, suspending the planned functional academic '
                    'skills programs. Sensory integration activities were carried out with '
                    'weighted blanket (10 min), linear swing (8 min), and sandbox exploration. '
                    'Claire progressively regulated herself and finished the session calmly.'
                ),
            },
            # ── Gabriel Ferreira ─────────────────────────────────────────────
            {
                'patient': patients['Gabriel'],
                'therapist': therapist_ana,
                'date_time': now - timedelta(days=11),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on pragmatic communication skills. '
                    'Gabriel arrived excited and immediately started a monologue about dinosaurs '
                    'from the Jurassic period, which was used as an entry point to work '
                    'on the skill of "checking the listener\'s interest" and asking questions to the interlocutor. '
                    'Role-plays of balanced conversations were conducted using the "speech bubble" '
                    'as a visual support for the time of each conversational turn. Gabriel understood '
                    'the proposal well and managed to moderate his monologue when receiving the agreed signal.'
                ),
            },
            {
                'patient': patients['Gabriel'],
                'therapist': therapist_ana,
                'date_time': now + timedelta(days=4),
                'status': 'scheduled',
                'notes': (
                    'Session scheduled for continuity of conversational skills training, '
                    'with introduction of the "other\'s perspective" exercise using social '
                    'stories as a resource. Specifically work on the ability to identify when '
                    'the interlocutor is bored or wanting to change the subject, using video '
                    'scenes as stimulus. Check with the mother for reports of generalization in the school environment.'
                ),
            },
            # ── Isabella Santana ───────────────────────────────────────────────
            {
                'patient': patients['Isabella'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=9),
                'status': 'completed',
                'notes': (
                    '50-minute session with ongoing maternal separation desensitization '
                    'protocol (week 6). The mother remained in the room for the first 10 minutes, '
                    'waited outside with the door ajar for 15 minutes, and then '
                    'withdrew to the waiting room for the remainder of the session. Isabella cried for '
                    "approximately 8 minutes after the mother's definitive departure (reduction compared "
                    'to 18 minutes the previous week). Music was used as a regulator, '
                    'and Isabella\'s favorite song ("Aquarela" by Toquinho) served as an anchor '
                    'for emotional regulation. Finished the session engaged and smiling.'
                ),
            },
            {
                'patient': patients['Isabella'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=6),
                'status': 'scheduled',
                'notes': (
                    'Session planned to advance to step 7 of the desensitization protocol: '
                    'mother leaves immediately at the start of the session, without a staying period. Prepare '
                    'anticipation strategies (use the session routine board to show that '
                    'mother returns at the end) and have the musical resource available immediately. '
                    'Document time to regulation and compare with previous session.'
                ),
            },
            # ── Matthew Oliveira ───────────────────────────────────────────────
            {
                'patient': patients['Matthew'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=8),
                'status': 'completed',
                'notes': (
                    '50-minute session integrating ABA and adapted CBT strategies for managing '
                    'compulsive behaviors. Matthew reported a difficult week at school: he spent '
                    '20 minutes checking his backpack before entering the classroom, causing '
                    'conflict with the teacher. A functional analysis of the checking '
                    'behavior was conducted together with Matthew, identifying the antecedent (doubt about having '
                    'brought the planner) and the consequence (temporary relief of anxiety). '
                    'The "compulsion delay" technique was introduced with a card for recording, '
                    'which Matthew accepted well. He practiced 3 exposure with response '
                    'prevention trials during the session with partial success.'
                ),
            },
            {
                'patient': patients['Matthew'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=7),
                'status': 'scheduled',
                'notes': (
                    'Session to review the use of the compulsion delay card during the week. '
                    'Plan a new round of exposure with response prevention for the backpack '
                    'checking ritual, increasing delay time from 2 to 5 minutes. '
                    'Work on cognitive flexibility via chess with modified rules '
                    '("chaotic chess" technique for training adaptation to changes). '
                    'Check with the father for reports about rituals at home and at school.'
                ),
            },
            # ── Laura Pimentel ────────────────────────────────────────────────
            {
                'patient': patients['Laura'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=6),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on emotional regulation and frustration tolerance '
                    'associated with school difficulties. Laura arrived with an angry expression, '
                    'reporting that she had "gotten everything wrong" in the reading activity in class. The first '
                    '10 minutes were dedicated to emotional validation and using the emotions '
                    'thermometer to name and grade what she was feeling. Then a LEGO '
                    'building activity (preserved competence) was carried out as a positive regulator, '
                    'transitioning after 15 minutes to a pre-reading activity with high-structure '
                    'visual support (rhyming cards with images). Laura finished the session '
                    'regulated and with a positive self-assessment about the building part.'
                ),
            },
            {
                'patient': patients['Laura'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=8),
                'status': 'scheduled',
                'notes': (
                    'Session for continuity of emotional regulation work and introduction of '
                    'visual compensation strategies for reading (use of colored reading ruler '
                    'and OpenDyslexic font in printed materials). Plan the "book of '
                    'things I do well" activity to strengthen self-esteem and competence narrative. '
                    'Talk with the mother about formal adaptations to request from the school.'
                ),
            },
            # ── Hector Campos ─────────────────────────────────────────────────
            {
                'patient': patients['Hector'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=5),
                'status': 'completed',
                'notes': (
                    '50-minute session focused on comprehension of instructions and use of visual '
                    'supports complementary to verbal communication. Hector was in good spirits and '
                    'engaged easily with vehicle-themed activities. '
                    'Two-step instructions with simultaneous visual support were practiced (pictogram '
                    'next to the spoken instruction), and Hector responded correctly in 7 out of 10 '
                    'trials, while in the 3 trials without visual support performance dropped '
                    'to 2 out of 5 correct, confirming dependence on visual support for '
                    'auditory processing in a noisy context.'
                ),
            },
            {
                'patient': patients['Hector'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=1),
                'status': 'scheduled',
                'notes': (
                    'Session for generalization of instructions with visual support for a '
                    'small group context (2 patients), simulating the classroom environment. '
                    'Train Hector in using the agreed signal ("I didn\'t understand") to request '
                    'repetition of instruction, reducing the freezing behavior. '
                    'Prepare guidance material for the school about using the agreed signal '
                    'and about the difference between non-comprehension and refusal.'
                ),
            },
            # ── Valentina Cruz ────────────────────────────────────────────────
            {
                'patient': patients['Valentina'],
                'therapist': therapist_carlos,
                'date_time': now - timedelta(days=4),
                'status': 'completed',
                'notes': (
                    '45-minute session focused on communication via AAC and management of self-injurious '
                    'behavior (SIB) during transitions. Valentina had 2 episodes of SIB (hitting '
                    'her hand on her head) during the transition from the fitting activity to the snack '
                    'activity, both of low intensity and duration under 10 seconds. '
                    'The PBS protocol was applied: visual anticipation of the transition with 3 minutes '
                    'advance notice, use of visual timer, and immediate reinforcement of calm waiting. '
                    'In AAC use, Valentina spontaneously selected the icons "water" and '
                    '"rest" on 2 separate occasions, both functional and attended to.'
                ),
            },
            {
                'patient': patients['Valentina'],
                'therapist': therapist_carlos,
                'date_time': now + timedelta(days=6),
                'status': 'scheduled',
                'notes': (
                    'Continuity session with review of SIB frequency data from the last '
                    '2 weeks and adjustment of the PBS protocol if necessary. Expand the functional '
                    'vocabulary in AAC to include icons for basic emotions (happy, sad, '
                    'in pain, scared). Talk to the father about the implementation of the sleep '
                    'hygiene protocol and assess adherence and initial effectiveness.'
                ),
            },
            # ── Enzo Barbosa ──────────────────────────────────────────────────
            {
                'patient': patients['Enzo'],
                'therapist': therapist_beatriz,
                'date_time': now - timedelta(days=13),
                'status': 'completed',
                'notes': (
                    'Initial session for assessment of prerequisites for language and establishment '
                    'of therapeutic bond. Enzo was accompanied by his mother throughout the session '
                    '(full parental inclusion protocol for the first 4 weeks). Gross motor imitation '
                    'skills were present (clapping, hitting table), fine motor imitation absent, '
                    "emergent joint attention (follows therapist's pointing "
                    'in 3 out of 8 trials), and intentional eye contact present in '
                    'requesting contexts. The mother was guided on NDBI strategies '
                    "to implement at home: follow the child's lead, comment without demanding, "
                    "position at Enzo's eye level and create communication opportunities."
                ),
            },
            {
                'patient': patients['Enzo'],
                'therapist': therapist_beatriz,
                'date_time': now + timedelta(days=3),
                'status': 'scheduled',
                'notes': (
                    'Second session focused on fine motor imitation and expansion of joint '
                    'attention. Plan imitation activities in front of the mirror and '
                    'cause-and-effect games (musical toys, balls that roll). '
                    'Review with the mother the NDBI strategies from the previous week: what worked, '
                    'what caused difficulty, and adjust guidance. Introduce the first '
                    'AAC pictogram ("more" icon) in a preferred activity context.'
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
            key = f'{session.patient.name.split()[0]}_{session_data["status"]}'
            if key not in sessions:
                sessions[key] = []
            sessions[key].append(session)

        return sessions

    def create_evolutions(self, sessions, users):
        evolutions_data = [
            # ── Leonard - session 1 (88 days ago / PECS Phase 2) ───────────
            {
                'session_key': 'Leonard_completed',
                'session_index': 0,
                'objective': (
                    'Teach communicative persistence via PECS Phase 2: Leonard holds '
                    'the image until he gets a response from the communicator.'
                ),
                'activities': (
                    'Protocol "wait for response": therapist holds the image without delivering the item. '
                    'Leonard waits up to 10 seconds. 20 trials, 12 correct (60%).'
                ),
                'behavior': (
                    'Leonard showed mild frustration in 4 trials (pushes image away). '
                    'On correct trials, he delivered the image firmly. Maintained high motivation.'
                ),
                'progress': (
                    'Baseline: 0% persistence. Result: 60% — significant progress. '
                    'Criterion: 80% to advance to next phase.'
                ),
                'next_steps': ('Increase wait time to 15 seconds. Introduce 2 communicators.'),
                'released_to_family': True,
            },
            # ── Leonard - session 2 (75 days ago / Verbal imitation) ────────
            {
                'session_key': 'Leonard_completed',
                'session_index': 1,
                'objective': ('Establish verbal imitation of vowels in a playful context.'),
                'activities': (
                    'Sound games: whistle, tambourine, soap bubbles. '
                    '15 imitation opportunities after modeling.'
                ),
                'behavior': (
                    'Leonard produced /a/, /o/, /u/ in 8 out of 15 trials (53%). '
                    'Associated sound with the action of blowing. No disruptive behaviors.'
                ),
                'progress': (
                    'Baseline: 2/15 (13%). Current session: 8/15 (53%). '
                    'Increase of 40 percentage points.'
                ),
                'next_steps': (
                    'Continue with bilabial sounds (/p/, /b/, /m/). Use snack as reinforcer.'
                ),
                'released_to_family': False,
            },
            # ── Leonard - session 3 (61 days ago / Eye contact) ──────────
            {
                'session_key': 'Leonard_completed',
                'session_index': 2,
                'objective': ('Increase functional eye contact to 80% of requests.'),
                'activities': (
                    'Protocol "look-take": item given only after eye contact >1s. '
                    '10 trials with storybook preference as motivator.'
                ),
                'behavior': (
                    'Leonard achieved 70% spontaneous eye contact (7/10). '
                    'In the other 3, needed visual prompt (signal to "look").'
                ),
                'progress': ('Baseline: 30%. Session: 70%. Very good progress.'),
                'next_steps': ('Reduce visual prompt. Reach 80% without help.'),
                'released_to_family': True,
            },
            # ── Leonard - session 4 (47 days ago / Emotional regulation) ─────
            {
                'session_key': 'Leonard_completed',
                'session_index': 3,
                'objective': ('Teach "stop-breathe-continue" strategy with visual support.'),
                'activities': (
                    'Visual breathing card. 3 tantrum episodes during transitions. '
                    'Strategy practice in each episode.'
                ),
                'behavior': (
                    '3 brief tantrums (30-60 sec). Used breathing card in 2/3 opportunities. '
                    'Self-regulation improving.'
                ),
                'progress': ('Before: 0 use of strategy. Now: 2/3 opportunities (67%).'),
                'next_steps': ('Practice strategy in natural environment (home, school).'),
                'released_to_family': False,
            },
            # ── Leonard - session 5 (33 days ago / Social skills) ─────
            {
                'session_key': 'Leonard_completed',
                'session_index': 4,
                'objective': ('Transition from parallel play to shared interaction.'),
                'activities': (
                    'Joint construction with blocks. Visual negotiation of space. '
                    'Alternating turns for 12 minutes.'
                ),
                'behavior': (
                    'Leonard agreed to share space. Maintained interaction for 12 continuous minutes. '
                    'Initiated spontaneous eye contact to check therapist 4x.'
                ),
                'progress': ('First session of shared interaction. Goal achieved!'),
                'next_steps': ('Introduce second patient in structured activity (dual session).'),
                'released_to_family': True,
            },
            # ── Leonard - session 6 (19 days ago / Joint attention) ───
            {
                'session_key': 'Leonard_completed',
                'session_index': 5,
                'objective': ('Develop joint attention via cause-and-effect play.'),
                'activities': (
                    'Ball that rolls and falls into a bucket. Turn-taking. '
                    '4 opportunities to request continuation.'
                ),
                'behavior': (
                    'Leonard requested continuation 4x (vocalization + gesture). '
                    "Followed therapist's gaze to object 3x — emergent joint attention!"
                ),
                'progress': ('First clear evidence of joint attention. Important milestone!'),
                'next_steps': (
                    'Generalize joint attention with other games and communication partners.'
                ),
                'released_to_family': False,
            },
            # ── Leonard - session 7 (14 days ago / PECS Phase 1) ─────────────
            {
                'session_key': 'Leonard_completed',
                'session_index': 6,
                'objective': (
                    'Establish functional communicative exchange via PECS Phase 1: Leonard spontaneously '
                    'hands the image of a desired item to the communicator to obtain it, '
                    'without physical prompting.'
                ),
                'activities': (
                    'Discrete trial training (DTT) with 4 highly preferred items '
                    '(raisins, red ball, soap bubbles, and music on tablet). '
                    '30 trials were conducted distributed across 3 blocks of 10, with a 2-minute '
                    'free activity break between blocks. The therapist positioned herself '
                    'in front of Leonard with the item visible and the corresponding image available '
                    'on the table. Full physical prompting was used in the first trials '
                    'and gradually faded across blocks. At the end, '
                    '5 generalization trials were conducted with the assistant therapist as '
                    'a new communication partner.'
                ),
                'behavior': (
                    'Leonard showed high motivation for the selected items. He demonstrated '
                    'alternating gaze behavior between the item and the therapist in 6 trials, '
                    'indicating emerging communicative intentionality. There were 2 brief episodes '
                    'of distraction (got up and went toward the window), being redirected '
                    'with a gestural prompt. No disruptive behaviors were observed. '
                    'In generalization with the assistant therapist, he handed over the image in 3 out of 5 '
                    'trials with minimal prompting (elbow touch).'
                ),
                'progress': (
                    'Baseline (previous week): 2 spontaneous requests per session. '
                    'Result of this session: 8 spontaneous requests (without physical prompting) '
                    'in the probe trials inserted across blocks. Mastery criterion for '
                    'phase advancement: 80% independence in 3 consecutive sessions with 2 '
                    'distinct communicators. Current performance: 67% independence with '
                    'primary communicator.'
                ),
                'next_steps': (
                    'Continue PECS Phase 1 until mastery criterion is reached (80% with 2 '
                    'communicators). Gradually introduce new communication partners (mother, '
                    'support teacher). Start planning PECS Phase 2 '
                    '(persistence — what to do when the communicator does not respond immediately). '
                    'Guide the mother to create 3 daily opportunities for requesting via PECS at home.'
                ),
                'released_to_family': True,
            },
            # ── Leonard - session 8 (7 days ago) ───────────────────────────
            {
                'session_key': 'Leonard_completed',
                'session_index': 7,
                'objective': (
                    'Expand repertoire of spontaneous requests via PECS to 5 distinct '
                    'items and begin verbal imitation of vowel sounds in a playful context.'
                ),
                'activities': (
                    'Block 1 (20 min): PECS Phase 1 with 5 items (added: toy '
                    'spaghetti and whistle). 25 trials distributed across 2 blocks. '
                    'Block 2 (20 min): Verbal imitation with sound games — soap bubbles '
                    '(encourages blowing and vocalization), colored whistle, and percussion instrument. '
                    'The therapist modeled vowel sounds (/a/, /o/, /u/) after each action with '
                    'the toy and waited 5 seconds for an imitation attempt. '
                    'Block 3 (10 min): Token economy — Leonard accumulated tokens in activities '
                    'from previous blocks and exchanged them for 8 minutes of access to tablet with music.'
                ),
                'behavior': (
                    'Leonard started the session regulated and motivated. Remained on task for '
                    'blocks of up to 12 minutes without needing redirection, which represents '
                    'improvement from the previous session (maximum of 8 minutes). '
                    'Vocalized /a/ and /u/ spontaneously on 4 occasions during the whistle '
                    'game, associating the vocalization with the action of blowing — behavior '
                    'not observed in previous sessions. Had 1 brief tantrum '
                    'episode (30 sec) when tablet access was ended, resolved with '
                    'verbal anticipation of the next activity.'
                ),
                'progress': (
                    'PECS: 80% independence with primary communicator for 3 of the 5 items '
                    '(raisins, ball, music). New items (spaghetti and whistle) still with '
                    'minimal prompting (50% independence). Mastery criterion not yet '
                    'reached for all items with 2 communicators. '
                    'Verbal imitation: 4 spontaneous vowel vocalizations — significant increase '
                    'from baseline (0 spontaneous vocalizations in imitation context).'
                ),
                'next_steps': (
                    'Reach 80% independence on new items in PECS. Introduce mother as '
                    'secondary communicator in the last 10 trials of the next session. '
                    'Continue verbal imitation program focusing on bilabial sounds (/p/, /b/, /m/). '
                    'Introduce functional words "more" and "finished" in a preferred activity '
                    'context (tablet), associating spoken word with the pointing gesture.'
                ),
                'released_to_family': False,
            },
            # ── Sophia - session (10 days ago) ──────────────────────────────
            {
                'session_key': 'Sophia_completed',
                'session_index': 0,
                'objective': (
                    'Develop emotional regulation skills in the face of unexpected changes '
                    'in routine and train self-regulation strategies for independent use in '
                    'the school context.'
                ),
                'activities': (
                    'Block 1 (15 min): Emergency emotional regulation — diaphragmatic breathing '
                    '(3 sets of 4 breaths), use of the emotions thermometer (scale 1-5) to '
                    'name and grade what she felt about the school situation, and structured conversation '
                    'with emotional validation ("it makes sense to feel this way when something changes suddenly"). '
                    'Block 2 (25 min): Social interaction role-play with puppets — two scenarios '
                    '(asking to join a game and dealing with a "no" from peers). '
                    'Sophia chose the puppets and directed the second scenario spontaneously. '
                    'Block 3 (10 min): Review of regulation strategies and creation of a '
                    '"pocket card" with 3 strategies chosen by Sophia to use at school.'
                ),
                'behavior': (
                    'Sophia arrived visibly anxious (reported racing heart and stomach '
                    '"in knots"). Responded well to the regulation strategies in block 1, reaching '
                    'level 2 on the emotions thermometer at the end of the block (entered at level 4). '
                    'In the role-play, she demonstrated appropriate social initiations and creativity in '
                    'conducting the scenario. At one point, the peer puppet said "you can\'t come in", '
                    'and Sophia froze for 8 seconds before continuing — typical freezing '
                    'behavior in the face of rejection. It was possible to work on the situation '
                    'in situ with the therapist modeling the appropriate verbal response.'
                ),
                'progress': (
                    'Emotional regulation: time to reach level 2 on the thermometer decreased from '
                    '25 minutes (session 3 weeks ago) to 15 minutes in this session. '
                    'Social skills: increased from 2 to 5 spontaneous social initiations '
                    'during role-play without verbal prompting. Sophia spontaneously used '
                    'the breathing strategy 1 time during the session when she got frustrated '
                    'with the puppet, which represents functional and independent use of the strategy.'
                ),
                'next_steps': (
                    'Check use of the pocket card at school with the mother (follow up with the pedagogical '
                    'support about integrating the card into the school routine). Work on social rejection '
                    'scenes with increasing difficulty gradation. Introduce the '
                    '"social detective" exercise for identifying emotions in faces '
                    'and voices from everyday scenes (short videos without audio + with audio).'
                ),
                'released_to_family': False,
            },
            # ── Peter - session (12 days ago) ──────────────────────────────
            {
                'session_key': 'Peter_completed',
                'session_index': 0,
                'objective': (
                    "Conduct initial functional assessment of Peter's behavioral, communicative, "
                    'and sensory repertoire, and establish therapeutic alliance with the child and family.'
                ),
                'activities': (
                    'Assessment session in a naturalistic free-play context. '
                    'Varied materials made available: interlocking blocks, modeling clay, '
                    'crepe paper, kinetic sand, cars, and toy kitchen sets. '
                    'The therapist observed and recorded: (1) motor imitation repertoire; '
                    '(2) responses to different textures; (3) vocalizations and communicative '
                    'attempts; (4) restricted or repetitive interest behaviors; '
                    "(5) tolerance to the unknown adult's presence. "
                    'The mother was interviewed using the VINELAND-3 (adaptive skills) script '
                    'during the first 20 minutes while Peter explored the environment.'
                ),
                'behavior': (
                    'Peter explored the materials systematically, testing each item '
                    'individually. Pulled his hand away immediately upon contact with modeling clay '
                    '(expression of disgust, refusal vocalization) and with crepe paper (same pattern). '
                    'Tolerated interlocking blocks, cars, and kinetic sand well for more '
                    'than 3 minutes. Imitated 2 gestures from the therapist (clapping and hitting table) '
                    'spontaneously. Did not use words, communicated through pointing, '
                    "touching the therapist's arm, and affirmative (/uh/) and negative "
                    "(/eh/ with head shake) vocalizations. Tolerated the therapist's presence at 50 cm "
                    'without signs of discomfort after the first 10 minutes.'
                ),
                'progress': (
                    'Initial assessment completed. Preliminary profile: marked tactile hypersensitivity '
                    'for soft and irregular textures; gross motor imitation present; '
                    'pre-verbal communication with clear communicative intentionality; tolerance '
                    'to unknown adult within expected range for the profile. VINELAND-3 data '
                    'collected with mother: significant delay in expressive communication and '
                    'daily living skills; socialization and motor skills within the expected '
                    'range for developmental level.'
                ),
                'next_steps': (
                    'Develop Individualized Intervention Plan (IIP) based on the assessment. '
                    'Priorities: (1) sensory diet for tactile hypersensitivity; '
                    '(2) introduction of visual schedule to structure session routine; '
                    '(3) PECS Phase 1 with preferred items identified today. '
                    "Refer for sensory integration assessment by the clinic's partner OT."
                ),
                'released_to_family': True,
            },
            # ── Claire - session (1 day ago) ─────────────────────────────────
            {
                'session_key': 'Claire_completed',
                'session_index': 0,
                'objective': (
                    'Promote sensory and emotional regulation after a week with '
                    'neurological intercurrence, and maintain engagement with the AAC system in a '
                    'low-demand context.'
                ),
                'activities': (
                    'Block 1 – Sensory regulation (23 min): weighted blanket on lap and '
                    'shoulders (10 min), followed by linear swing in a hammock (8 min) with slow rhythm '
                    'and low-volume instrumental music, ending with free exploration '
                    'of kinetic sandbox (5 min). '
                    'Block 2 – AAC and communication (17 min): large piece fitting activity '
                    'with structured opportunities for requesting via tablet AAC. '
                    'The therapist created situations of missing pieces to motivate requesting '
                    '"more". 10 requesting trials were conducted, also accepting '
                    'pointing to the tablet as an alternative communicative form.'
                ),
                'behavior': (
                    'Claire arrived with a closed expression and resisted eye contact in the '
                    'first 5 minutes. At the start of the weighted blanket, she progressively relaxed '
                    '(facial muscles and shoulders visibly more relaxed in 4 minutes). '
                    'On the swing, she vocalized /ah/ and /oh/ with a tone of pleasure, vocal '
                    'behaviors present only in states of high regulation. '
                    'In the AAC block, she selected the "water" icon spontaneously upon noticing '
                    'the water bottle on the table (it was not in the plan, but was attended to immediately '
                    'as reinforcement of functional communicative behavior) and the '
                    '"more" icon in 4 out of 10 trials with minimal prompting (pointing to the tablet).'
                ),
                'progress': (
                    'Sensory regulation: reached regulation state in 23 minutes (average of the '
                    'last 4 sessions without intercurrence: 15 minutes — expected increase given '
                    "the week's context with epileptic seizure). "
                    'AAC: 4 selections with minimal prompting + 1 spontaneous (icon "water") — '
                    'best spontaneous communicative performance recorded to date. '
                    'SIB: 0 episodes in this session (average of 2-3 in previous sessions), '
                    'possibly favored by the low-demand format adopted.'
                ),
                'next_steps': (
                    'Resume suspended programs (functional skills) in the next session '
                    'if Claire is regulated from arrival. Discuss with the neurologist '
                    'the impact of the seizure on performance in subsequent sessions. '
                    'Expand AAC vocabulary: add icons "finished", "I don\'t want" '
                    'and "help" in the next 2 sessions. Reinforce with the father the importance of '
                    'maintaining the transition signaling routine at home.'
                ),
                'released_to_family': True,
            },
            # ── Gabriel - session (11 days ago) ─────────────────────────────
            {
                'session_key': 'Gabriel_completed',
                'session_index': 0,
                'objective': (
                    'Develop conversational turn regulation skill: ask '
                    "questions to the interlocutor, check the other's interest, and modulate "
                    'speaking time about topics of own interest.'
                ),
                'activities': (
                    'Block 1 (10 min): Free conversation about dinosaurs — the therapist '
                    'recorded monologue time and number of questions asked to her. '
                    'Observational baseline: 8 minutes of monologue, 0 questions. '
                    'Block 2 (25 min): Explicit teaching of the "conversational turn" concept '
                    'with the visual support of the "speech bubble" (card with a 30-second hourglass '
                    'that passes from hand to hand). Role-play of conversation about dinosaurs and '
                    "about the therapist's preferred topic (cooking), with role reversal. "
                    'Block 3 (15 min): Naturalistic practice — free conversation with the '
                    'speech bubble support, with Gabriel being responsible for passing the bubble.'
                ),
                'behavior': (
                    'Gabriel quickly understood the speech bubble proposal and showed '
                    'motivation for the exercise, comparing it to a "game rule". '
                    'In block 2, he asked 5 questions to the therapist about cooking (non-preferred '
                    'topic), 2 genuine and 3 clearly formulated to "follow the '
                    'protocol" — difference pointed out by the therapist with humor and without judgment. '
                    'In block 3, he passed the bubble in 4 out of 6 appropriate moments, missing '
                    'the 2 moments when he was in the middle of information he considered '
                    '"very important". Recognized the difficulty when questioned.'
                ),
                'progress': (
                    'Baseline: 0 spontaneous questions to interlocutor, 8 min monologue. '
                    'Result of this session (naturalistic block): 4 spontaneous questions, '
                    'maximum monologue of 2 minutes before passing the bubble. '
                    'Recognition of the conversational turn concept: present and verbalized '
                    'by Gabriel himself ("I know I keep talking a lot about dinosaurs").'
                ),
                'next_steps': (
                    'Gradually remove the speech bubble support, replacing it with '
                    'a discreet gestural signal (shoulder tap). Introduce the '
                    '"other\'s perspective" exercise with illustrated social stories. Ask the '
                    'mother to record conversation situations at home where Gabriel spontaneously '
                    'uses conversational turn, for analysis in the next session.'
                ),
                'released_to_family': False,
            },
            # ── Isabella - session (9 days ago) ──────────────────────────────
            {
                'session_key': 'Isabella_completed',
                'session_index': 0,
                'objective': (
                    'Advance in the maternal separation desensitization protocol (step 6): '
                    'mother stays 10 min, waits 15 min outside with door ajar '
                    'and withdraws to the waiting room for the remaining time. Maintain functional '
                    'communication and engagement in music-mediated activities.'
                ),
                'activities': (
                    'Transition step (25 min): according to the desensitization protocol, '
                    'with gradually reduced mother presence. During the period without the mother, '
                    "the therapist immediately used Isabella's preferred playlist "
                    '(songs by Toquinho and Palavra Cantada) as a regulation anchor. '
                    'Activities during the session: fitting geometric shapes with background '
                    'music, gesture imitation game with song ("If This Street Were Mine") '
                    'and a "musical band" activity with small percussion instruments. '
                    'In the last 5 minutes, the mother entered gently and Isabella greeted her '
                    'with a hug — reinforcing the predictable return of the attachment figure.'
                ),
                'behavior': (
                    'Isabella showed anticipatory anxiety before the session, reported by the '
                    'mother in the waiting room ("she asked 5 times if I was going to stay"). '
                    "At the moment of the mother's definitive departure, she cried for 8 minutes (previous: "
                    '18 min), being comforted by music and gradual engagement '
                    'of the therapist with the instruments. The crying ceased autonomously, '
                    "without need for the mother's return — important milestone in the protocol. "
                    'After regulation, she participated in the musical activities with high engagement '
                    'and spontaneously started vocalizing song lyrics.'
                ),
                'progress': (
                    'Desensitization protocol: post-separation crying time reduced from '
                    '18 to 8 minutes (56% reduction compared to previous week). '
                    "Autonomous regulation achieved without mother's return for the first time in the protocol. "
                    'Functional communication: 3 spontaneous requests during the session '
                    '("more music", "this" pointing to instrument, "no" when ending activity).'
                ),
                'next_steps': (
                    'Advance to step 7: mother leaves immediately at the beginning of the session. '
                    'Maintain music as a transition regulation strategy. '
                    'Introduce visual board "mommy comes back when the clock gets here" '
                    'as a temporal anticipation support. Guide the mother to keep the '
                    'goodbye brief and confident, without showing visible anxiety.'
                ),
                'released_to_family': True,
            },
            # ── Matthew - session (8 days ago) ───────────────────────────────
            {
                'session_key': 'Matthew_completed',
                'session_index': 0,
                'objective': (
                    'Conduct functional analysis of the backpack checking behavior '
                    'and introduce the compulsion delay technique as a first strategy '
                    'of exposure with response prevention (ERP).'
                ),
                'activities': (
                    'Block 1 (20 min): Collaborative functional analysis — the therapist and Matthew '
                    'filled out together an "ABC diagram" (Antecedent-Behavior-Consequence) '
                    "describing the week's episode at school. Matthew identified the antecedent "
                    '("I don\'t know if I brought the planner") and the consequence ("I feel less nervous for '
                    'a while"). The therapist introduced the concept of the "anxiety cycle" '
                    'with a video game analogy (the compulsion is a "fake power-up" '
                    "that doesn't solve the final boss). "
                    'Block 2 (20 min): Introduction of the delay technique + ERP training. '
                    'Matthew practiced delaying the checking by 2 minutes in 3 simulated trials '
                    '(the therapist hid an item from the table and Matthew recorded the doubt on the '
                    'card and waited for the timer). '
                    'Block 3 (10 min): Chess game to wrap up, reinforcing flexibility '
                    'and self-regulation in a game context.'
                ),
                'behavior': (
                    'Matthew actively engaged in the functional analysis and showed good '
                    'insight ability by recognizing the anxiety cycle pattern. '
                    'In the simulated ERP trials: managed to wait the 2 minutes in 2 '
                    'out of 3 trials; in the third trial, "checked" the hidden item '
                    'at 90 seconds, immediately recognizing he had given in. '
                    'Verbalized "it\'s harder than it seems in theory" — demonstrating '
                    'adequate self-awareness. In chess, made an unusual move at the end '
                    'of the game and was visibly tense for 15 seconds before accepting the '
                    'loss — it was possible to work on the moment in situ.'
                ),
                'progress': (
                    'First formal ERP session: 67% performance (2/3 successful trials) '
                    'with 2-minute duration is considered a good start for ERP. '
                    'Insight about the anxiety cycle: present and verbalized by Matthew himself. '
                    'Use of the recording card: accepted and used without resistance — adherence '
                    'to the instrument is a prerequisite for effective outpatient ERP.'
                ),
                'next_steps': (
                    'Review use of the delay card during the week. Increase delay time '
                    'from 2 to 5 minutes in the next ERP trials. Work on the desk symmetry '
                    'ritual (second ritual in degree of distress according to '
                    'the hierarchy built with Matthew). Continue chess as a tool '
                    'for training tolerance to uncertainty and defeat.'
                ),
                'released_to_family': False,
            },
            # ── Laura - session (6 days ago) ────────────────────────────────
            {
                'session_key': 'Laura_completed',
                'session_index': 0,
                'objective': (
                    'Work on emotional regulation in situations of school frustration '
                    'associated with reading difficulties, and initiate a pre-reading '
                    'activity with high-structure visual support in a regulated state.'
                ),
                'activities': (
                    'Block 1 – Emotional regulation (25 min): Welcoming of frustration with '
                    'structured conversation ("what happened, what I felt, what my body did"). '
                    'Use of the emotions thermometer to grade anger (Laura marked 4/5). '
                    'Free LEGO building activity for 15 minutes as a positive regulator '
                    '(preserved and pleasurable competence). Laura built a '
                    'zoo with LEGO animals and narrated the story spontaneously — '
                    'intact and creative verbal expressive skill. '
                    'Block 2 – Pre-reading with visual support (20 min): rhyming cards '
                    'with images (e.g., BALL/WALL with illustrations), '
                    '"find the sound pair" activity without requiring conventional reading. '
                    'High-structure visual support reduced the phonemic decoding demand '
                    'and allowed success in the task.'
                ),
                'behavior': (
                    'Laura entered the room with furrowed brows and crossed her arms '
                    'when sitting down — clear angry body language. Responded to '
                    'welcoming with short sentences initially, opening up progressively. '
                    'With LEGO, visibly relaxed and initiated spontaneous and elaborate narrative '
                    'about the zoo animals. In the rhyming activity, got 8 out of 10 '
                    'pairs correct without missing any pair with full visual support. '
                    'On 1 card without an image (inserted intentionally), got stuck for '
                    '12 seconds and then said "I don\'t know this one, there\'s no picture" — '
                    'demonstrating awareness of the compensatory strategy she uses.'
                ),
                'progress': (
                    'Emotional regulation: time to reach level 2 on the thermometer was '
                    '22 minutes (previous benchmark: 30 minutes — 27% reduction). '
                    'Pre-reading: 80% accuracy with full visual support. Without support: '
                    '0% (1 trial) — confirms dependence on visual support as a functional '
                    'compensatory strategy. Spontaneous narrative: 4 minutes of coherent '
                    'and creative narration — preserved resource to be explored therapeutically.'
                ),
                'next_steps': (
                    'Introduce colored reading ruler and assess impact on decoding '
                    'task in the next session. Create with Laura the "book of things I '
                    'do well" — first chapter about LEGO and storytelling. '
                    'Draft guidance letter for the school requesting: use of enlarged '
                    'font, reading ruler, additional time in written activities, '
                    'and oral assessment as an alternative. Share a partial report '
                    'with the mother in the next family guidance session.'
                ),
                'released_to_family': False,
            },
            # ── Hector - session (5 days ago) ───────────────────────────────
            {
                'session_key': 'Hector_completed',
                'session_index': 0,
                'objective': (
                    'Assess dependence on visual support for comprehension of 2-step '
                    'instructions under different noise conditions and introduce the agreed '
                    'signal "I didn\'t understand" for requesting repetition.'
                ),
                'activities': (
                    'Block 1 (15 min): 2-step instruction WITH simultaneous visual support '
                    '(pictogram next to speech) in silent environment — 10 trials. '
                    'Block 2 (15 min): 2-step instruction WITHOUT visual support in '
                    'silent environment — 5 trials. '
                    'Block 3 (10 min): 2-step instruction WITHOUT visual support with controlled '
                    'background noise (recording of classroom at low volume) — '
                    '5 trials. '
                    'Block 4 (10 min): Teaching the agreed signal "I didn\'t understand" (open hand '
                    'in front of face) with modeling and practice in 6 opportunities '
                    'intentionally created (deliberately fast and low instruction).'
                ),
                'behavior': (
                    'Hector engaged well in blocks 1 and 2, showing enthusiasm '
                    'for the vehicle-themed materials used in the instructions '
                    '("put the truck in the garage and push the train to the bridge"). '
                    'In block 3, he showed the "freezing" behavior in 3 out of 5 '
                    'trials, looking at the therapist for up to 6 seconds without acting. '
                    'In block 4, he learned the signal easily and used it '
                    'spontaneously in the 5th opportunity — within what was expected '
                    'for a first exposure to the signal.'
                ),
                'progress': (
                    'With visual support, silent environment: 7/10 correct (70%). '
                    'Without visual support, silent environment: 2/5 correct (40%). '
                    'Without visual support, with noise: 1/5 correct (20%) + 3 instances of freezing. '
                    'Data confirm the hypothesis of significant dependence on visual '
                    'support, especially in a noisy environment — consistent with CAPD. '
                    'Learning of the "I didn\'t understand" signal: 1 spontaneous use in 6 trials '
                    '(17% — expected for first exposure).'
                ),
                'next_steps': (
                    'Generalize the "I didn\'t understand" signal in a small group context (2 children). '
                    'Prepare guidance material for the school describing: difference between '
                    'non-comprehension and refusal, protocol for using the agreed signal, and how '
                    'the teacher should respond (repeat with visual support, not just '
                    'increase volume). Refer session data to the speech therapist '
                    'responsible for CAPD follow-up.'
                ),
                'released_to_family': True,
            },
            # ── Valentina - session (4 days ago) ────────────────────────────
            {
                'session_key': 'Valentina_completed',
                'session_index': 0,
                'objective': (
                    'Maintain and expand functional use of the AAC system for expressing '
                    'basic needs, and apply the PBS protocol for reduction of '
                    'self-injurious behavior (SIB) during transition moments.'
                ),
                'activities': (
                    'Block 1 – Regulation and AAC (20 min): Large piece fitting activity '
                    'with structured opportunities for AAC use. The therapist created '
                    '10 requesting opportunities: 5 for "more pieces" and 5 for "help". '
                    "The tablet with Tobii Snap Core First was positioned 30 cm from Valentina's "
                    'dominant hand. '
                    'Block 2 – Transitions with PBS (15 min): 3 planned transitions between '
                    'activities, each anticipated with a 3-minute visual timer, '
                    'verbal warning + pictogram, and immediate reinforcement of calm waiting. '
                    'Block 3 – Functional snack (10 min): Valentina used the AAC to '
                    'request snack items (already familiar with the icons "water", '
                    '"cookie", and "finished").'
                ),
                'behavior': (
                    'Valentina arrived in adequate disposition (no signs of excessive sleep '
                    'deprivation reported by the father). In the AAC opportunities of block 1: '
                    'selected "more" with minimal prompting (pointing to the tablet) in 4/5 '
                    'trials, and "help" with medium prompting (hand guidance) in 3/5 trials. '
                    'In the 2 SIB episodes recorded, both occurred at the beginning '
                    'of the transition (before the timer finished), both of low intensity '
                    '(duration less than 5 seconds). After the timer and visual warning, '
                    'there was no SIB in the subsequent transitions — suggesting that '
                    'anticipation is working as a prevention strategy.'
                ),
                'progress': (
                    'AAC – "more": 4/5 with minimal prompting (80%) — close to mastery '
                    'criterion for prompting reduction. '
                    'AAC – "help": 3/5 with medium prompting (60%) — in progress. '
                    'Spontaneous AAC: selection of "water" during snack without prompting (1 occurrence). '
                    'SIB: 2 episodes (both at the beginning of transitions) vs. average of 4-5 per '
                    'session in the last 3 weeks — ~55% reduction, attributed to consistent '
                    'implementation of the PBS protocol.'
                ),
                'next_steps': (
                    'Reduce prompting level for "more" (from pointing to the tablet to '
                    'expectant looking). Intensify "help" training maintaining current prompting. '
                    'Add icons "happy", "sad", and "in pain" to the AAC vocabulary. '
                    'Check with the father about implementation of the transition protocol at home '
                    '(assess adherence and barriers). Request from the father SIB frequency '
                    'data at home from the week before the next session.'
                ),
                'released_to_family': False,
            },
            # ── Enzo - session (13 days ago) ────────────────────────────────
            {
                'session_key': 'Enzo_completed',
                'session_index': 0,
                'objective': (
                    'Assess motor imitation repertoire, joint attention, and '
                    'communicative intent as prerequisites for language '
                    'development, and initiate parental guidance in NDBI strategies.'
                ),
                'activities': (
                    'Assessment and guidance session with full parental inclusion (mother '
                    'present throughout the session). '
                    'Part 1 – Imitation assessment (15 min): The therapist modeled 10 gross '
                    'motor actions (clapping, hitting table, raising arms, stomping feet) '
                    'and 5 fine motor actions (pincer grasp, stacking 2 cubes, turning spoon). '
                    'Part 2 – Joint attention assessment (15 min): Pointing + gaze following '
                    'activities with 8 trials each. '
                    'Part 3 – Spontaneous communication observation (10 min): Free '
                    'play with cause-and-effect and stacking toys. '
                    'Part 4 – Parental guidance (10 min): The therapist demonstrated the '
                    '5 basic NDBI strategies with the mother practicing each one with Enzo.'
                ),
                'behavior': (
                    'Enzo explored the toys actively and with pleasure. '
                    'Gross motor imitation: 6/10 actions imitated spontaneously '
                    '(clapping, hitting table, raising arms — the most dynamic and visually '
                    'salient). Fine motor imitation: 0/5 — absent in this assessment. '
                    "Following therapist's pointing: 3/8 trials with gaze toward the indicated "
                    'object (emergent responsive joint attention). '
                    'Communicative intent: pointing to desired toy on 4 '
                    "spontaneous occasions, touching the therapist's arm on 2 occasions "
                    '(intentional pre-verbal communication confirmed). '
                    'The mother practiced the NDBI strategies with engagement and asked '
                    'pertinent questions about how to apply them during diaper changes '
                    'and bath time.'
                ),
                'progress': (
                    'Initial assessment completed. Prerequisite profile: gross '
                    'motor imitation emerging (60%); fine motor imitation absent; '
                    'responsive joint attention emerging (38%); communicative '
                    'intentionality present (pointing and touching adult). '
                    'Parental guidance: mother demonstrated understanding of the 5 NDBI '
                    'strategies and practiced all during the session with therapist assistance. '
                    'Recent diagnosis still being processed by the family — mother showed '
                    'emotion at 1 moment while watching Enzo imitating clapping.'
                ),
                'next_steps': (
                    'Start formal fine motor imitation program (stacking, pointing, '
                    'fitting) as a prerequisite for language. Expand joint '
                    'attention with cause-and-effect games and mirror activities. '
                    'Introduce the first AAC icon ("more") in a highly preferred '
                    'activity context. Check in the next session how the mother '
                    'implemented the NDBI strategies in the home routine and adjust '
                    'guidance according to reported difficulties.'
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

        self.stdout.write(
            self.style.SUCCESS(
                f'\nData verification:\n'
                f'  Users: {user_count}\n'
                f'  Patients: {patient_count}\n'
                f'  Sessions: {session_count}\n'
                f'  Evolutions: {evolution_count}\n'
            )
        )
