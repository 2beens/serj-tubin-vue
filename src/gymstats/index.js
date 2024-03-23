const muscleGroups = [
  { id: 'biceps', name: 'Biceps 💪', imgPath: '../../assets/gymstats/biceps.png' },
  { id: 'triceps', name: 'Triceps 💪', imgPath: '../../assets/gymstats/triceps.png' },
  { id: 'legs', name: 'Legs 🦵', imgPath: '../../assets/gymstats/legs.png' },
  { id: 'shoulders', name: 'Shoulders 🤷‍♂️', imgPath: '../../assets/gymstats/shoulders.png' },
  { id: 'chest', name: 'Chest 🙌', imgPath: '../../assets/gymstats/chest.png' },
  { id: 'back', name: 'Back 🚶‍♂️', imgPath: '../../assets/gymstats/back_1.png' },
  { id: 'other', name: 'Other 🚀', imgPath: '../../assets/gymstats/core.png' }
]

const muscleGroupToText = {
  biceps: 'Biceps 💪',
  triceps: 'Triceps 💪',
  legs: 'Legs 🦵',
  shoulders: 'Shoulders 🤷‍♂️',
  chest: 'Chest 🙌',
  back: 'Back 🚶‍♂️',
  other: 'Other 🚀'
}

const muscleGroupToExercises = {
  biceps: [
    { id: 'preacher_curl', name: 'Preacher Curl' },
    { id: 'barbell_curl', name: 'Barbell Curl' },
    { id: 'barbell_vertical_curl', name: 'Barbell Curl [vertical grip]' },
    { id: 'ez_bar_curl', name: 'EZ Bar Curl' },
    { id: 'ez_bar_curl_declined', name: 'EZ Bar Curl [declined]' },
    { id: 'dumbells', name: 'Dumbells' },
    { id: 'dumbells_inclined', name: 'Dumbells [inclined]' },
    { id: 'dumbells_declined', name: 'Dumbells [declined]' }
  ],
  triceps: [
    { id: 'skullcrusher_with_ez_bar', name: 'Skullcrusher w EZ 💀' },
    { id: 'triceps_pushdown', name: 'Tricep Pushdown' },
    { id: 'skull_crushers', name: 'Skull Crushers' },
    { id: 'close_grip_bench_press', name: 'Close-Grip Bench Press' },
    { id: 'bench_dip', name: 'Bench Dip' },
    {
      id: 'dumbbell_overhead_triceps_extension',
      name: 'Dumbbell Overhead Triceps Extension'
    },
    { id: 'cable_overhead_extension_with_rope', name: 'Cable Overhead Extension With Rope' },
    { id: 'cable_push_down', name: 'Cable Push-Down' },
    { id: 'barbell_push_down', name: 'Barbell Push-Down' },
    { id: 'barbell_push_down_ez', name: 'Barbell EZ Push-Down' }
  ],
  chest: [
    { id: 'bench_press', name: 'Bench Press' },
    { id: 'bench_press_inclined', name: 'Bench Press [inclined]' },
    { id: 'bench_press_declined', name: 'Bench Press [declined]' },
    { id: 'dips', name: 'Dips' },
    { id: 'chest_fly_machine', name: 'Chest Fly [machine]' },
    { id: 'chest_fly_machine_inclined', name: 'Chest Fly [machine][inclined]' },
    { id: 'chest_press_machine', name: 'Chest Press [machine]' },
    { id: 'pushups', name: 'Push-Ups' },
    { id: 'dumbbell_pull_over', name: 'Dumbbell Pull-Over' }
  ],
  legs: [
    { id: 'leg_press', name: 'Leg Press' },
    { id: 'calf_raise_seated', name: 'Calf Raise [seated]' },
    { id: 'calf_raise_standing', name: 'Calf Raise [standing]' },
    { id: 'walking_dumbbell_lunges', name: 'Walking Dumbbell Lunges' },
    { id: 'leg_extension_machine', name: 'Leg Extension Machine' },
    { id: 'leg_curl_machine', name: 'Leg Curl Machine' }
  ],
  shoulders: [
    { id: 'lateral_raise', name: 'Lateral Raise 👐' },
    { id: 'side_lateral_raise', name: 'Side Lateral Raise 👐' },
    { id: 'lateral_raise_single_arm_cable', name: 'Lateral Raise 👐 [single] [cable]' },
    { id: 'front_raise', name: 'Front Raise ➬' },
    { id: 'front_raise_single_arm_cable', name: 'Front Raise 👐 [single] [cable]' },
    { id: 'back_raise', name: 'Back Raise 🔙' },
    { id: 'back_push_machine', name: 'Back Push 🔙 [machine]' },
    { id: 'press_barbell_standing', name: 'Press [barbell] [standing]' },
    { id: 'press_dumbell_standing', name: 'Press [dumbell] [standing]' },
    { id: 'press_barbell_seated', name: 'Press [barbell] [seated]' },
    { id: 'press_dumbell_seated', name: 'Press [dumbell] [seated]' },
    { id: 'arnold_press', name: 'Arnold Press' },
    { id: 'rear_delt_fly', name: 'Rear Delt Fly' }
  ],
  back: [
    { id: 'dumbbell_row_inclined', name: 'Inclined Dumbbell Row' },
    { id: 'barbell_row_inclined', name: 'Inclined Barbell Row' },
    { id: 'single_arm_dumbell_row', name: 'Single-Arm Dumbell Row' },
    { id: 'bent_over_row', name: 'Bent Over Row' },
    { id: 't_bar_row', name: 'T-Bar Row' },
    { id: 'pull_up', name: 'Pull Up' },
    { id: 'seated_row_barbell', name: 'Seated Row [barbell]' },
    { id: 'seated_row_v_handle', name: 'Seated Row [V handle]' },
    { id: 'hyperextensions', name: 'Hyperextensions' },
    { id: 'lat_pull_down_barbell', name: 'Lat Pull-Down [barbell]' },
    { id: 'lat_pull_down_v_handle', name: 'Lat Pull-Down [V handle]' }
  ],
  other: [
    { id: 'oblique_crunch_hyperext_bench', name: 'Oblique Crunch [Hyperextension Bench]' },
    { id: 'crunch', name: 'Crunch' },
    { id: 'tuck_crunch', name: 'Tuck Crunch' },
    { id: 'leg_raise_core', name: 'Leg Raise [core]' },
    { id: 'squat', name: 'Squat' },
    { id: 'squat_jump', name: 'Squat Jump' },
    { id: 'burpee', name: 'Burpee' },
    { id: 'plank', name: 'Plank' },
    { id: 'hanging_knee_raise', name: 'Hanging Knee Raise' },
    { id: 'v_sit', name: 'V-sit' },
    { id: 'test', name: '🛠️Test🛠️[dummy]🛠️' }
  ]
}

let muscleGroupToExerciseToExerciseText = {}
for (let muscleGroup in muscleGroupToExercises) {
  muscleGroupToExerciseToExerciseText[muscleGroup] = {}
  for (let exercise of muscleGroupToExercises[muscleGroup]) {
    muscleGroupToExerciseToExerciseText[muscleGroup][exercise.id] = exercise.text
  }
}

export default {
  muscleGroups,
  muscleGroupToText,
  muscleGroupToExercises,
  muscleGroupToExerciseToExerciseText
}
