const muscleGroups = [
  { id: 'biceps', text: 'Biceps 💪' },
  { id: 'triceps', text: 'Triceps 💪' },
  { id: 'legs', text: 'Legs 🦵' },
  { id: 'shoulders', text: 'Shoulders 🤷‍♂️' },
  { id: 'chest', text: 'Chest 🙌' },
  { id: 'back', text: 'Back 🚶‍♂️' },
  { id: 'other', text: 'Other 🚀' }
]

const muscleGroupToExercises = {
  biceps: [
    { id: 'preacher_curl', text: 'Preacher Curl' },
    { id: 'barbell_curl', text: 'Barbell Curl' },
    { id: 'barbell_vertical_curl', text: 'Barbell Curl [vertical grip]' },
    { id: 'ez_bar_curl', text: 'EZ Bar Curl' },
    { id: 'ez_bar_curl_declined', text: 'EZ Bar Curl [declined]' },
    { id: 'dumbells', text: 'Dumbells' },
    { id: 'dumbells_inclined', text: 'Dumbells [inclined]' },
    { id: 'dumbells_declined', text: 'Dumbells [declined]' }
  ],
  triceps: [
    { id: 'skullcrusher_with_ez_bar', text: 'Skullcrusher w EZ 💀' },
    { id: 'triceps_pushdown', text: 'Tricep Pushdown' },
    { id: 'skull_crushers', text: 'Skull Crushers' },
    { id: 'close_grip_bench_press', text: 'Close-Grip Bench Press' },
    { id: 'bench_dip', text: 'Bench Dip' },
    {
      id: 'dumbbell_overhead_triceps_extension',
      text: 'Dumbbell Overhead Triceps Extension'
    },
    { id: 'cable_overhead_extension_with_rope', text: 'Cable Overhead Extension With Rope' },
    { id: 'cable_push_down', text: 'Cable Push-Down' },
    { id: 'barbell_push_down', text: 'Barbell Push-Down' },
    { id: 'barbell_push_down_ez', text: 'Barbell EZ Push-Down' }
  ],
  chest: [
    { id: 'bench_press', text: 'Bench Press' },
    { id: 'bench_press_inclined', text: 'Bench Press [inclined]' },
    { id: 'bench_press_declined', text: 'Bench Press [declined]' },
    { id: 'dips', text: 'Dips' },
    { id: 'chest_fly_machine', text: 'Chest Fly [machine]' },
    { id: 'chest_press_machine', text: 'Chest Press [machine]' },
    { id: 'pushups', text: 'Push-Ups' },
    { id: 'dumbbell_pull_over', text: 'Dumbbell Pull-Over' }
  ],
  legs: [
    { id: 'leg_press', text: 'Leg Press' },
    { id: 'calf_raise_seated', text: 'Calf Raise [seated]' },
    { id: 'calf_raise_standing', text: 'Calf Raise [standing]' },
    { id: 'walking_dumbbell_lunges', text: 'Walking Dumbbell Lunges' },
    { id: 'leg_extension_machine', text: 'Leg Extension Machine' },
    { id: 'leg_curl_machine', text: 'Leg Curl Machine' }
  ],
  shoulders: [
    { id: 'lateral_raise', text: 'Lateral Raise 👐' },
    { id: 'side_lateral_raise', text: 'Side Lateral Raise 👐' },
    { id: 'lateral_raise_single_arm_cable', text: 'Lateral Raise 👐 [single] [cable]' },
    { id: 'front_raise', text: 'Front Raise ➬' },
    { id: 'front_raise_single_arm_cable', text: 'Front Raise 👐 [single] [cable]' },
    { id: 'back_raise', text: 'Back Raise 🔙' },
    { id: 'back_push_machine', text: 'Back Push 🔙 [machine]' },
    { id: 'press_barbell_standing', text: 'Press [barbell] [standing]' },
    { id: 'press_dumbell_standing', text: 'Press [dumbell] [standing]' },
    { id: 'press_barbell_seated', text: 'Press [barbell] [seated]' },
    { id: 'press_dumbell_seated', text: 'Press [dumbell] [seated]' },
    { id: 'arnold_press', text: 'Arnold Press' },
    { id: 'rear_delt_fly', text: 'Rear Delt Fly' }
  ],
  back: [
    { id: 'dumbbell_row_inclined', text: 'Inclined Dumbbell Row' },
    { id: 'barbell_row_inclined', text: 'Inclined Barbell Row' },
    { id: 'single_arm_dumbell_row', text: 'Single-Arm Dumbell Row' },
    { id: 'bent_over_row', text: 'Bent Over Row' },
    { id: 't_bar_row', text: 'T-Bar Row' },
    { id: 'pull_up', text: 'Pull Up' },
    { id: 'seated_row_barbell', text: 'Seated Row [barbell]' },
    { id: 'seated_row_v_handle', text: 'Seated Row [V handle]' },
    { id: 'hyperextensions', text: 'Hyperextensions' },
    { id: 'lat_pull_down_barbell', text: 'Lat Pull-Down [barbell]' },
    { id: 'lat_pull_down_v_handle', text: 'Lat Pull-Down [V handle]' }
  ],
  other: [
    { id: 'oblique_crunch_hyperext_bench', text: 'Oblique Crunch [Hyperextension Bench]' },
    { id: 'crunch', text: 'Crunch' },
    { id: 'tuck_crunch', text: 'Tuck Crunch' },
    { id: 'leg_raise_core', text: 'Leg Raise [core]' },
    { id: 'squat', text: 'Squat' },
    { id: 'squat_jump', text: 'Squat Jump' },
    { id: 'burpee', text: 'Burpee' },
    { id: 'plank', text: 'Plank' },
    { id: 'hanging_knee_raise', text: 'Hanging Knee Raise' },
    { id: 'v_sit', text: 'V-sit' },
    { id: 'test', text: '🛠️Test🛠️[dummy]🛠️' }
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
  muscleGroupToExercises,
  muscleGroupToExerciseToExerciseText
}
