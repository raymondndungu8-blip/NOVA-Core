/**
 * NOVA Core — Master Workout Database
 * 60+ exercises with full variation taxonomy.
 * Professional categorization: Muscle Group × Difficulty × Equipment
 */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced' | 'elite';
export type Category = 'strength' | 'cardio' | 'core' | 'flexibility' | 'yoga' | 'hiit' | 'plyometric' | 'mobility';
export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'legs' | 'glutes' | 'core' | 'full_body' | 'calves' | 'forearms';
export type Equipment = 'none' | 'bar' | 'dumbbells' | 'rings' | 'band' | 'bench' | 'parallettes' | 'kettlebell';

export interface ExerciseVariation {
  id: string;
  name: string;
  focusNote: string; // what this variation emphasizes
}

export interface Exercise {
  id: string;
  name: string;
  category: Category;
  difficulty: Difficulty;
  muscles: string[];             // primary muscles
  secondaryMuscles: string[];    // secondary / stabilizers
  muscleGroup: MuscleGroup;      // primary group for heatmap
  equipment: Equipment[];
  instructions: string[];
  commonMistakes: { mistake: string; fix: string }[];
  variations: ExerciseVariation[];
  // progression chain: what to do next after mastering this
  progressionTo?: string;        // exercise ID that is harder
  regressionFrom?: string;       // exercise ID that is easier
  caloriesPerMin?: number;       // approx kcal/min at moderate intensity
  mets?: number;                 // metabolic equivalent for calorie math
}

// ─────────────────────────────────────────────────────────────
// PUSH EXERCISES — Chest / Shoulders / Triceps
// ─────────────────────────────────────────────────────────────

const pushExercises: Exercise[] = [
  {
    id: 'push-up',
    name: 'Push-Up',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    secondaryMuscles: ['Core', 'Serratus Anterior'],
    muscleGroup: 'chest',
    equipment: ['none'],
    instructions: [
      'Hands slightly wider than shoulder-width, body in straight line.',
      'Lower chest toward floor, elbows at 45° (not flared).',
      'Press up to full extension; keep core braced throughout.',
    ],
    commonMistakes: [
      { mistake: 'Sagging hips', fix: 'Engage core and glutes' },
      { mistake: 'Flared elbows', fix: 'Keep elbows at 45° to torso' },
    ],
    variations: [
      { id: 'push-up-wide', name: 'Wide-Grip Push-Up', focusNote: 'Greater chest stretch' },
      { id: 'push-up-close', name: 'Close-Grip Push-Up', focusNote: 'More tricep emphasis' },
      { id: 'push-up-incline', name: 'Incline Push-Up', focusNote: 'Easier — great for beginners' },
      { id: 'push-up-decline', name: 'Decline Push-Up', focusNote: 'Upper chest emphasis' },
      { id: 'push-up-diamond', name: 'Diamond Push-Up', focusNote: 'Max tricep isolation' },
      { id: 'push-up-explosive', name: 'Explosive Push-Up', focusNote: 'Power and fast-twitch fibers' },
      { id: 'push-up-archer', name: 'Archer Push-Up', focusNote: 'Unilateral strength, chest stretch' },
      { id: 'push-up-pseudo-planche', name: 'Pseudo-Planche Push-Up', focusNote: 'Wrist, shoulder, and core strength' },
      { id: 'push-up-pike', name: 'Pike Push-Up', focusNote: 'Shoulder overhead strength' },
      { id: 'push-up-typewriter', name: 'Typewriter Push-Up', focusNote: 'Lateral stability and chest' },
    ],
    progressionTo: 'diamond-push-up',
    caloriesPerMin: 7,
    mets: 8,
  },
  {
    id: 'dips',
    name: 'Tricep Dips',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Triceps', 'Chest', 'Shoulders'],
    secondaryMuscles: ['Core'],
    muscleGroup: 'triceps',
    equipment: ['parallettes', 'bench'],
    instructions: [
      'Support on parallel bars; shoulders down and back.',
      'Lower body until upper arms are parallel to floor.',
      'Press back up to full lockout.',
    ],
    commonMistakes: [
      { mistake: 'Flaring elbows wide', fix: 'Keep elbows tracking back, not out' },
      { mistake: 'Shrugging shoulders', fix: 'Depress shoulders throughout' },
    ],
    variations: [
      { id: 'dip-bench', name: 'Bench Dip', focusNote: 'Beginner — bodyweight tricep isolation' },
      { id: 'dip-rings', name: 'Ring Dip', focusNote: 'Stability and full chest recruitment' },
      { id: 'dip-weighted', name: 'Weighted Dip', focusNote: 'Progressive overload for advanced' },
      { id: 'dip-korean', name: 'Korean Dip', focusNote: 'Shoulder mobility and posterior strength' },
    ],
    regressionFrom: 'push-up',
    progressionTo: 'ring-muscle-up',
    caloriesPerMin: 8,
    mets: 9,
  },
];

