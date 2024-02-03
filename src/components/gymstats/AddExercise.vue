<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> Add Exercise ➕ </v-btn>
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
                  label="Muscle Group"
                  solo
                  dense
                ></v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="exercise.exerciseId"
                  :items="muscleGroupToExercises[exercise.muscleGroup]"
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
          <v-btn color="error" dark large @click="showDialog = false"> Close </v-btn>
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
        <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from 'axios'

// muscle group to text mapping
const muscleGroups = ['biceps', 'triceps', 'legs', 'shoulders', 'chest', 'back', 'other']

// muscle group to exercise mapping
const muscleGroupToExercises = {
  biceps: [
    'preacher_curl',
    'barbell_curl',
    'barbell_vertical_curl',
    'ez_bar_curl',
    'ez_bar_curl_declined',
    'dumbells',
    'dumbells_inclined',
    'dumbells_declined'
  ],
  triceps: [
    'skullcrusher_with_ez_bar',
    'triceps_pushdown',
    'skull_crushers',
    'close_grip_bench_press',
    'bench_dip',
    'dumbbell_overhead_triceps_extension',
    'cable_overhead_extension_with_rope',
    'cable_push_down',
    'barbell_push_down',
    'barbell_push_down_ez'
  ],
  chest: [
    'bench_press',
    'bench_press_inclined',
    'bench_press_declined',
    'dips',
    'chest_fly_machine',
    'chest_press_machine',
    'pushups',
    'dumbbell_pull_over'
  ],
  legs: [
    'leg_press',
    'calf_raise_seated',
    'calf_raise_standing',
    'walking_dumbbell_lunges',
    'leg_extension_machine',
    'leg_curl_machine'
  ],
  shoulders: [
    'lateral_raise',
    'side_lateral_raise',
    'lateral_raise_single_arm_cable',
    'front_raise',
    'front_raise_single_arm_cable',
    'back_raise',
    'back_push_machine',
    'press_barbell_standing',
    'press_dumbell_standing',
    'press_barbell_seated',
    'press_dumbell_seated',
    'arnold_press',
    'rear_delt_fly'
  ],
  back: [
    'dumbbell_row_inclined',
    'barbell_row_inclined',
    'single_arm_dumbell_row',
    'bent_over_row',
    't_bar_row',
    'pull_up',
    'seated_row_barbell',
    'seated_row_v_handle',
    'hyperextensions',
    'lat_pull_down_barbell',
    'lat_pull_down_v_handle'
  ],
  other: [
    'oblique_crunch_hyperext_bench',
    'crunch',
    'tuck_crunch',
    'leg_raise_core',
    'squat',
    'squat_jump',
    'burpee',
    'plank',
    'hanging_knee_raise',
    'v_sit',
    'test'
  ]
}

export default {
  name: 'AddExercise',
  data: function () {
    return {
      muscleGroups: muscleGroups,
      muscleGroupToExercises: muscleGroupToExercises,
      showDialog: false,
      exercise: {
        // take the biceps[preacher_curl] as default
        muscleGroup: muscleGroups.biceps,
        exerciseId: muscleGroupToExercises.biceps.preacher_curl,
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
      if (!this.exercise.kilos || isNaN(this.exercise.kilos)) {
        return true
      }
      if (!this.exercise.reps || isNaN(this.exercise.reps)) {
        return true
      }

      return !this.exercise.muscleGroup || !this.exercise.exerciseId
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

      // remove emoji at the end of muscleGroup string
      const muscleGroup = this.exercise.muscleGroup.split(' ')[0]

      const requestBody = {
        muscleGroup: muscleGroup,
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
        .post(process.env.VUE_APP_API_ENDPOINT + '/gymstats', requestBody, {
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
          vm.snackbarText = error
          vm.showSnackbar = true
          console.log(error)
        })
    }
  }
}
</script>