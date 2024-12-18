const muscleGroups = [
  {
    id: 'biceps',
    name: 'Biceps 💪',
    imgPath: '../../assets/gymstats/biceps.png',
  },
  {
    id: 'triceps',
    name: 'Triceps 💪',
    imgPath: '../../assets/gymstats/triceps.png',
  },
  { id: 'legs', name: 'Legs 🦵', imgPath: '../../assets/gymstats/legs.png' },
  {
    id: 'shoulders',
    name: 'Shoulders 🤷‍♂️',
    imgPath: '../../assets/gymstats/shoulders.png',
  },
  { id: 'chest', name: 'Chest 🙌', imgPath: '../../assets/gymstats/chest.png' },
  { id: 'back', name: 'Back 🚶‍♂️', imgPath: '../../assets/gymstats/back_1.png' },
  { id: 'other', name: 'Other 🚀', imgPath: '../../assets/gymstats/core.png' },
]

const muscleGroupToText = {
  biceps: 'Biceps 💪',
  triceps: 'Triceps 💪',
  legs: 'Legs 🦵',
  shoulders: 'Shoulders 🤷‍♂️',
  chest: 'Chest 🙌',
  back: 'Back 🚶‍♂️',
  other: 'Other 🚀',
}

const muscleGroupToExercises = {
  biceps: [
    { exerciseId: 'preacher_curl', name: 'Preacher Curl' },
    { exerciseId: 'barbell_curl', name: 'Barbell Curl' },
    {
      exerciseId: 'barbell_vertical_curl',
      name: 'Barbell Curl [vertical grip]',
    },
    { exerciseId: 'ez_bar_curl', name: 'EZ Bar Curl' },
    { exerciseId: 'ez_bar_curl_declined', name: 'EZ Bar Curl [declined]' },
    { exerciseId: 'dumbells', name: 'Dumbells' },
    { exerciseId: 'dumbells_inclined', name: 'Dumbells [inclined]' },
    { exerciseId: 'dumbells_declined', name: 'Dumbells [declined]' },
  ],
  triceps: [
    { exerciseId: 'skullcrusher_with_ez_bar', name: 'Skullcrusher w EZ 💀' },
    { exerciseId: 'triceps_pushdown', name: 'Tricep Pushdown' },
    { exerciseId: 'skull_crushers', name: 'Skull Crushers' },
    { exerciseId: 'close_grip_bench_press', name: 'Close-Grip Bench Press' },
    { exerciseId: 'bench_dip', name: 'Bench Dip' },
    {
      exerciseId: 'dumbbell_overhead_triceps_extension',
      name: 'Dumbbell Overhead Triceps Extension',
    },
    {
      exerciseId: 'cable_overhead_extension_with_rope',
      name: 'Cable Overhead Extension With Rope',
    },
    { exerciseId: 'cable_push_down', name: 'Cable Push-Down' },
    { exerciseId: 'barbell_push_down', name: 'Barbell Push-Down' },
    { exerciseId: 'barbell_push_down_ez', name: 'Barbell EZ Push-Down' },
  ],
  chest: [
    { exerciseId: 'bench_press', name: 'Bench Press' },
    { exerciseId: 'bench_press_inclined', name: 'Bench Press [inclined]' },
    { exerciseId: 'bench_press_declined', name: 'Bench Press [declined]' },
    { exerciseId: 'dips', name: 'Dips' },
    { exerciseId: 'chest_fly_machine', name: 'Chest Fly [machine]' },
    {
      exerciseId: 'chest_fly_machine_inclined',
      name: 'Chest Fly [machine][inclined]',
    },
    { exerciseId: 'chest_press_machine', name: 'Chest Press [machine]' },
    { exerciseId: 'pushups', name: 'Push-Ups' },
    { exerciseId: 'dumbbell_pull_over', name: 'Dumbbell Pull-Over' },
  ],
  legs: [
    { exerciseId: 'leg_press', name: 'Leg Press' },
    { exerciseId: 'calf_raise_seated', name: 'Calf Raise [seated]' },
    { exerciseId: 'calf_raise_standing', name: 'Calf Raise [standing]' },
    { exerciseId: 'walking_dumbbell_lunges', name: 'Walking Dumbbell Lunges' },
    { exerciseId: 'leg_extension_machine', name: 'Leg Extension Machine' },
    { exerciseId: 'leg_curl_machine', name: 'Leg Curl Machine' },
  ],
  shoulders: [
    { exerciseId: 'lateral_raise', name: 'Lateral Raise 👐' },
    { exerciseId: 'side_lateral_raise', name: 'Side Lateral Raise 👐' },
    {
      exerciseId: 'lateral_raise_single_arm_cable',
      name: 'Lateral Raise 👐 [single] [cable]',
    },
    { exerciseId: 'front_raise', name: 'Front Raise ➬' },
    {
      exerciseId: 'front_raise_single_arm_cable',
      name: 'Front Raise 👐 [single] [cable]',
    },
    { exerciseId: 'back_raise', name: 'Back Raise 🔙' },
    { exerciseId: 'back_push_machine', name: 'Back Push 🔙 [machine]' },
    {
      exerciseId: 'press_barbell_standing',
      name: 'Press [barbell] [standing]',
    },
    {
      exerciseId: 'press_dumbell_standing',
      name: 'Press [dumbell] [standing]',
    },
    { exerciseId: 'press_barbell_seated', name: 'Press [barbell] [seated]' },
    { exerciseId: 'press_dumbell_seated', name: 'Press [dumbell] [seated]' },
    { exerciseId: 'arnold_press', name: 'Arnold Press' },
    { exerciseId: 'rear_delt_fly', name: 'Rear Delt Fly' },
  ],
  back: [
    { exerciseId: 'dumbbell_row_inclined', name: 'Inclined Dumbbell Row' },
    { exerciseId: 'barbell_row_inclined', name: 'Inclined Barbell Row' },
    { exerciseId: 'single_arm_dumbell_row', name: 'Single-Arm Dumbell Row' },
    { exerciseId: 'bent_over_row', name: 'Bent Over Row' },
    { exerciseId: 't_bar_row', name: 'T-Bar Row' },
    { exerciseId: 'pull_up', name: 'Pull Up' },
    { exerciseId: 'seated_row_barbell', name: 'Seated Row [barbell]' },
    { exerciseId: 'seated_row_v_handle', name: 'Seated Row [V handle]' },
    { exerciseId: 'hyperextensions', name: 'Hyperextensions' },
    { exerciseId: 'lat_pull_down_barbell', name: 'Lat Pull-Down [barbell]' },
    { exerciseId: 'lat_pull_down_v_handle', name: 'Lat Pull-Down [V handle]' },
  ],
  other: [
    {
      exerciseId: 'oblique_crunch_hyperext_bench',
      name: 'Oblique Crunch [Hyperextension Bench]',
    },
    { exerciseId: 'crunch', name: 'Crunch' },
    { exerciseId: 'tuck_crunch', name: 'Tuck Crunch' },
    { exerciseId: 'leg_raise_core', name: 'Leg Raise [core]' },
    { exerciseId: 'squat', name: 'Squat' },
    { exerciseId: 'squat_jump', name: 'Squat Jump' },
    { exerciseId: 'burpee', name: 'Burpee' },
    { exerciseId: 'plank', name: 'Plank' },
    { exerciseId: 'hanging_knee_raise', name: 'Hanging Knee Raise' },
    { exerciseId: 'v_sit', name: 'V-sit' },
    { exerciseId: 'test', name: '🛠️Test🛠️[dummy]🛠️' },
  ],
}

export default {
  muscleGroups,
  muscleGroupToText,
  muscleGroupToExercises,
}