// ─────────────────────────────────────────────────────────────
// PULL EXERCISES — Back / Biceps
// ─────────────────────────────────────────────────────────────

const pullExercises: Exercise[] = [
  {
    id: 'pull-up',
    name: 'Pull-Up',
    category: 'strength',
    difficulty: 'intermediate',
    muscles: ['Latissimus Dorsi', 'Biceps', 'Rear Deltoid'],
    secondaryMuscles: ['Rhomboids', 'Core', 'Forearms'],
    muscleGroup: 'back',
    equipment: ['bar'],
    instructions: [
      'Hang with overhand grip, slightly wider than shoulders.',
      'Engage lats and pull chest to bar, elbows driving down.',
      'Lower to full dead hang in a controlled manner.',
    ],
    commonMistakes: [
      { mistake: 'Kipping / using momentum', fix: 'Dead stop at bottom for full ROM' },
      { mistake: 'Chin only reaching bar', fix: 'Pull until chest touches bar' },
    ],
    variations: [
      { id: 'chin-up', name: 'Chin-Up', focusNote: 'Supinated grip — more bicep' },
      { id: 'neutral-grip-pull-up', name: 'Neutral-Grip Pull-Up', focusNote: 'Easier; shoulder-friendly' },
      { id: 'wide-grip-pull-up', name: 'Wide-Grip Pull-Up', focusNote: 'Maximum lat width' },
      { id: 'archer-pull-up', name: 'Archer Pull-Up', focusNote: 'Unilateral — path to one-arm' },
      { id: 'behind-neck-pull-up', name: 'Behind-Neck Pull-Up', focusNote: 'Upper back width; caution: neck mobility required' },
      { id: 'commando-pull-up', name: 'Commando Pull-Up', focusNote: 'Rotational core + lat combo' },
      { id: 'typewriter-pull-up', name: 'Typewriter Pull-Up', focusNote: 'Lateral lat engagement' },
      { id: 'one-arm-pull-up', name: 'One-Arm Pull-Up', focusNote: 'Elite — max unilateral pulling strength' },
      { id: 'explosive-pull-up', name: 'Explosive Pull-Up', focusNote: 'Power and fast-twitch recruitment' },
    ],
    regressionFrom: 'inverted-row',
    progressionTo: 'one-arm-pull-up',
    caloriesPerMin: 8,
    mets: 9,
  },
  {
    id: 'inverted-row',
    name: 'Inverted Row',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Upper Back', 'Biceps', 'Rear Deltoid'],
    secondaryMuscles: ['Core', 'Forearms'],
    muscleGroup: 'back',
    equipment: ['bar'],
    instructions: [
      'Hang under a bar with overhand grip, body straight at an angle.',
      'Pull chest to bar, elbows driving back.',
      'Lower in a controlled manner.',
    ],
    commonMistakes: [
      { mistake: 'Sagging hips', fix: 'Keep body in a straight plank' },
    ],
    variations: [
      { id: 'inverted-row-wide', name: 'Wide-Grip Inverted Row', focusNote: 'Outer back width' },
      { id: 'inverted-row-supine', name: 'Underhand Inverted Row', focusNote: 'More bicep; easier' },
      { id: 'inverted-row-rings', name: 'Ring Row', focusNote: 'Instability increases difficulty' },
    ],
    progressionTo: 'pull-up',
    caloriesPerMin: 5,
    mets: 6,
  },
];

