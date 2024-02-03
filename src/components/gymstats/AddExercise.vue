<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">Add Exercise ➕</v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Exercise</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-autocomplete
                  v-model="exercise.muscleGroup"
                  :items="muscleGroups"
                  item-text="text"
                  item-value="id"
                  label="Muscle Group"
                  return-object
                  solo
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="exercise.exerciseId"
                  :items="exercisesForSelectedMuscleGroup"
                  item-text="text"
                  item-value="id"
                  label="Exercise"
                  solo
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="exercise.kilos"
                  label="Kilos"
                  type="number"
                  required
                  dense
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="exercise.reps"
                  label="Reps"
                  type="number"
                  required
                  dense
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="exercise.createdAt"
                  label="Created At"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="exercise.metadataJson"
                  label="Metadata"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark large @click="showDialog = false">Close</v-btn>
          <v-btn
            color="success"
            dark
            large
            @click="addExercise"
            :disabled="addDisabled"
            style="margin-left: 50px"
          >
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AddExercise',
  data: function () {
    return {
      muscleGroups: [
        { id: 'biceps', text: 'Biceps 💪' },
        { id: 'triceps', text: 'Triceps 💪' },
        { id: 'legs', text: 'Legs 🦵' },
        { id: 'shoulders', text: 'Shoulders 🤷‍♂️' },
        { id: 'chest', text: 'Chest 🙌' },
        { id: 'back', text: 'Back 🚶‍♂️' },
        { id: 'other', text: 'Other 🚀' }
      ],
      muscleGroupToExercises: {
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
      },
      showDialog: false,
      exercise: {
        muscleGroup: null,
        exerciseId: null,
        kilos: '',
        reps: '',
        createdAt: '',
        metadataJson: `{"env": "prod", "testing": "true"}`
      },
      snackbarText: '',
      showSnackbar: false
    }
  },

  computed: {
    addDisabled() {
      return (
        !this.exercise.kilos ||
        isNaN(this.exercise.kilos) ||
        !this.exercise.reps ||
        isNaN(this.exercise.reps) ||
        !this.exercise.muscleGroup ||
        !this.exercise.exerciseId
      )
    },

    exercisesForSelectedMuscleGroup() {
      if (!this.exercise.muscleGroup) return []
      return this.muscleGroupToExercises[this.exercise.muscleGroup.id] || []
    }
  },

  mounted() {
    // get last added exercise from local storage
    const lastAddedExercise = localStorage.getItem('lastAddedExercise')
    if (lastAddedExercise) {
      this.exercise = JSON.parse(lastAddedExercise)
    }
  },

  methods: {
    addExercise() {
      // store added exercise in local storage, and get it from there when adding next time
      localStorage.setItem('lastAddedExercise', JSON.stringify(this.exercise))

      const requestBody = {
        muscleGroup: this.exercise.muscleGroup.id,
        exerciseId: this.exercise.exerciseId,
        kilos: Number(this.exercise.kilos),
        reps: Number(this.exercise.reps),
        metadata: JSON.parse(this.exercise.metadataJson)
      }

      if (this.exercise.createdAt) {
        requestBody.createdAt = this.exercise.createdAt
      }

      console.log('adding exercise', requestBody)

      const vm = this
      axios
        .post(`${process.env.VUE_APP_API_ENDPOINT}/gymstats`, requestBody, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          if (!response.data) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          vm.snackbarText = `Exercise ${response.data.id} added [today: ${response.data.countToday}]!`
          vm.showSnackbar = true
          vm.showDialog = false
          vm.$emit('exercise-added', response.data.id)
        })
        .catch(function (error) {
          vm.snackbarText = `Error adding exercise: ${error.message}`
          vm.showSnackbar = true
          console.log(error)
        })
    }
  }
}
</script>
