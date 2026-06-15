import contextlib
from datetime import timedelta

import dj_database_url
import environ
from django.conf import settings
from django.core.management import call_command
from django.core.management.base import BaseCommand
from django.db import connections
from django.utils import timezone

from core.models import CustomUser, Patient, Session, Tenant, TherapeuticEvolution
from core.tenant_context import clear_tenant_db, set_tenant_db


class Command(BaseCommand):
    help = 'Populate databases with test data for multi-tenant development'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clinic',
            type=str,
            choices=['alpha', 'beta'],
            help='Seed only a specific clinic. Omit to seed all clinics.',
        )

    def _register_db(self, alias, db_url):
        parsed = dj_database_url.parse(db_url, conn_max_age=0)
        parsed.setdefault('ATOMIC_REQUESTS', False)
        parsed.setdefault('AUTOCOMMIT', True)
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
        settings.DATABASES[alias] = parsed
        connections.databases[alias] = parsed
        with contextlib.suppress(Exception):
            connections[alias].close()

    def _clear_tenant_data(self, alias):
        for table in ['core_therapeuticevolution', 'core_session', 'core_patient']:
            try:
                with connections[alias].cursor() as cursor:
                    cursor.execute(f'DELETE FROM {table}')
            except Exception:
                pass

    def _clear_central_data(self):
        for table in ['core_customuser', 'core_tenant']:
            try:
                with connections['default'].cursor() as cursor:
                    cursor.execute(f'DELETE FROM {table}')
            except Exception:
                pass

    def handle(self, *args, **options):
        env = environ.Env()
        alpha_db_url = env('ALPHA_DB_URL', default='sqlite:///alpha.sqlite3')
        beta_db_url = env('BETA_DB_URL', default='sqlite:///beta.sqlite3')
        clinic = options.get('clinic')

        aliases = []
        if not clinic or clinic == 'alpha':
            aliases.append(('alpha', alpha_db_url))
        if not clinic or clinic == 'beta':
            aliases.append(('beta', beta_db_url))

        for alias, db_url in aliases:
            self._register_db(alias, db_url)

        for alias, _ in aliases:
            call_command('migrate', database=alias, verbosity=0)
            self._clear_tenant_data(alias)

        self._clear_central_data()

        self.stdout.write('Seeding central database...')
        users = self.seed_central(alpha_db_url, beta_db_url)

        for alias, _ in aliases:
            set_tenant_db(alias)
            self.stdout.write(f'Seeding {alias.capitalize()} clinic...')
            if alias == 'alpha':
                self._seed_alpha(alias, users)
            elif alias == 'beta':
                self._seed_beta(alias, users)
            clear_tenant_db()

        self.verify_data(aliases)
        self.stdout.write(self.style.SUCCESS('\nSeed completed successfully!'))

    # ── CENTRAL ───────────────────────────────────────────────────────────────

    def seed_central(self, alpha_db_url, beta_db_url):
        alpha_tenant = Tenant.objects.using('default').create(
            name='Alpha Clinic',
            subdomain='alpha',
            db_url=alpha_db_url,
        )
        beta_tenant = Tenant.objects.using('default').create(
            name='Beta Clinic',
            subdomain='beta',
            db_url=beta_db_url,
        )

        users_data = [
            {
                'email': 'admin@alpha.com',
                'username': 'admin_alpha',
                'password': 'alpha',
                'first_name': 'Admin',
                'last_name': 'Alpha',
                'role': 'admin',
                'tenant': alpha_tenant,
            },
            {
                'email': 'ana@alpha.com',
                'username': 'ana',
                'password': 'alpha',
                'first_name': 'Ana',
                'last_name': 'Costa',
                'role': 'therapist',
                'tenant': alpha_tenant,
            },
            {
                'email': 'carlos@alpha.com',
                'username': 'carlos',
                'password': 'alpha',
                'first_name': 'Carlos',
                'last_name': 'Mendes',
                'role': 'therapist',
                'tenant': alpha_tenant,
            },
            {
                'email': 'maria@alpha.com',
                'username': 'maria_alpha',
                'password': 'alpha',
                'first_name': 'Maria',
                'last_name': 'Silva',
                'role': 'family',
                'tenant': alpha_tenant,
            },
            {
                'email': 'admin@beta.com',
                'username': 'admin_beta',
                'password': 'beta',
                'first_name': 'Admin',
                'last_name': 'Beta',
                'role': 'admin',
                'tenant': beta_tenant,
            },
            {
                'email': 'beatriz@beta.com',
                'username': 'beatriz',
                'password': 'beta',
                'first_name': 'Beatriz',
                'last_name': 'Fonseca',
                'role': 'therapist',
                'tenant': beta_tenant,
            },
            {
                'email': 'marcos@beta.com',
                'username': 'marcos',
                'password': 'beta',
                'first_name': 'Marcos',
                'last_name': 'Lima',
                'role': 'therapist',
                'tenant': beta_tenant,
            },
            {
                'email': 'lucia@beta.com',
                'username': 'lucia_beta',
                'password': 'beta',
                'first_name': 'Lucia',
                'last_name': 'Santos',
                'role': 'family',
                'tenant': beta_tenant,
            },
        ]

        users = {}
        for data in users_data:
            user = CustomUser(
                email=data['email'],
                username=data['username'],
                first_name=data['first_name'],
                last_name=data['last_name'],
                role=data['role'],
                tenant=data['tenant'],
                is_active=True,
            )
            user.set_password(data['password'])
            user.save(using='default')
            users[data['username']] = user
            self.stdout.write(f'  Created user: {data["email"]}')

        return users

    # ── ALPHA CLINIC ──────────────────────────────────────────────────────────

    def _seed_alpha(self, db, users):
        ana = users['ana']
        carlos = users['carlos']
        now = timezone.now()

        # ── Patients ──────────────────────────────────────────────────────────

        leonard = Patient.objects.using(db).create(
            name='Leonard Silva',
            birth_date='2017-03-10',
            guardian_name='Maria Silva',
            guardian_email='maria@alpha.com',
            notes=(
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
        )

        sophia = Patient.objects.using(db).create(
            name='Sophia Rodrigues',
            birth_date='2016-07-22',
            guardian_name='João Rodrigues',
            guardian_email='joao.rod@email.com',
            notes=(
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
        )

        peter = Patient.objects.using(db).create(
            name='Peter Alves',
            birth_date='2018-11-05',
            guardian_name='Fernanda Alves',
            guardian_email='fernanda@email.com',
            notes=(
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
        )

        claire = Patient.objects.using(db).create(
            name='Claire Mendes',
            birth_date='2015-04-18',
            guardian_name='Roberto Mendes',
            guardian_email='roberto@email.com',
            notes=(
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
        )

        gabriel = Patient.objects.using(db).create(
            name='Gabriel Ferreira',
            birth_date='2016-09-14',
            guardian_name='Luciana Ferreira',
            guardian_email='luciana.ferreira@email.com',
            notes=(
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
        )

        # ── Leonard Sessions & Evolutions ─────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now - timedelta(days=88),
            status='completed',
            notes=(
                '50-minute session focused on PECS Phase 2 - communicative persistence. '
                'Leonard practiced the protocol "wait while the communicator does not respond": '
                'held the image for up to 10 seconds before repeating. '
                '20 trials were conducted with 60% success. '
                'Reinforcement: access to tablet with cartoons for 3 minutes after each correct response.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=ana.id,
            objective='Teach communicative persistence via PECS Phase 2: Leonard holds the image until he gets a response from the communicator.',
            activities='Protocol "wait for response": therapist holds the image without delivering the item. Leonard waits up to 10 seconds. 20 trials, 12 correct (60%).',
            behavior='Leonard showed mild frustration in 4 trials (pushes image away). On correct trials, he delivered the image firmly. Maintained high motivation.',
            progress='Baseline: 0% persistence. Result: 60% — significant progress. Criterion: 80% to advance to next phase.',
            next_steps='Increase wait time to 15 seconds. Introduce 2 communicators.',
            released_to_family=True,
        )

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=75),
            status='completed',
            notes=(
                '50-minute session focused on verbal imitation of vowel sounds (/a/, /o/, /u/). '
                'Activities with sound games: whistle, tambourine, and soap bubbles. '
                'Leonard produced vowel sounds in 8 out of 15 opportunities (53%). '
                'Progress from baseline (2/15). Reinforcement: cereal snack.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=carlos.id,
            objective='Establish verbal imitation of vowels in a playful context.',
            activities='Sound games: whistle, tambourine, soap bubbles. 15 imitation opportunities after modeling.',
            behavior='Leonard produced /a/, /o/, /u/ in 8 out of 15 trials (53%). Associated sound with the action of blowing. No disruptive behaviors.',
            progress='Baseline: 2/15 (13%). Current session: 8/15 (53%). Increase of 40 percentage points.',
            next_steps='Continue with bilabial sounds (/p/, /b/, /m/). Use snack as reinforcer.',
            released_to_family=False,
        )

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now - timedelta(days=61),
            status='completed',
            notes=(
                '50-minute session dedicated to functional eye contact training. '
                'Protocol: look-take (mandatory to receive desired item). '
                'Leonard achieved 70% spontaneous eye contact (7/10 trials). '
                'Used storybook preference as motivational resource.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=ana.id,
            objective='Increase functional eye contact to 80% of requests.',
            activities='Protocol "look-take": item given only after eye contact >1s. 10 trials with storybook preference as motivator.',
            behavior='Leonard achieved 70% spontaneous eye contact (7/10). In the other 3, needed visual prompt (signal to "look").',
            progress='Baseline: 30%. Session: 70%. Very good progress.',
            next_steps='Reduce visual prompt. Reach 80% without help.',
            released_to_family=True,
        )

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=47),
            status='completed',
            notes=(
                '50-minute session focused on emotional self-regulation. '
                'Teaching the "stop-breathe-continue" strategy with visual support. '
                'Leonard had 3 tantrum episodes during transitions. '
                'Used the breathing card in 2 out of 3 opportunities. '
                'Reinforcement: extra time on tablet (5 min additional).'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=carlos.id,
            objective='Teach "stop-breathe-continue" strategy with visual support.',
            activities='Visual breathing card. 3 tantrum episodes during transitions. Strategy practice in each episode.',
            behavior='3 brief tantrums (30-60 sec). Used breathing card in 2/3 opportunities. Self-regulation improving.',
            progress='Before: 0 use of strategy. Now: 2/3 opportunities (67%).',
            next_steps='Practice strategy in natural environment (home, school).',
            released_to_family=False,
        )

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now - timedelta(days=33),
            status='completed',
            notes=(
                '50-minute session on social skills via parallel -> shared play. '
                'Activity: joint construction with blocks. Leonard agreed to share space '
                'with the therapist after visual negotiation. Maintained interaction for 12 continuous minutes. '
                'Use of social reinforcer: specific praise ("what great teamwork!").'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=ana.id,
            objective='Transition from parallel play to shared interaction.',
            activities='Joint construction with blocks. Visual negotiation of space. Alternating turns for 12 minutes.',
            behavior='Leonard agreed to share space. Maintained interaction for 12 continuous minutes. Initiated spontaneous eye contact to check therapist 4x.',
            progress='First session of shared interaction. Goal achieved!',
            next_steps='Introduce second patient in structured activity (dual session).',
            released_to_family=True,
        )

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=19),
            status='completed',
            notes=(
                '50-minute session on joint attention via cause-and-effect play. '
                'Activity: ball that rolls and falls into a bucket, with turn-taking. '
                'Leonard requested continuation of the game on 4 occasions (vocalization + gesture). '
                "Emergent joint attention indicator: followed therapist's gaze to object 3x."
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=carlos.id,
            objective='Develop joint attention via cause-and-effect play.',
            activities='Ball that rolls and falls into a bucket. Turn-taking. 4 opportunities to request continuation.',
            behavior="Leonard requested continuation 4x (vocalization + gesture). Followed therapist's gaze to object 3x — emergent joint attention!",
            progress='First clear evidence of joint attention. Important milestone!',
            next_steps='Generalize joint attention with other games and communication partners.',
            released_to_family=False,
        )

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now - timedelta(days=14),
            status='completed',
            notes=(
                '50-minute session focused on functional communication via PECS Phase 1. '
                'Leonard arrived agitated, possibly due to a route change reported by his mother. '
                'An 8-minute transition period with free-choice activity was necessary '
                'before starting the structured part. After regulation, he engaged well in the activities. '
                'Primary reinforcers used: raisins and apple juice. Secondary reinforcers: '
                'verbal praise and access to 2 minutes of music after each block of trials.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=ana.id,
            objective=(
                'Establish functional communicative exchange via PECS Phase 1: Leonard spontaneously '
                'hands the image of a desired item to the communicator to obtain it, without physical prompting.'
            ),
            activities=(
                'Discrete trial training (DTT) with 4 highly preferred items '
                '(raisins, red ball, soap bubbles, and music on tablet). '
                '30 trials distributed across 3 blocks of 10, with a 2-minute free activity break between blocks. '
                'Full physical prompting used in the first trials and gradually faded across blocks. '
                '5 generalization trials conducted with the assistant therapist as a new communication partner.'
            ),
            behavior=(
                'Leonard showed high motivation for the selected items. He demonstrated '
                'alternating gaze behavior between the item and the therapist in 6 trials. '
                'There were 2 brief episodes of distraction, being redirected with a gestural prompt. '
                'In generalization with the assistant therapist, he handed over the image in 3 out of 5 trials '
                'with minimal prompting (elbow touch).'
            ),
            progress=(
                'Baseline: 2 spontaneous requests per session. '
                'Result: 8 spontaneous requests without physical prompting. '
                'Mastery criterion: 80% independence in 3 consecutive sessions with 2 communicators. '
                'Current performance: 67% independence with primary communicator.'
            ),
            next_steps=(
                'Continue PECS Phase 1 until mastery criterion is reached. '
                'Gradually introduce new communication partners (mother, support teacher). '
                'Start planning PECS Phase 2. '
                'Guide mother to create 3 daily requesting opportunities via PECS at home.'
            ),
            released_to_family=True,
        )

        s = Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now - timedelta(days=7),
            status='completed',
            notes=(
                '50-minute session focused on verbal imitation and expansion of requests. '
                'Leonard showed good disposition since arrival. The token economy '
                '(5 tokens to earn access to 5 minutes of preferred activity) worked well to '
                'maintain time-on-task above 8 minutes per block.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=ana.id,
            objective=(
                'Expand repertoire of spontaneous requests via PECS to 5 distinct '
                'items and begin verbal imitation of vowel sounds in a playful context.'
            ),
            activities=(
                'Block 1 (20 min): PECS Phase 1 with 5 items (added: toy spaghetti and whistle). '
                '25 trials distributed across 2 blocks. '
                'Block 2 (20 min): Verbal imitation with sound games — soap bubbles, colored whistle, and percussion instrument. '
                'Block 3 (10 min): Token economy — exchange for 8 minutes of tablet with music.'
            ),
            behavior=(
                'Leonard started the session regulated and motivated. Remained on task for blocks of up to 12 minutes. '
                'Vocalized /a/ and /u/ spontaneously on 4 occasions during the whistle game. '
                'Had 1 brief tantrum episode (30 sec) when tablet access ended, resolved with verbal anticipation.'
            ),
            progress=(
                'PECS: 80% independence with primary communicator for 3 of the 5 items. '
                'New items still with minimal prompting (50% independence). '
                'Verbal imitation: 4 spontaneous vowel vocalizations — significant increase from baseline (0).'
            ),
            next_steps=(
                'Reach 80% independence on new items in PECS. Introduce mother as secondary communicator. '
                'Continue verbal imitation focusing on bilabial sounds (/p/, /b/, /m/). '
                'Introduce functional words "more" and "finished" associating spoken word with gesture.'
            ),
            released_to_family=False,
        )

        # Leonard scheduled
        Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now + timedelta(days=7),
            status='scheduled',
            notes='Follow-up for PECS Phase 2. Assess generalization of communicative persistence. Test with new communication partner.',
        )
        Session.objects.using(db).create(
            patient=leonard,
            therapist_id=carlos.id,
            date_time=now + timedelta(days=14),
            status='scheduled',
            notes='Family guidance session with mother present. Progress review. Alignment of home generalization strategies.',
        )

        # Leonard PENDING (completed, no evolution) — 2 pending for Ana
        Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now - timedelta(days=4),
            status='completed',
            notes='Brief maintenance session. PECS generalization with new communication partner. Token economy review.',
        )
        Session.objects.using(db).create(
            patient=leonard,
            therapist_id=ana.id,
            date_time=now - timedelta(days=2),
            status='completed',
            notes='Verbal imitation check-in. Introduced bilabial sounds /p/ and /b/. Mother present for last 10 minutes.',
        )

        # ── Sophia Sessions & Evolutions ──────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=sophia,
            therapist_id=ana.id,
            date_time=now - timedelta(days=10),
            status='completed',
            notes=(
                '50-minute session focused on social skills and anxiety management in '
                'situations of activity change. Sophia arrived anxious reporting a '
                'teacher substitution at school that morning. The first 15 minutes were dedicated '
                'to regulation strategies. After regulation, worked the planned role-play activity '
                'of social interaction with puppet support.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=ana.id,
            objective=(
                'Develop emotional regulation skills in the face of unexpected routine changes '
                'and train self-regulation strategies for independent use in the school context.'
            ),
            activities=(
                'Block 1 (15 min): Emergency emotional regulation — diaphragmatic breathing, '
                'emotions thermometer (scale 1-5), and structured conversation with emotional validation. '
                'Block 2 (25 min): Social interaction role-play with puppets — two scenarios '
                '(asking to join a game and dealing with a "no" from peers). '
                'Block 3 (10 min): Creation of a "pocket card" with 3 regulation strategies.'
            ),
            behavior=(
                'Sophia arrived visibly anxious (level 4/5 on thermometer). '
                'Responded well to regulation strategies, reaching level 2 at the end of block 1. '
                'In the role-play, demonstrated appropriate social initiations. '
                'At one point the peer puppet said "you can\'t come in" and Sophia froze for 8 seconds — '
                'typical freezing behavior in the face of rejection, worked on in situ.'
            ),
            progress=(
                'Emotional regulation: time to reach level 2 decreased from 25 to 15 minutes. '
                'Social skills: increased from 2 to 5 spontaneous initiations during role-play. '
                'Sophia spontaneously used the breathing strategy 1 time — independent functional use.'
            ),
            next_steps=(
                'Check pocket card usage at school with the mother. '
                'Work on social rejection scenes with increasing difficulty. '
                'Introduce the "social detective" exercise for identifying emotions in faces and voices.'
            ),
            released_to_family=False,
        )

        Session.objects.using(db).create(
            patient=sophia,
            therapist_id=ana.id,
            date_time=now + timedelta(days=5),
            status='scheduled',
            notes='Social skills module continuity: recognition of facial expressions. Introduce "social detective" exercise.',
        )

        # Sophia PENDING — 1 pending for Ana
        Session.objects.using(db).create(
            patient=sophia,
            therapist_id=ana.id,
            date_time=now - timedelta(days=3),
            status='completed',
            notes='Pocket card usage review. Social detective exercise introduction. Anxiety management check-in.',
        )

        # ── Peter Sessions & Evolutions ───────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=peter,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=12),
            status='completed',
            notes=(
                'Initial session for functional assessment and therapeutic bond establishment. '
                'Peter arrived accompanied by his mother and showed intense resistance to separation '
                'at the door, requiring 15 minutes of gradual transition. '
                'Clear tactile hypersensitivity observed upon contact with modeling clay and crepe paper. '
                'Tolerates smooth textures and firm surfaces well.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=carlos.id,
            objective=(
                "Conduct initial functional assessment of Peter's behavioral, communicative, "
                'and sensory repertoire, and establish therapeutic alliance with child and family.'
            ),
            activities=(
                'Assessment session in naturalistic free-play context. '
                'Materials: interlocking blocks, modeling clay, crepe paper, kinetic sand, cars, toy kitchen. '
                'Therapist observed: motor imitation, sensory responses, vocalizations, restricted behaviors, '
                'tolerance to unknown adult. Mother interviewed using VINELAND-3 script.'
            ),
            behavior=(
                'Peter explored materials systematically. Pulled hand away from modeling clay and crepe paper (expression of disgust). '
                'Tolerated interlocking blocks, cars, and kinetic sand well. '
                'Imitated 2 gestures spontaneously (clapping, hitting table). '
                "Communicated through pointing, touching therapist's arm, and affirmative/negative vocalizations."
            ),
            progress=(
                'Initial assessment completed. Preliminary profile: marked tactile hypersensitivity; '
                'gross motor imitation present; pre-verbal communication with clear communicative intentionality. '
                'VINELAND-3: significant delay in expressive communication and daily living skills.'
            ),
            next_steps=(
                'Develop Individualized Intervention Plan. Priorities: '
                '(1) sensory diet; (2) visual schedule; (3) PECS Phase 1. '
                'Refer for sensory integration assessment.'
            ),
            released_to_family=True,
        )

        Session.objects.using(db).create(
            patient=peter,
            therapist_id=carlos.id,
            date_time=now + timedelta(days=2),
            status='scheduled',
            notes='Start individualized sensory diet. Introduce first pictograms from visual schedule (arrival, activity 1, snack, goodbye).',
        )
        Session.objects.using(db).create(
            patient=peter,
            therapist_id=carlos.id,
            date_time=now + timedelta(days=9),
            status='scheduled',
            notes='Visual schedule review. PECS vocabulary expansion. Proprioceptive sensory diet activities.',
        )

        # Peter PENDING — 1 pending for Carlos
        Session.objects.using(db).create(
            patient=peter,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=2),
            status='completed',
            notes='Sensory diet introduction. Visual schedule first implementation. Kinetic sand tactile response assessment.',
        )

        # ── Claire Sessions & Evolutions ──────────────────────────────────────

        Session.objects.using(db).create(
            patient=claire,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=3),
            status='canceled',
            notes=(
                'Session canceled by the family with 2 hours notice. '
                'Claire had an epileptic seizure the previous night lasting 3 minutes. '
                'Neurologist advised rest for 24 hours and monitoring. Session rescheduled.'
            ),
        )

        s = Session.objects.using(db).create(
            patient=claire,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=1),
            status='completed',
            notes=(
                "45-minute session (reduced due to Claire's state — irritability and low frustration tolerance). "
                'Restructured to prioritize sensory regulation and basic AAC communication, '
                'suspending planned functional academic skills programs.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=carlos.id,
            objective=(
                'Promote sensory and emotional regulation after neurological intercurrence '
                'and maintain engagement with the AAC system in a low-demand context.'
            ),
            activities=(
                'Block 1 – Sensory regulation (23 min): weighted blanket (10 min), '
                'linear swing in hammock (8 min) with slow rhythm and low-volume instrumental music, '
                'kinetic sandbox exploration (5 min). '
                'Block 2 – AAC and communication (17 min): large piece fitting with structured '
                'requesting opportunities via tablet AAC. 10 requesting trials.'
            ),
            behavior=(
                'Claire arrived with closed expression and resisted eye contact. '
                'Progressively relaxed with weighted blanket. '
                'Vocalized /ah/ and /oh/ with pleasure on the swing. '
                'Selected "water" icon spontaneously and "more" icon in 4/10 trials with minimal prompting.'
            ),
            progress=(
                'Sensory regulation: reached regulation state in 23 minutes. '
                'AAC: 4 selections with minimal prompting + 1 spontaneous ("water") — best spontaneous performance to date. '
                'SIB: 0 episodes this session.'
            ),
            next_steps=(
                'Resume suspended programs next session if Claire is regulated from arrival. '
                'Discuss neurological impact with neurologist. '
                'Expand AAC: add "finished", "I don\'t want", "help" icons.'
            ),
            released_to_family=True,
        )

        # Claire PENDING — 2 pending for Carlos
        Session.objects.using(db).create(
            patient=claire,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=6),
            status='completed',
            notes='AAC expansion session. "Finished" and "help" icons introduced. Sensory diet review.',
        )
        Session.objects.using(db).create(
            patient=claire,
            therapist_id=carlos.id,
            date_time=now - timedelta(days=2),
            status='completed',
            notes='Functional skills session post-regulation. Good AAC engagement throughout. PBS transition protocol applied.',
        )

        # ── Gabriel Sessions & Evolutions ─────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=gabriel,
            therapist_id=ana.id,
            date_time=now - timedelta(days=11),
            status='completed',
            notes=(
                '50-minute session focused on pragmatic communication skills. '
                'Gabriel arrived excited and immediately started a monologue about dinosaurs, '
                'used as entry point to work on "checking the listener\'s interest". '
                'Role-plays conducted using the "speech bubble" as visual support.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=ana.id,
            objective=(
                'Develop conversational turn regulation: ask questions to interlocutor, '
                "check the other's interest, and modulate speaking time about topics of own interest."
            ),
            activities=(
                'Block 1 (10 min): Free conversation about dinosaurs — observational baseline: 8 min monologue, 0 questions. '
                'Block 2 (25 min): Explicit teaching of "conversational turn" with speech bubble visual support. '
                "Role-play of conversation about dinosaurs and therapist's topic (cooking), with role reversal. "
                'Block 3 (15 min): Naturalistic practice with speech bubble support.'
            ),
            behavior=(
                'Gabriel quickly understood the speech bubble proposal, comparing it to a "game rule". '
                'In block 2, asked 5 questions about cooking (non-preferred topic), 2 genuine and 3 protocol-driven. '
                'In block 3, passed the bubble in 4 out of 6 appropriate moments.'
            ),
            progress=(
                'Baseline: 0 spontaneous questions, 8 min monologue. '
                'Result: 4 spontaneous questions, maximum 2-minute monologue before passing the bubble. '
                'Recognition of conversational turn concept verbalized by Gabriel himself.'
            ),
            next_steps=(
                'Gradually remove speech bubble, replace with discreet gestural signal. '
                'Introduce "other\'s perspective" exercise with social stories. '
                'Ask mother to record home conversation situations.'
            ),
            released_to_family=False,
        )

        Session.objects.using(db).create(
            patient=gabriel,
            therapist_id=ana.id,
            date_time=now + timedelta(days=4),
            status='scheduled',
            notes='Conversational skills continuity. "Other\'s perspective" exercise with social stories. Gestural signal introduction.',
        )

        # Gabriel PENDING — 1 pending for Ana
        Session.objects.using(db).create(
            patient=gabriel,
            therapist_id=ana.id,
            date_time=now - timedelta(days=1),
            status='completed',
            notes='Social perspective-taking exercise. "Other\'s perspective" social stories introduction. Speech bubble fading.',
        )

    # ── BETA CLINIC ───────────────────────────────────────────────────────────

    def _seed_beta(self, db, users):
        beatriz = users['beatriz']
        marcos = users['marcos']
        now = timezone.now()

        # ── Patients ──────────────────────────────────────────────────────────

        isabella = Patient.objects.using(db).create(
            name='Isabella Santana',
            birth_date='2019-02-28',
            guardian_name='Camila Santana',
            guardian_email='camila.santana@email.com',
            notes=(
                'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Separation Anxiety Disorder '
                '(ICD-10: F93.0), identified in a psychological assessment in September 2023. '
                'Isabella is 6 years old and is not yet enrolled in school. Communicates with short phrases of 2 to 3 words '
                'and exhibits functional and non-functional echolalia. Separation anxiety is intense: she cries '
                'for up to 30 minutes at the start of each session when her mother walks away, which has been worked on '
                'with a gradual desensitization protocol over the last 2 months, with observable progress. '
                'Shows a strong interest in music and responds very well to activities mediated by songs. '
                'Exhibits ritualistic behaviors regarding the order of objects and the entry and exit routines of the therapy room. '
                'Her mother participates in all sessions and is in the process of training to manage separation anxiety at home.'
            ),
        )

        matthew = Patient.objects.using(db).create(
            name='Matthew Oliveira',
            birth_date='2014-06-03',
            guardian_name='Paulo Oliveira',
            guardian_email='paulo.oliveira@email.com',
            notes=(
                'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Obsessive-Compulsive Disorder '
                '(ICD-10: F42), assessed by a child psychiatrist in February 2023, with use of Fluoxetine '
                '10mg/day under supervision. Matthew is 11 years old and is in the 5th grade of elementary school, '
                'with support from a resource teacher. Has fluent verbal communication but shows marked cognitive rigidity '
                'and difficulty tolerating ambiguous situations. Compulsive behaviors include repetitive checking of '
                'school materials, a need for symmetry, and rituals when entering new spaces. '
                'Shows intense interest in chess and strategy games, used for cognitive flexibility training. '
                'The therapeutic plan integrates ABA techniques with adapted CBT, including ERP for compulsive rituals.'
            ),
        )

        laura = Patient.objects.using(db).create(
            name='Laura Pimentel',
            birth_date='2017-12-19',
            guardian_name='Renata Pimentel',
            guardian_email='renata.pimentel@email.com',
            notes=(
                'Diagnosis: ASD level 1 (ICD-10: F84.0), with comorbid Developmental Dyslexia '
                '(ICD-10: F81.0), identified in neuropsychological assessment in April 2024. Laura is '
                '7 years old and is in the 1st grade of elementary school. Exhibits developed verbal communication '
                'with good ability to narrate events and express emotions when regulated. '
                'School difficulties concentrated in phonemic decoding and reading fluency, causing frustration '
                "and school refusal behaviors (2-3 episodes per week per mother's report). "
                'Demonstrates above-average visual memory and LEGO construction ability. '
                'Therapeutic work integrates: emotional regulation for school frustration; '
                'visual compensation strategies for reading; school curricular adaptation interface.'
            ),
        )

        hector = Patient.objects.using(db).create(
            name='Hector Campos',
            birth_date='2018-04-07',
            guardian_name='Sandra Campos',
            guardian_email='sandra.campos@email.com',
            notes=(
                'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Central Auditory Processing Disorder '
                '(CAPD), confirmed by speech therapist in July 2023. Hector is 7 years old '
                'and attends 1st grade with educational interpreter support. '
                'Presents expressive language with functional vocabulary, but difficulty comprehending long instructions, '
                'especially in noisy environments. The school adapted the environment with sound-absorbing panels. '
                'Shows interest in vehicles and transport. Exhibits "freezing" behavior '
                'when receiving instructions he did not process, often misinterpreted as refusal. '
                'Team works with school and family on differentiating non-comprehension from refusal.'
            ),
        )

        valentina = Patient.objects.using(db).create(
            name='Valentina Cruz',
            birth_date='2015-08-30',
            guardian_name='André Cruz',
            guardian_email='andre.cruz@email.com',
            notes=(
                'Diagnosis: ASD level 3 (ICD-10: F84.0), with comorbid Moderate Intellectual Disability '
                '(ICD-10: F71) and Sleep Disorder (ICD-10: G47.0), in follow-up with pediatric neurologist. '
                'Valentina is 10 years old and is enrolled in full-time special school. '
                'Does not have functional verbal communication; uses AAC system with tablet (Tobii Snap Core First). '
                'Sleep disorder (maintenance insomnia, waking 3-4 times a night) directly impacts session performance. '
                'Exhibits low-intensity self-injurious behavior (hitting hand on head) during frustration and un-signaled transitions. '
                'Positive behavior plan (PBS) in effect with transition anticipation, environmental enrichment, and DRA strategies.'
            ),
        )

        enzo = Patient.objects.using(db).create(
            name='Enzo Barbosa',
            birth_date='2020-01-15',
            guardian_name='Tatiane Barbosa',
            guardian_email='lucia@beta.com',
            notes=(
                'Diagnosis: ASD level 2 (ICD-10: F84.0), with comorbid Global Developmental Delay '
                '(ICD-10: F89), recent diagnosis in March 2024. Enzo is 5 years old and is not yet in school. '
                'Does not use verbal communication; communicates through gestures, pointing, and intentional eye contact. '
                'Exhibits emerging motor imitation skills worked on as a gateway for language development. '
                'Shows pleasure in fitting, stacking, and exploring objects with different textures. '
                'Family received diagnosis recently and is still processing; mother reports feelings of guilt and burnout, '
                'referred for individual psychological support. '
                'Therapeutic plan prioritizes: language prerequisites; simplified AAC system; intensive parent training (NDBI).'
            ),
        )

        # ── Isabella Sessions & Evolutions ────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=isabella,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=9),
            status='completed',
            notes=(
                '50-minute session with ongoing maternal separation desensitization protocol (week 6). '
                'Mother remained in room for first 10 minutes, waited outside with door ajar for 15 minutes, '
                "then withdrew to waiting room. Isabella cried approximately 8 minutes after mother's definitive "
                'departure (reduction from 18 minutes previous week). Finished the session engaged and smiling.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=beatriz.id,
            objective=(
                'Advance in the maternal separation desensitization protocol (step 6): '
                'mother stays 10 min, waits 15 min outside, withdraws to waiting room for remaining time.'
            ),
            activities=(
                'Transition step (25 min): gradual reduced mother presence per protocol. '
                "Therapist used Isabella's preferred playlist (Toquinho, Palavra Cantada) as regulation anchor. "
                'Activities: fitting geometric shapes with background music, gesture imitation song game, '
                '"musical band" with small percussion instruments. '
                'Last 5 minutes: mother entered gently and Isabella greeted her with a hug.'
            ),
            behavior=(
                'Isabella showed anticipatory anxiety before the session. '
                "Cried 8 minutes after mother's definitive departure (previous: 18 min). "
                "Crying ceased autonomously without needing mother's return — important protocol milestone. "
                'After regulation, participated with high engagement and spontaneously vocalized song lyrics.'
            ),
            progress=(
                'Post-separation crying time reduced from 18 to 8 minutes (56% reduction). '
                "Autonomous regulation without mother's return achieved for the first time. "
                'Functional communication: 3 spontaneous requests during session.'
            ),
            next_steps=(
                'Advance to step 7: mother leaves immediately at session start. '
                'Maintain music as transition regulation strategy. '
                'Introduce visual board "mommy comes back when the clock gets here". '
                'Guide mother to keep goodbye brief and confident.'
            ),
            released_to_family=True,
        )

        Session.objects.using(db).create(
            patient=isabella,
            therapist_id=beatriz.id,
            date_time=now + timedelta(days=6),
            status='scheduled',
            notes='Step 7 of desensitization protocol: mother leaves immediately at session start. Music regulation protocol.',
        )

        # Isabella PENDING — 1 pending for Beatriz
        Session.objects.using(db).create(
            patient=isabella,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=3),
            status='completed',
            notes='Step 7 implementation. Mother left immediately at session start. Regulation time monitored.',
        )

        # ── Matthew Sessions & Evolutions ─────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=matthew,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=8),
            status='completed',
            notes=(
                '50-minute session integrating ABA and adapted CBT for managing compulsive behaviors. '
                'Matthew reported difficult week at school: spent 20 minutes checking backpack before entering classroom. '
                'Functional analysis of checking behavior conducted together with Matthew.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=beatriz.id,
            objective=(
                'Conduct functional analysis of the backpack checking behavior '
                'and introduce the compulsion delay technique as a first ERP strategy.'
            ),
            activities=(
                'Block 1 (20 min): Collaborative functional analysis — ABC diagram describing school episode. '
                'Matthew identified antecedent ("I don\'t know if I brought the planner") and consequence (temporary anxiety relief). '
                'Therapist introduced the "anxiety cycle" concept with a video game analogy. '
                'Block 2 (20 min): Delay technique introduction + ERP training, 3 simulated trials with 2-minute delay. '
                'Block 3 (10 min): Chess game, reinforcing flexibility and self-regulation.'
            ),
            behavior=(
                'Matthew actively engaged in functional analysis and showed good insight recognizing the anxiety cycle. '
                'ERP trials: managed 2-minute wait in 2/3 trials. In the third, "checked" at 90 seconds. '
                'Verbalized "it\'s harder than it seems in theory" — adequate self-awareness.'
            ),
            progress=(
                'First formal ERP session: 67% performance (2/3 trials) with 2-minute duration. '
                'Insight about anxiety cycle: present and verbalized by Matthew himself. '
                'Recording card: accepted and used without resistance.'
            ),
            next_steps=(
                'Review delay card usage during week. Increase delay time from 2 to 5 minutes. '
                'Work on desk symmetry ritual. Continue chess for uncertainty tolerance training.'
            ),
            released_to_family=False,
        )

        Session.objects.using(db).create(
            patient=matthew,
            therapist_id=beatriz.id,
            date_time=now + timedelta(days=7),
            status='scheduled',
            notes='Review compulsion delay card. ERP round increasing delay to 5 minutes. Chess cognitive flexibility training.',
        )

        # Matthew PENDING — 1 pending for Beatriz
        Session.objects.using(db).create(
            patient=matthew,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=2),
            status='completed',
            notes='ERP session 2. Delay time increased to 5 minutes. Desk symmetry ritual addressed. Chess training.',
        )

        # ── Laura Sessions & Evolutions ───────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=laura,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=6),
            status='completed',
            notes=(
                '50-minute session focused on emotional regulation and frustration tolerance '
                'associated with school difficulties. Laura arrived with angry expression, '
                'reporting she "got everything wrong" in reading activity in class.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=beatriz.id,
            objective=(
                'Work on emotional regulation in situations of school frustration '
                'and initiate pre-reading activity with high-structure visual support.'
            ),
            activities=(
                'Block 1 – Emotional regulation (25 min): Welcoming frustration with structured conversation. '
                'Emotions thermometer to grade anger (Laura marked 4/5). '
                'Free LEGO building (15 min) as positive regulator. '
                'Block 2 – Pre-reading with visual support (20 min): rhyming cards with images, '
                '"find the sound pair" activity without requiring conventional reading.'
            ),
            behavior=(
                'Laura entered with furrowed brows and crossed arms. '
                'With LEGO, visibly relaxed and initiated spontaneous, elaborate narrative about zoo animals. '
                'In the rhyming activity, got 8 out of 10 pairs correct with full visual support. '
                'On 1 card without an image (inserted intentionally), said "I don\'t know this one, there\'s no picture" — '
                'demonstrating awareness of her compensatory strategy.'
            ),
            progress=(
                'Emotional regulation: time to reach level 2 was 22 minutes (previous: 30 min — 27% reduction). '
                'Pre-reading: 80% accuracy with full visual support; 0% without support. '
                'Spontaneous narrative: 4 minutes of coherent creative narration — preserved resource.'
            ),
            next_steps=(
                'Introduce colored reading ruler and assess impact on decoding task. '
                'Create "book of things I do well" with Laura. '
                'Draft school guidance letter requesting adapted assessment and extended time.'
            ),
            released_to_family=False,
        )

        Session.objects.using(db).create(
            patient=laura,
            therapist_id=beatriz.id,
            date_time=now + timedelta(days=8),
            status='scheduled',
            notes='Reading ruler introduction. "Book of things I do well" continuation. School letter finalization.',
        )

        # Laura PENDING — 1 pending for Beatriz
        Session.objects.using(db).create(
            patient=laura,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=4),
            status='completed',
            notes='Reading ruler first use. OpenDyslexic font trialed. School guidance letter drafted with mother.',
        )

        # ── Hector Sessions & Evolutions ──────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=hector,
            therapist_id=marcos.id,
            date_time=now - timedelta(days=5),
            status='completed',
            notes=(
                '50-minute session focused on comprehension of instructions and visual support use. '
                'Hector was in good spirits and engaged easily with vehicle-themed activities. '
                '2-step instructions practiced with and without visual support under different noise conditions.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=marcos.id,
            objective=(
                'Assess dependence on visual support for comprehension of 2-step instructions '
                'under different noise conditions and introduce the agreed signal "I didn\'t understand".'
            ),
            activities=(
                'Block 1 (15 min): 2-step instruction WITH visual support, silent environment — 10 trials. '
                'Block 2 (15 min): 2-step instruction WITHOUT visual support, silent — 5 trials. '
                'Block 3 (10 min): 2-step instruction WITHOUT visual support, controlled background noise — 5 trials. '
                'Block 4 (10 min): Teaching "I didn\'t understand" signal with modeling and practice in 6 opportunities.'
            ),
            behavior=(
                'Hector engaged well in blocks 1 and 2 with vehicle-themed materials. '
                'In block 3, showed "freezing" behavior in 3/5 trials, looking at therapist up to 6 seconds. '
                'In block 4, learned the signal easily and used it spontaneously in the 5th opportunity.'
            ),
            progress=(
                'With visual support, silent: 7/10 correct (70%). '
                'Without support, silent: 2/5 (40%). Without support, with noise: 1/5 (20%) + 3 freezing episodes. '
                'Data confirm significant dependence on visual support, especially in noisy environment — consistent with CAPD. '
                '"I didn\'t understand" signal: 1 spontaneous use in 6 trials (17% — expected for first exposure).'
            ),
            next_steps=(
                'Generalize signal in small group context. '
                'Prepare school guidance material: differentiation between non-comprehension and refusal, '
                'agreed signal protocol, how teacher should respond (repeat with visual support, not just increase volume).'
            ),
            released_to_family=True,
        )

        Session.objects.using(db).create(
            patient=hector,
            therapist_id=marcos.id,
            date_time=now + timedelta(days=1),
            status='scheduled',
            notes='Small group generalization session (2 patients). "I didn\'t understand" signal practice in classroom-like context.',
        )

        # Hector PENDING — 2 pending for Marcos
        Session.objects.using(db).create(
            patient=hector,
            therapist_id=marcos.id,
            date_time=now - timedelta(days=3),
            status='completed',
            notes='Small group generalization. "I didn\'t understand" signal practice with peer. School material drafted.',
        )
        Session.objects.using(db).create(
            patient=hector,
            therapist_id=marcos.id,
            date_time=now - timedelta(days=1),
            status='completed',
            notes='School guidance material finalized. Family orientation on non-comprehension vs refusal differentiation.',
        )

        # ── Valentina Sessions & Evolutions ───────────────────────────────────

        s = Session.objects.using(db).create(
            patient=valentina,
            therapist_id=marcos.id,
            date_time=now - timedelta(days=4),
            status='completed',
            notes=(
                '45-minute session focused on AAC communication and SIB management during transitions. '
                'Valentina had 2 SIB episodes during transition from fitting activity to snack, '
                'both low intensity and under 10 seconds duration.'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=marcos.id,
            objective=(
                'Maintain and expand functional AAC use for expressing basic needs '
                'and apply PBS protocol for SIB reduction during transition moments.'
            ),
            activities=(
                'Block 1 – Regulation and AAC (20 min): Large piece fitting with 10 structured requesting opportunities. '
                'Tablet positioned 30 cm from dominant hand. '
                'Block 2 – Transitions with PBS (15 min): 3 planned transitions with 3-minute visual timer anticipation, '
                'verbal warning + pictogram, and immediate reinforcement of calm waiting. '
                'Block 3 – Functional snack (10 min): AAC requesting for snack items.'
            ),
            behavior=(
                'Valentina arrived in adequate disposition. '
                'AAC: selected "more" with minimal prompting in 4/5 trials, "help" with medium prompting in 3/5 trials. '
                '2 SIB episodes, both before timer finished, both low intensity (<5 seconds). '
                'After timer and visual warning, no SIB in subsequent transitions.'
            ),
            progress=(
                'AAC "more": 4/5 with minimal prompting (80%) — close to mastery criterion. '
                'AAC "help": 3/5 with medium prompting (60%) — in progress. '
                'SIB: 2 episodes vs. average of 4-5 per session — ~55% reduction.'
            ),
            next_steps=(
                'Reduce prompting for "more". Intensify "help" training. '
                'Add "happy", "sad", "in pain" icons to AAC vocabulary. '
                'Check transition protocol implementation at home with father.'
            ),
            released_to_family=False,
        )

        Session.objects.using(db).create(
            patient=valentina,
            therapist_id=marcos.id,
            date_time=now + timedelta(days=6),
            status='scheduled',
            notes='SIB frequency data review. AAC emotion vocabulary expansion. Sleep hygiene protocol check with father.',
        )

        # Valentina PENDING — 1 pending for Marcos
        Session.objects.using(db).create(
            patient=valentina,
            therapist_id=marcos.id,
            date_time=now - timedelta(days=2),
            status='completed',
            notes='AAC emotion vocabulary expansion. "Happy", "sad", "in pain" icons introduced. Sleep hygiene protocol review.',
        )

        # ── Enzo Sessions & Evolutions ────────────────────────────────────────

        s = Session.objects.using(db).create(
            patient=enzo,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=13),
            status='completed',
            notes=(
                'Initial session for assessment of language prerequisites and therapeutic bond establishment. '
                'Enzo accompanied by mother throughout (full parental inclusion protocol, first 4 weeks).'
            ),
        )
        TherapeuticEvolution.objects.using(db).create(
            session=s,
            created_by_id=beatriz.id,
            objective=(
                'Assess motor imitation repertoire, joint attention, and communicative intent '
                'as language development prerequisites, and initiate parental guidance in NDBI strategies.'
            ),
            activities=(
                'Assessment with full parental inclusion. '
                'Part 1 – Imitation (15 min): 10 gross motor and 5 fine motor actions modeled. '
                'Part 2 – Joint attention (15 min): pointing + gaze following, 8 trials each. '
                'Part 3 – Spontaneous communication (10 min): free play with cause-and-effect and stacking toys. '
                'Part 4 – Parental guidance (10 min): therapist demonstrated 5 NDBI strategies, mother practiced each with Enzo.'
            ),
            behavior=(
                'Enzo explored toys actively and with pleasure. '
                'Gross motor imitation: 6/10 actions spontaneously (clapping, hitting table, raising arms). '
                'Fine motor imitation: 0/5 — absent. '
                "Following therapist's pointing: 3/8 trials with gaze toward indicated object (emergent). "
                "Communicative intent: pointing to desired toy on 4 occasions, touching therapist's arm on 2 occasions. "
                'Mother practiced NDBI strategies with engagement and asked pertinent questions.'
            ),
            progress=(
                'Initial assessment completed. Profile: gross motor imitation emerging (60%); '
                'fine motor imitation absent; responsive joint attention emerging (38%); '
                'communicative intentionality present. '
                'Mother demonstrated understanding of 5 NDBI strategies.'
            ),
            next_steps=(
                'Start formal fine motor imitation program. Expand joint attention with cause-and-effect games. '
                'Introduce first AAC icon ("more") in highly preferred activity context. '
                'Check home NDBI implementation at next session.'
            ),
            released_to_family=True,
        )

        Session.objects.using(db).create(
            patient=enzo,
            therapist_id=beatriz.id,
            date_time=now + timedelta(days=3),
            status='scheduled',
            notes='Fine motor imitation and joint attention expansion. Mirror activities and cause-and-effect games. "More" AAC icon introduction.',
        )

        # Enzo PENDING — 1 pending for Beatriz
        Session.objects.using(db).create(
            patient=enzo,
            therapist_id=beatriz.id,
            date_time=now - timedelta(days=1),
            status='completed',
            notes='Fine motor imitation program start. "More" AAC icon introduced in preferred activity. NDBI home implementation review.',
        )

    # ── VERIFICATION ──────────────────────────────────────────────────────────

    def verify_data(self, aliases):
        lines = []
        lines.append('\nData verification:')

        users = CustomUser.all_objects.using('default').count()
        tenants = Tenant.objects.using('default').count()
        lines.append(f'  Central DB   — Users: {users}, Tenants: {tenants}')

        for alias, _ in aliases:
            patients = Patient.objects.using(alias).count()
            sessions = Session.objects.using(alias).count()
            evolutions = TherapeuticEvolution.objects.using(alias).count()
            completed_ids = set(
                Session.objects.using(alias).filter(status='completed').values_list('id', flat=True)
            )
            evolution_session_ids = set(
                TherapeuticEvolution.objects.using(alias).values_list('session_id', flat=True)
            )
            pending = len(completed_ids - evolution_session_ids)
            lines.append(
                f'  {alias.capitalize()} clinic — Patients: {patients}, Sessions: {sessions}, '
                f'Evolutions: {evolutions}, Pending: {pending}'
            )

        self.stdout.write(self.style.SUCCESS('\n'.join(lines)))