// ─────────────────────────────────────────────────────────────
// LEG EXERCISES — Quads / Hamstrings / Glutes / Calves
// ─────────────────────────────────────────────────────────────

const legExercises: Exercise[] = [
  {
    id: 'squat',
    name: 'Bodyweight Squat',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Core', 'Calves', 'Hip Flexors'],
    muscleGroup: 'legs',
    equipment: ['none'],
    instructions: [
      'Stand with feet shoulder-width apart, toes slightly out.',
      'Lower hips back and down, keeping chest up and knees over toes.',
      'Descend until thighs are parallel or below, then drive through heels.',
    ],
    commonMistakes: [
      { mistake: 'Rounding back', fix: 'Keep chest up and braced' },
      { mistake: 'Knees caving in', fix: 'Push knees out in line with toes' },
    ],
    variations: [
      { id: 'squat-sumo', name: 'Sumo Squat', focusNote: 'Wide stance — inner thigh emphasis' },
      { id: 'squat-jump', name: 'Jump Squat', focusNote: 'Plyometric power' },
      { id: 'squat-pause', name: 'Pause Squat', focusNote: 'Eliminates stretch reflex; harder' },
      { id: 'squat-single-leg', name: 'Pistol Squat', focusNote: 'Elite unilateral strength & balance' },
      { id: 'squat-cossack', name: 'Cossack Squat', focusNote: 'Lateral mobility and adductor stretch' },
      { id: 'squat-nordic', name: 'Shrimp Squat', focusNote: 'Quad strength toward pistol squat' },
      { id: 'squat-split', name: 'Bulgarian Split Squat', focusNote: 'Unilateral leg strength' },
    ],
    progressionTo: 'pistol-squat',
    caloriesPerMin: 6,
    mets: 7,
  },
  {
    id: 'lunge',
    name: 'Lunge',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Calves', 'Core'],
    muscleGroup: 'legs',
    equipment: ['none'],
    instructions: [
      'Step forward, lower until both knees are at 90°.',
      'Front knee stays over ankle; back knee hovers above floor.',
      'Drive through front heel to return to start.',
    ],
    commonMistakes: [
      { mistake: 'Front knee past toes', fix: 'Take a longer stride' },
      { mistake: 'Torso leaning forward', fix: 'Keep torso tall and upright' },
    ],
    variations: [
      { id: 'lunge-reverse', name: 'Reverse Lunge', focusNote: 'Easier on knees; more glute' },
      { id: 'lunge-lateral', name: 'Lateral Lunge', focusNote: 'Adductor and abductor' },
      { id: 'lunge-walking', name: 'Walking Lunge', focusNote: 'Dynamic balance and coordination' },
      { id: 'lunge-curtsy', name: 'Curtsy Lunge', focusNote: 'Glute medius emphasis' },
      { id: 'lunge-jump', name: 'Jump Lunge', focusNote: 'Plyometric power and cardio' },
    ],
    caloriesPerMin: 5,
    mets: 6,
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'strength',
    difficulty: 'beginner',
    muscles: ['Glutes', 'Hamstrings'],
    secondaryMuscles: ['Lower Back', 'Core'],
    muscleGroup: 'glutes',
    equipment: ['none'],
    instructions: [
      'Lie on back, knees bent, feet flat on floor.',
      'Drive hips up to full extension, squeezing glutes at top.',
      'Lower in a controlled manner.',
    ],
    commonMistakes: [
      { mistake: 'Not fully extending hips', fix: 'Drive hips high; squeeze hard at top' },
    ],
    variations: [
      { id: 'hip-thrust', name: 'Hip Thrust', focusNote: 'Upper back on bench — full ROM' },
      { id: 'single-leg-bridge', name: 'Single-Leg Glute Bridge', focusNote: 'Unilateral; corrects imbalances' },
      { id: 'nordic-curl', name: 'Nordic Curl', focusNote: 'Elite hamstring eccentric strength' },
    ],
    progressionTo: 'hip-thrust',
    caloriesPerMin: 4,
    mets: 4,
  },
];

// ─────────────────────────────────────────────────────────────
// CORE EXERCISES
// ─────────────────────────────────────────────────────────────

