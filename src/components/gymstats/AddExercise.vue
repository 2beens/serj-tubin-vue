<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on" v-if="$vuetify.breakpoint.mdAndUp">
          Add Exercise ➕
        </v-btn>
        <v-btn color="primary" dark v-bind="attrs" v-on="on" v-else>Add ➕</v-btn>
      </template>
      <v-card>
        <v-card-title class="justify-center">
          <span class="text-h5">Add Exercise</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="ma-0 mt-5 pa-0">
                <v-select
                  v-model="exercise.muscleGroup"
                  :items="muscleGroups"
                  item-text="name"
                  item-value="id"
                  label="Muscle Group"
                  return-object
                  solo
                  dense
                ></v-select>
              </v-col>
              <v-col cols="12" class="ma-0 pa-0">
                <v-select
                  v-model="exercise.exerciseId"
                  :items="exercisesForSelectedMuscleGroup"
                  item-text="name"
                  item-value="exerciseId"
                  label="Exercise"
                  solo
                  dense
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" class="ma-0 pa-0">
                <v-text-field
                  v-model="exercise.kilos"
                  label="Kilos"
                  type="number"
                  required
                  dense
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="ma-0 pa-0">
                <v-text-field
                  v-model="exercise.reps"
                  label="Reps"
                  type="number"
                  required
                  dense
                  solo
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="$vuetify.breakpoint.mdAndUp" class="ma-0 pa-0">
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
          <v-btn color="primary" dark large @click="refreshExerciseTypes">Refresh</v-btn>
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
import GymStatsData from '@/gymstats'

export default {
  name: 'AddExercise',
  data: function () {
    return {
      muscleGroups: GymStatsData.muscleGroups,
      muscleGroupToExercises: GymStatsData.muscleGroupToExercises,
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
      if (!this.exercise.muscleGroup)
        return [
          {
            exerciseId: null,
            name: 'Select a muscle group first ⛔️'
          }
        ]
      const exercises = this.muscleGroupToExercises[this.exercise.muscleGroup.id]
      if (!exercises)
        return [
          {
            exerciseId: null,
            name: `No exercises for selected muscle group: ${this.exercise.muscleGroup.id} ⛔️`
          }
        ]
      return exercises
    }
  },

  mounted() {
    const lastAddedExercise = localStorage.getItem('lastAddedExercise')
    if (lastAddedExercise) {
      this.exercise = JSON.parse(lastAddedExercise)
    }
    // get exercise types from local storage
    const muscleGroupToExercises = localStorage.getItem('exerciseTypes')
    if (muscleGroupToExercises && muscleGroupToExercises.length > 0) {
      this.muscleGroupToExercises = JSON.parse(muscleGroupToExercises)
    } else {
      console.log('no exercise types in local storage, will refresh')
      this.refreshExerciseTypes()
    }
  },

  methods: {
    refreshExerciseTypes() {
      const vm = this
      axios
        .get(`${process.env.VUE_APP_API_ENDPOINT}/gymstats/types`, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          },
          timeout: 3500
        })
        .then(function (response) {
          if (!response.data) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            // fallback to local hardcoded data
            vm.muscleGroupToExercises = GymStatsData.muscleGroupToExercises
            return
          }

          const muscleGroupToExercises = {}
          response.data.forEach((exerciseType) => {
            if (!muscleGroupToExercises[exerciseType.muscleGroup]) {
              muscleGroupToExercises[exerciseType.muscleGroup] = []
            }
            muscleGroupToExercises[exerciseType.muscleGroup].push(exerciseType)
          })

          vm.muscleGroupToExercises = muscleGroupToExercises

          // now, for each muscle group, get exercise distributions
          // and add them to the exercise type name (name + (percentage%))
          for (const muscleGroup in muscleGroupToExercises) {
            vm.getExerciseDistributions(muscleGroup)
              .then((response) => {
                if (response === null || response.data === null) {
                  console.error('response is null')
                  return
                }
                const exerciseDistributions = response.data
                muscleGroupToExercises[muscleGroup].forEach((exerciseType) => {
                  const exerciseDistribution = exerciseDistributions[exerciseType.exerciseId]
                  if (exerciseDistribution) {
                    exerciseType.name = `${
                      exerciseType.name
                    } (${exerciseDistribution.percentage.toFixed(2)}%)`
                    exerciseType.percentage = exerciseDistribution.percentage
                  }
                })
              })
              .catch((err) => {
                console.error(
                  `Error getting exercise distributions for muscle group ${muscleGroup}: ${err}`
                )
              })
              .finally(() => {
                // store exercise types in local storage
                localStorage.setItem('exerciseTypes', JSON.stringify(vm.muscleGroupToExercises))
              })
          }
        })
        .catch(function (error) {
          vm.snackbarText = `Error getting muscle groups: ${error.message}`
          vm.showSnackbar = true
          // fallback to local hardcoded data
          vm.muscleGroupToExercises = GymStatsData.muscleGroupToExercises
          vm.snackbarText = `${error}: ${error.response.data}`
        })
        .finally(function () {
          vm.snackbarText = 'Exercise types refreshed!'
          vm.showSnackbar = true
        })
    },

    getExerciseDistributions(muscleGroup) {
      return axios.get(
        process.env.VUE_APP_API_ENDPOINT +
          `/gymstats/group/${muscleGroup}/percentages?only_prod=true&exclude_testing_data=true`,
        {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        }
      )
    },

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
