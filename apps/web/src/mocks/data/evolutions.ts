export const mockEvolutions = [
  // Evolução sessão 1 - PECS Fase 2 (Leonard, Ana)
  {
    id: 1,
    session: 1,
    therapist_name: 'Ana Costa',
    author_name: 'Ana Costa',
    session_date: '2026-03-19T09:00:00Z',
    objective:
      'Teach communicative persistence via PECS Phase 2: Leonard holds the image until he gets a response from the communicator.',
    activities:
      'Protocol "wait for response": therapist holds the image without delivering the item. Leonard waits up to 10 seconds. 20 trials, 12 correct (60%).',
    behavior:
      'Leonard showed mild frustration in 4 trials (pushes image away). On correct trials, he delivered the image firmly. Maintained high motivation.',
    progress:
      'Baseline: 0% persistence. Result: 60% — significant progress. Criterion: 80% to advance to next phase.',
    next_steps: 'Increase wait time to 15 seconds. Introduce 2 communicators.',
    released_to_family: true,
    created_at: '2026-03-19T10:30:00Z',
    updated_at: '2026-03-19T10:30:00Z',
  },
  // Evolução sessão 2 - Imitação verbal (Leonard, Carlos)
  {
    id: 2,
    session: 2,
    therapist_name: 'Carlos Mendes',
    author_name: 'Carlos Mendes',
    session_date: '2026-04-01T09:00:00Z',
    objective: 'Establish verbal imitation of vowels in a playful context.',
    activities:
      'Sound games: whistle, tambourine, soap bubbles. 15 imitation opportunities after modeling.',
    behavior:
      'Leonard produced /a/, /o/, /u/ in 8 out of 15 trials (53%). Associated sound with the action of blowing. No disruptive behaviors.',
    progress:
      'Baseline: 2/15 (13%). Current session: 8/15 (53%). Increase of 40 percentage points.',
    next_steps: 'Continue with bilabial sounds (/p/, /b/, /m/). Use snack as reinforcer.',
    released_to_family: false,
    created_at: '2026-04-01T10:30:00Z',
    updated_at: '2026-04-01T10:30:00Z',
  },
  // Evolução sessão 3 - Contato visual (Leonard, Ana)
  {
    id: 3,
    session: 3,
    therapist_name: 'Ana Costa',
    author_name: 'Ana Costa',
    session_date: '2026-04-15T09:00:00Z',
    objective: 'Increase functional eye contact to 80% of requests.',
    activities:
      'Protocol "look-take": item given only after eye contact >1s. 10 trials with storybook preference as motivator.',
    behavior:
      'Leonard achieved 70% spontaneous eye contact (7/10). In the other 3, needed visual prompt (signal to "look").',
    progress: 'Baseline: 30%. Session: 70%. Very good progress.',
    next_steps: 'Reduce visual prompt. Reach 80% without help.',
    released_to_family: true,
    created_at: '2026-04-15T10:30:00Z',
    updated_at: '2026-04-15T10:30:00Z',
  },
  // Evolução sessão 4 - Regulação emocional (Leonard, Carlos)
  {
    id: 4,
    session: 4,
    therapist_name: 'Carlos Mendes',
    author_name: 'Carlos Mendes',
    session_date: '2026-04-29T09:00:00Z',
    objective: 'Teach "stop-breathe-continue" strategy with visual support.',
    activities:
      'Visual breathing card. 3 tantrum episodes during transitions. Strategy practice in each episode.',
    behavior:
      '3 brief tantrums (30-60 sec). Used breathing card in 2/3 opportunities. Self-regulation improving.',
    progress: 'Before: 0 use of strategy. Now: 2/3 opportunities (67%).',
    next_steps: 'Practice strategy in natural environment (home, school).',
    released_to_family: false,
    created_at: '2026-04-29T10:30:00Z',
    updated_at: '2026-04-29T10:30:00Z',
  },
  // Evolução sessão 5 - Habilidades sociais (Leonard, Ana)
  {
    id: 5,
    session: 5,
    therapist_name: 'Ana Costa',
    author_name: 'Ana Costa',
    session_date: '2026-05-13T09:00:00Z',
    objective: 'Transition from parallel play to shared interaction.',
    activities:
      'Joint construction with blocks. Visual negotiation of space. Alternating turns for 12 minutes.',
    behavior:
      'Leonard agreed to share space. Maintained interaction for 12 continuous minutes. Initiated spontaneous eye contact to check therapist 4x.',
    progress: 'First session of shared interaction. Goal achieved!',
    next_steps: 'Introduce second patient in structured activity (dual session).',
    released_to_family: true,
    created_at: '2026-05-13T10:30:00Z',
    updated_at: '2026-05-13T10:30:00Z',
  },
  // Evolução sessão 6 - Atenção compartilhada (Leonard, Carlos)
  {
    id: 6,
    session: 6,
    therapist_name: 'Carlos Mendes',
    author_name: 'Carlos Mendes',
    session_date: '2026-05-27T09:00:00Z',
    objective: 'Develop joint attention via cause-and-effect play.',
    activities:
      'Ball that rolls and falls into a bucket. Turn-taking. 4 opportunities to request continuation.',
    behavior:
      "Leonard requested continuation 4x (vocalization + gesture). Followed therapist's gaze to object 3x — emergent joint attention!",
    progress: 'First clear evidence of joint attention. Important milestone!',
    next_steps: 'Generalize joint attention with other games and communication partners.',
    released_to_family: false,
    created_at: '2026-05-27T10:30:00Z',
    updated_at: '2026-05-27T10:30:00Z',
  },
  // Evolução sessão 7 - PECS Fase 1 (Leonard, Ana)
  {
    id: 7,
    session: 7,
    therapist_name: 'Ana Costa',
    author_name: 'Ana Costa',
    session_date: '2026-06-01T09:00:00Z',
    objective:
      'Establish functional communicative exchange via PECS Phase 1: Leonard spontaneously hands the image of a desired item to the communicator to obtain it, without physical prompting.',
    activities:
      'Discrete trial training (DTT) with 4 highly preferred items (raisins, red ball, soap bubbles, and music on tablet). 30 trials distributed across 3 blocks of 10. Full physical prompting used in the first trials and gradually faded across blocks.',
    behavior:
      'Leonard showed high motivation for the selected items. He demonstrated alternating gaze behavior between the item and the therapist in 6 trials. There were 2 brief episodes of distraction, being redirected with a gestural prompt.',
    progress:
      'Baseline: 2 spontaneous requests per session. Result: 8 spontaneous requests without physical prompting. Current performance: 67% independence with primary communicator.',
    next_steps:
      'Continue PECS Phase 1 until mastery criterion is reached. Gradually introduce new communication partners (mother, support teacher). Start planning PECS Phase 2. Guide mother to create 3 daily requesting opportunities via PECS at home.',
    released_to_family: true,
    created_at: '2026-06-01T10:30:00Z',
    updated_at: '2026-06-01T10:30:00Z',
  },
  // Evolução sessão 8 - Imitação verbal e PECS (Leonard, Ana)
  {
    id: 8,
    session: 8,
    therapist_name: 'Ana Costa',
    author_name: 'Ana Costa',
    session_date: '2026-06-08T09:00:00Z',
    objective:
      'Expand repertoire of spontaneous requests via PECS to 5 distinct items and begin verbal imitation of vowel sounds in a playful context.',
    activities:
      'Block 1 (20 min): PECS Phase 1 with 5 items (added: toy spaghetti and whistle). 25 trials. Block 2 (20 min): Verbal imitation with sound games. Block 3 (10 min): Token economy.',
    behavior:
      'Leonard started the session regulated and motivated. Remained on task for blocks of up to 12 minutes. Vocalized /a/ and /u/ spontaneously on 4 occasions during the whistle game. Had 1 brief tantrum episode (30 sec) when tablet access ended.',
    progress:
      'PECS: 80% independence with primary communicator for 3 of the 5 items. Verbal imitation: 4 spontaneous vowel vocalizations — significant increase from baseline (0).',
    next_steps:
      'Reach 80% independence on new items in PECS. Introduce mother as secondary communicator. Continue verbal imitation focusing on bilabial sounds (/p/, /b/, /m/).',
    released_to_family: false,
    created_at: '2026-06-08T10:30:00Z',
    updated_at: '2026-06-08T10:30:00Z',
  },
  // Evolução sessão 13 - Ansiedade e habilidades sociais (Sophia, Ana)
  {
    id: 9,
    session: 13,
    therapist_name: 'Ana Costa',
    author_name: 'Ana Costa',
    session_date: '2026-06-05T09:00:00Z',
    objective:
      'Develop emotional regulation skills in the face of unexpected routine changes and train self-regulation strategies for independent use in the school context.',
    activities:
      'Block 1 (15 min): Emergency emotional regulation — diaphragmatic breathing, emotions thermometer (scale 1-5), and structured conversation with emotional validation. Block 2 (25 min): Social interaction role-play with puppets. Block 3 (10 min): Creation of a "pocket card" with 3 regulation strategies.',
    behavior:
      'Sophia arrived visibly anxious (level 4/5 on thermometer). Responded well to regulation strategies, reaching level 2 at the end of block 1. In the role-play, demonstrated appropriate social initiations. Froze for 8 seconds during peer rejection scenario.',
    progress:
      'Emotional regulation: time to reach level 2 decreased from 25 to 15 minutes. Social skills: increased from 2 to 5 spontaneous initiations during role-play. Sophia spontaneously used the breathing strategy 1 time.',
    next_steps:
      'Check pocket card usage at school with the mother. Work on social rejection scenes with increasing difficulty. Introduce the "social detective" exercise for identifying emotions in faces and voices.',
    released_to_family: false,
    created_at: '2026-06-05T10:30:00Z',
    updated_at: '2026-06-05T10:30:00Z',
  },
  // Evolução sessão 16 - Avaliação inicial (Peter, Carlos)
  {
    id: 10,
    session: 16,
    therapist_name: 'Carlos Mendes',
    author_name: 'Carlos Mendes',
    session_date: '2026-06-03T09:00:00Z',
    objective:
      "Conduct initial functional assessment of Peter's behavioral, communicative, and sensory repertoire, and establish therapeutic alliance with child and family.",
    activities:
      'Assessment session in naturalistic free-play context. Materials: interlocking blocks, modeling clay, crepe paper, kinetic sand, cars, toy kitchen. Mother interviewed using VINELAND-3 script.',
    behavior:
      'Peter explored materials systematically. Pulled hand away from modeling clay and crepe paper (expression of disgust). Tolerated interlocking blocks, cars, and kinetic sand well. Imitated 2 gestures spontaneously. Communicated through pointing and vocalizations.',
    progress:
      'Initial assessment completed. Preliminary profile: marked tactile hypersensitivity; gross motor imitation present; pre-verbal communication with clear communicative intentionality. VINELAND-3: significant delay in expressive communication and daily living skills.',
    next_steps:
      'Develop Individualized Intervention Plan. Priorities: (1) sensory diet; (2) visual schedule; (3) PECS Phase 1. Refer for sensory integration assessment.',
    released_to_family: true,
    created_at: '2026-06-03T10:30:00Z',
    updated_at: '2026-06-03T10:30:00Z',
  },
  // Evolução sessão 21 - Regulação sensorial (Claire, Carlos)
  {
    id: 11,
    session: 21,
    therapist_name: 'Carlos Mendes',
    author_name: 'Carlos Mendes',
    session_date: '2026-06-14T09:00:00Z',
    objective:
      'Promote sensory and emotional regulation after neurological intercurrence and maintain engagement with the AAC system in a low-demand context.',
    activities:
      'Block 1 – Sensory regulation (23 min): weighted blanket (10 min), linear swing in hammock (8 min) with slow rhythm and low-volume instrumental music, kinetic sandbox exploration (5 min). Block 2 – AAC and communication (17 min): large piece fitting with structured requesting opportunities via tablet AAC.',
    behavior:
      'Claire arrived with closed expression and resisted eye contact. Progressively relaxed with weighted blanket. Vocalized /ah/ and /oh/ with pleasure on the swing. Selected "water" icon spontaneously and "more" icon in 4/10 trials with minimal prompting.',
    progress:
      'Sensory regulation: reached regulation state in 23 minutes. AAC: 4 selections with minimal prompting + 1 spontaneous ("water") — best spontaneous performance to date. SIB: 0 episodes this session.',
    next_steps:
      'Resume suspended programs next session if Claire is regulated from arrival. Discuss neurological impact with neurologist. Expand AAC: add "finished", "I don\'t want", "help" icons.',
    released_to_family: true,
    created_at: '2026-06-14T10:30:00Z',
    updated_at: '2026-06-14T10:30:00Z',
  },
  // Evolução sessão 24 - Comunicação pragmática (Gabriel, Ana)
  {
    id: 12,
    session: 24,
    therapist_name: 'Ana Costa',
    author_name: 'Ana Costa',
    session_date: '2026-06-04T09:00:00Z',
    objective:
      "Develop conversational turn regulation: ask questions to interlocutor, check the other's interest, and modulate speaking time about topics of own interest.",
    activities:
      'Block 1 (10 min): Free conversation about dinosaurs — observational baseline: 8 min monologue, 0 questions. Block 2 (25 min): Explicit teaching of "conversational turn" with speech bubble visual support. Block 3 (15 min): Naturalistic practice with speech bubble support.',
    behavior:
      'Gabriel quickly understood the speech bubble proposal, comparing it to a "game rule". In block 2, asked 5 questions about cooking (non-preferred topic), 2 genuine and 3 protocol-driven. In block 3, passed the bubble in 4 out of 6 appropriate moments.',
    progress:
      'Baseline: 0 spontaneous questions, 8 min monologue. Result: 4 spontaneous questions, maximum 2-minute monologue before passing the bubble. Recognition of conversational turn concept verbalized by Gabriel himself.',
    next_steps:
      'Gradually remove speech bubble, replace with discreet gestural signal. Introduce "other\'s perspective" exercise with social stories. Ask mother to record home conversation situations.',
    released_to_family: false,
    created_at: '2026-06-04T10:30:00Z',
    updated_at: '2026-06-04T10:30:00Z',
  },
]