const coreExercises: Exercise[] = [
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    difficulty: 'beginner',
    muscles: ['Abdominals', 'Obliques', 'Transverse Abdominis'],
    secondaryMuscles: ['Lower Back', 'Shoulders', 'Glutes'],
    muscleGroup: 'core',
    equipment: ['none'],
    instructions: [
      'Forearms on floor, elbows directly under shoulders.',
      'Body forms a straight line from head to heels.',
      'Hold without letting hips sag or pike.',
    ],
    commonMistakes: [
      { mistake: 'Arching lower back', fix: 'Tuck pelvis and engage deep core' },
      { mistake: 'Holding breath', fix: 'Breathe evenly throughout' },
    ],
    variations: [
      { id: 'plank-high', name: 'High Plank', focusNote: 'Arms extended — more shoulder work' },
      { id: 'plank-side', name: 'Side Plank', focusNote: 'Oblique emphasis' },
      { id: 'plank-rko', name: 'RKC Plank', focusNote: 'Max tension technique' },
      { id: 'plank-shoulder-tap', name: 'Plank Shoulder Tap', focusNote: 'Anti-rotation core challenge' },
      { id: 'plank-one-arm', name: 'One-Arm Plank', focusNote: 'Advanced unilateral stability' },
      { id: 'dragon-flag', name: 'Dragon Flag', focusNote: 'Elite — full posterior chain & core' },
    ],
    progressionTo: 'hollow-hold',
    caloriesPerMin: 4,
    mets: 4,
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Body Hold',
    category: 'core',
    difficulty: 'intermediate',
    muscles: ['Abdominals', 'Hip Flexors', 'Transverse Abdominis'],
    secondaryMuscles: ['Lower Back', 'Legs'],
    muscleGroup: 'core',
    equipment: ['none'],
    instructions: [
      'Lie on back; press lower back into floor.',
      'Extend arms overhead and legs straight, hovering both off floor.',
      'Hold the "banana" shape with core braced.',
    ],
    commonMistakes: [
      { mistake: 'Lower back arching off floor', fix: 'Raise legs higher or bend knees' },
    ],
    variations: [
      { id: 'hollow-rock', name: 'Hollow Rock', focusNote: 'Dynamic — builds gymnastics core' },
      { id: 'l-sit', name: 'L-Sit', focusNote: 'Compressed hollow — hip flexor + core elite' },
    ],
    regressionFrom: 'plank',
    progressionTo: 'dragon-flag',
    caloriesPerMin: 5,
    mets: 5,
  },
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'core',
    difficulty: 'beginner',
    muscles: ['Rectus Abdominis'],
    secondaryMuscles: ['Obliques', 'Hip Flexors'],
    muscleGroup: 'core',
    equipment: ['none'],
    instructions: [
      'Lie on back, knees bent, hands behind head.',
      'Curl shoulders toward knees; only upper back lifts.',
      'Lower with control; do not jerk neck.',
    ],
    commonMistakes: [
      { mistake: 'Pulling on neck', fix: 'Hands lightly support — do not yank' },
    ],
    variations: [
      { id: 'bicycle-crunch', name: 'Bicycle Crunch', focusNote: 'Rotational — oblique power' },
      { id: 'reverse-crunch', name: 'Reverse Crunch', focusNote: 'Lower abs emphasis' },
      { id: 'v-up', name: 'V-Up', focusNote: 'Full rectus contraction' },
      { id: 'toes-to-bar', name: 'Toes-to-Bar', focusNote: 'Elite hanging core; grip + flexion' },
    ],
    caloriesPerMin: 4,
    mets: 4,
  },
  {
    id: 'bird-dog',
    name: 'Bird Dog',
    category: 'core',
    difficulty: 'beginner',
    muscles: ['Core', 'Lower Back', 'Glutes'],
    secondaryMuscles: ['Shoulders', 'Hips'],
    muscleGroup: 'core',
    equipment: ['none'],
    instructions: [
      'On hands and knees, neutral spine.',
      'Extend opposite arm and leg simultaneously.',
      'Hold briefly, return, then alternate sides.',
    ],
    commonMistakes: [
      { mistake: 'Sagging or arching spine', fix: 'Keep spine neutral throughout' },
    ],
    variations: [
      { id: 'bird-dog-crunch', name: 'Bird Dog Crunch', focusNote: 'Added crunch for more ab work' },
    ],
    caloriesPerMin: 3,
    mets: 3,
  },
];

// ─────────────────────────────────────────────────────────────
// CARDIO & HIIT
// ─────────────────────────────────────────────────────────────

const cardioExercises: Exercise[] = [
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'hiit',
    difficulty: 'intermediate',
    muscles: ['Full Body'],
    secondaryMuscles: ['Core', 'Legs', 'Chest', 'Shoulders'],
    muscleGroup: 'full_body',
    equipment: ['none'],
    instructions: [
      'From standing, squat and place hands on floor.',
      'Jump feet back to push-up position; complete a push-up.',
      'Jump feet to hands, then explode upward with arms overhead.',
    ],
    commonMistakes: [
      { mistake: 'Skipping the push-up', fix: 'Full chest to floor for maximum benefit' },
    ],
    variations: [
      { id: 'burpee-no-pushup', name: 'Burpee (No Push-Up)', focusNote: 'Cardio focus; beginner-friendly' },
      { id: 'burpee-box-jump', name: 'Box Jump Burpee', focusNote: 'Explosive plyometric version' },
      { id: 'devil-press', name: 'Devil Press', focusNote: 'Dumbbell burpee — max calorie burn' },
    ],
    caloriesPerMin: 13,
    mets: 14,
  },
  {
    id: 'jumping-jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    difficulty: 'beginner',
    muscles: ['Full Body', 'Cardiovascular System'],
    secondaryMuscles: ['Calves', 'Shoulders'],
    muscleGroup: 'full_body',
    equipment: ['none'],
    instructions: [
      'Stand with feet together, arms at sides.',
      'Jump while spreading legs and raising arms overhead into a star.',
      'Return to start in one smooth motion.',
    ],
    commonMistakes: [
      { mistake: 'Stiff knees on landing', fix: 'Land softly with bent knees' },
    ],
    variations: [
      { id: 'seal-jack', name: 'Seal Jack', focusNote: 'Arms open laterally — chest stretch' },
      { id: 'star-jump', name: 'Star Jump', focusNote: 'Full extension jump — more power' },
    ],
    caloriesPerMin: 8,
    mets: 8,
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climbers',
    category: 'hiit',
    difficulty: 'beginner',
    muscles: ['Core', 'Hip Flexors', 'Shoulders'],
    secondaryMuscles: ['Quads', 'Chest', 'Cardiovascular System'],
    muscleGroup: 'core',
    equipment: ['none'],
    instructions: [
      'Start in high plank position.',
      'Drive one knee toward chest, then rapidly alternate.',
      'Keep hips level and core braced throughout.',
    ],
    commonMistakes: [
      { mistake: 'Bouncing hips', fix: 'Keep hips still and inline with body' },
    ],
    variations: [
      { id: 'mountain-climber-cross', name: 'Cross-Body Mountain Climber', focusNote: 'Rotational oblique emphasis' },
      { id: 'mountain-climber-slow', name: 'Slow Mountain Climber', focusNote: 'Core stability focus' },
    ],
    caloriesPerMin: 10,
    mets: 10,
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'cardio',
    difficulty: 'beginner',
    muscles: ['Hip Flexors', 'Quads', 'Cardiovascular System'],
    secondaryMuscles: ['Core', 'Calves'],
    muscleGroup: 'full_body',
    equipment: ['none'],
    instructions: [
      'Run in place, driving knees up to hip height.',
      'Pump arms actively to increase intensity.',
      'Land softly on balls of feet.',
    ],
    commonMistakes: [
      { mistake: 'Leaning back', fix: 'Stay tall; slight forward lean' },
    ],
    variations: [
      { id: 'high-knees-slow', name: 'Marching High Knees', focusNote: 'Low-impact warm-up version' },
    ],
    caloriesPerMin: 9,
    mets: 9,
  },
];

// ─────────────────────────────────────────────────────────────
// YOGA & FLEXIBILITY
// ─────────────────────────────────────────────────────────────

const yogaExercises: Exercise[] = [
  {
    id: 'downward-dog',
    name: 'Downward Dog',
    category: 'yoga',
    difficulty: 'beginner',
    muscles: ['Hamstrings', 'Calves', 'Shoulders'],
    secondaryMuscles: ['Core', 'Upper Back'],
    muscleGroup: 'full_body',
    equipment: ['none'],
    instructions: [
      'From all fours, tuck toes and lift hips up and back.',
      'Form an inverted V; press heels toward floor.',
      'Relax head between arms; breathe deeply.',
    ],
    commonMistakes: [
      { mistake: 'Rounded back', fix: 'Externally rotate arms; press chest toward thighs' },
    ],
    variations: [
      { id: 'three-legged-dog', name: 'Three-Legged Dog', focusNote: 'Hip flexor stretch + balance' },
      { id: 'downward-dog-push-up', name: 'Downward Dog Push-Up', focusNote: 'Dynamic shoulders flow' },
    ],
    caloriesPerMin: 3,
    mets: 3,
  },
  {
    id: 'warrior-1',
    name: 'Warrior I',
    category: 'yoga',
    difficulty: 'beginner',
    muscles: ['Hip Flexors', 'Quads', 'Glutes'],
    secondaryMuscles: ['Shoulders', 'Core'],
    muscleGroup: 'full_body',
    equipment: ['none'],
    instructions: [
      'Step one foot back, back foot at 45°.',
      'Bend front knee over ankle, hips squared forward.',
      'Raise arms overhead, gaze forward.',
    ],
    commonMistakes: [
      { mistake: 'Back heel lifting', fix: 'Press back heel firmly into mat' },
    ],
    variations: [
      { id: 'warrior-2', name: 'Warrior II', focusNote: 'Hips open; inner thigh stretch' },
      { id: 'warrior-3', name: 'Warrior III', focusNote: 'Balance and single-leg stability' },
      { id: 'reverse-warrior', name: 'Reverse Warrior', focusNote: 'Side body opening' },
    ],
    caloriesPerMin: 3,
    mets: 3,
  },
];

// ─────────────────────────────────────────────────────────────
// SHOULDER EXERCISES
// ─────────────────────────────────────────────────────────────

const shoulderExercises: Exercise[] = [
  {
    id: 'handstand-push-up',
    name: 'Handstand Push-Up',
    category: 'strength',
    difficulty: 'advanced',
    muscles: ['Shoulders', 'Triceps', 'Upper Chest'],
    secondaryMuscles: ['Core', 'Wrists', 'Traps'],
    muscleGroup: 'shoulders',
    equipment: ['none'],
    instructions: [
      'Kick up into handstand against wall.',
      'Lower head toward floor under control.',
      'Press back to full lockout.',
    ],
    commonMistakes: [
      { mistake: 'Wrists not under shoulders', fix: 'Align wrists, elbows, shoulders' },
    ],
    variations: [
      { id: 'pike-push-up', name: 'Pike Push-Up', focusNote: 'Beginner HSPU regression' },
      { id: 'wall-hspu', name: 'Wall HSPU', focusNote: 'Supported — build vertical pressing strength' },
      { id: 'free-hspu', name: 'Freestanding HSPU', focusNote: 'Elite — no wall support' },
    ],
    regressionFrom: 'pike-push-up',
    caloriesPerMin: 9,
    mets: 10,
  },
];

// ─────────────────────────────────────────────────────────────
// PLYOMETRIC / POWER
// ─────────────────────────────────────────────────────────────

const plioExercises: Exercise[] = [
  {
    id: 'box-jump',
    name: 'Box Jump',
    category: 'plyometric',
    difficulty: 'intermediate',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Calves', 'Core'],
    muscleGroup: 'legs',
    equipment: ['bench'],
    instructions: [
      'Stand facing box; load into quarter squat, arms back.',
      'Explode upward, driving arms forward, land softly on box.',
      'Step down and repeat.',
    ],
    commonMistakes: [
      { mistake: 'Landing on stiff legs', fix: 'Land in athletic squat position' },
    ],
    variations: [
      { id: 'broad-jump', name: 'Broad Jump', focusNote: 'Horizontal power' },
      { id: 'depth-jump', name: 'Depth Jump', focusNote: 'Reactive strength — step off then explode' },
      { id: 'single-leg-box-jump', name: 'Single-Leg Box Jump', focusNote: 'Unilateral power' },
    ],
    caloriesPerMin: 11,
    mets: 12,
  },
];

// ─────────────────────────────────────────────────────────────
// MOBILITY
// ─────────────────────────────────────────────────────────────

const mobilityExercises: Exercise[] = [
  {
    id: 'hip-flexor-stretch',
    name: 'Hip Flexor Stretch',
    category: 'mobility',
    difficulty: 'beginner',
    muscles: ['Hip Flexors', 'Quads'],
    secondaryMuscles: ['Glutes'],
    muscleGroup: 'legs',
    equipment: ['none'],
    instructions: [
      'Kneel on one knee, other foot forward.',
      'Shift hips forward until stretch felt in front of rear hip.',
      'Hold 30–60 s each side.',
    ],
    commonMistakes: [
      { mistake: 'Anterior pelvic tilt', fix: 'Tuck pelvis to deepen stretch' },
    ],
    variations: [
      { id: 'couch-stretch', name: 'Couch Stretch', focusNote: 'Deep quad and hip flexor' },
      { id: '90-90-stretch', name: '90/90 Hip Stretch', focusNote: 'Internal and external hip rotation' },
    ],
    caloriesPerMin: 2,
    mets: 2,
  },
  {
    id: 'thoracic-rotation',
    name: 'Thoracic Rotation',
    category: 'mobility',
    difficulty: 'beginner',
    muscles: ['Thoracic Spine', 'Obliques'],
    secondaryMuscles: ['Shoulders', 'Lats'],
    muscleGroup: 'back',
    equipment: ['none'],
    instructions: [
      'Start in 90/90 side-lying position.',
      'Rotate upper arm and gaze toward ceiling.',
      'Return and repeat; 10 reps each side.',
    ],
    commonMistakes: [
      { mistake: 'Rotating from lumbar spine', fix: 'Keep hips stacked; only thoracic rotates' },
    ],
    variations: [
      { id: 'cat-cow', name: 'Cat-Cow', focusNote: 'Full spinal flexion/extension flow' },
      { id: 'thread-needle', name: 'Thread the Needle', focusNote: 'Deeper thoracic rotation' },
    ],
    caloriesPerMin: 2,
    mets: 2,
  },
];

// ─────────────────────────────────────────────────────────────
// MASTER EXPORT
// ─────────────────────────────────────────────────────────────

export const EXERCISES: Exercise[] = [
  ...pushExercises,
  ...pullExercises,
  ...legExercises,
  ...coreExercises,
  ...cardioExercises,
  ...yogaExercises,
  ...shoulderExercises,
  ...plioExercises,
  ...mobilityExercises,
];

// ─── Query helpers ────────────────────────────────────────────

export const getExercisesByCategory = (cat: Category) =>
  EXERCISES.filter((e) => e.category === cat);

export const getExercisesByMuscle = (group: MuscleGroup) =>
  EXERCISES.filter((e) => e.muscleGroup === group);

export const getExercisesByDifficulty = (d: Difficulty) =>
  EXERCISES.filter((e) => e.difficulty === d);

export const getExercisesByEquipment = (eq: Equipment) =>
  EXERCISES.filter((e) => e.equipment.includes(eq));

export const getExerciseById = (id: string) =>
  EXERCISES.find((e) => e.id === id);

/** Gets the next harder exercise in the progression chain */
export const getProgression = (exerciseId: string): Exercise | undefined => {
  const ex = getExerciseById(exerciseId);
  if (!ex?.progressionTo) return undefined;
  return getExerciseById(ex.progressionTo);
};

/** Gets all exercises in the progression chain from this one */
export const getProgressionChain = (exerciseId: string): Exercise[] => {
  const chain: Exercise[] = [];
  let currentId: string | undefined = exerciseId;
  while (currentId) {
    const ex = getExerciseById(currentId);
    if (!ex || chain.includes(ex)) break;
    chain.push(ex);
    currentId = ex.progressionTo;
  }
  return chain;
};
