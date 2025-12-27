<template>
  <v-dialog v-model="showDialog" persistent max-width="600px">
    <template v-slot:activator="{ props }">
      <v-btn
        color="primary"
        v-bind="props"
        v-if="$vuetify.display.mdAndUp"
      >
        Add Exercise ➕
      </v-btn>
      <v-btn color="primary" v-bind="props" v-else>Add ➕</v-btn>
    </template>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" class="ma-0 mt-5 pa-0">
                <v-select
                  v-model="exercise.muscleGroup"
                  :items="muscleGroups"
                  item-title="name"
                  item-value="id"
                  label="Muscle Group"
                  return-object
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
              <v-col cols="12" class="ma-0 pa-0">
                <v-select
                  v-model="exercise.exerciseId"
                  :items="exercisesForSelectedMuscleGroup"
                  item-title="name"
                  item-value="exerciseId"
                  label="Exercise"
                  variant="outlined"
                  density="compact"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" class="ma-0 pa-0">
                <v-text-field
                  v-model="exercise.kilos"
                  label="Kilos"
                  type="number"
                  required
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" class="ma-0 pa-0">
                <v-text-field
                  v-model="exercise.reps"
                  label="Reps"
                  type="number"
                  required
                  density="compact"
                  variant="outlined"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="$vuetify.display.mdAndUp"
                class="ma-0 pa-0"
              >
                <v-text-field
                  v-model="exercise.createdAt"
                  label="Created At"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="$vuetify.display.mdAndUp">
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
          <v-btn color="primary" size="large" @click="refreshExerciseTypes">
            Refresh
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" size="large" @click="showDialog = false">
            Close
          </v-btn>
          <v-btn
            color="success"
            size="large"
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
        <v-btn
          color="pink"
          variant="text"
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
</template>

<script>
import axios from 'axios'
import GymStatsData from '@/gymstats'

export default {
  name: 'AddExercise',
  emits: ['exercise-added'],
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
        metadataJson: `{"env": "prod", "testing": "false"}`,
      },
      snackbarText: '',
      showSnackbar: false,
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
            name: 'Select a muscle group first ⛔️',
          },
        ]
      const exercises =
        this.muscleGroupToExercises[this.exercise.muscleGroup.id]
      if (!exercises)
        return [
          {
            exerciseId: null,
            name: `No exercises for selected muscle group: ${this.exercise.muscleGroup.id} ⛔️`,
          },
        ]
      return exercises
    },

    effectiveMetadataJson() {
      // On mobile, always use production metadata regardless of input
      if (this.$vuetify.display.smAndDown) {
        return '{"env": "prod", "testing": "false"}'
      }
      return this.exercise.metadataJson
    },
  },

  mounted() {
    const lastAddedExercise = localStorage.getItem('lastAddedExercise')
    if (lastAddedExercise) {
      this.exercise = JSON.parse(lastAddedExercise)
    }
    // get exercise types from local storage
    const muscleGroupToExercises = localStorage.getItem('exerciseTypes')
    if (muscleGroupToExercises && muscleGroupToExercises.length > 0) {
      try {
        this.muscleGroupToExercises = JSON.parse(muscleGroupToExercises)
      } catch (e) {
        console.warn('Failed to parse exercise types from localStorage:', e)
        this.refreshExerciseTypes()
      }
    } else {
      console.log('no exercise types in local storage, will refresh')
      this.refreshExerciseTypes()
    }
  },

  methods: {
    refreshExerciseTypes() {
      const vm = this
      axios
        .get(`${import.meta.env.VITE_API_ENDPOINT}/gymstats/types`, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
          timeout: 3500,
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
            // Store original name before we potentially append percentages
            if (!exerciseType.originalName) {
              exerciseType.originalName = exerciseType.name
            }
            muscleGroupToExercises[exerciseType.muscleGroup].push(exerciseType)
          })

          vm.muscleGroupToExercises = muscleGroupToExercises

          // Store exercise types immediately (without percentages)
          localStorage.setItem(
            'exerciseTypes',
            JSON.stringify(vm.muscleGroupToExercises)
          )

          // now, for each muscle group, get exercise distributions
          // and add them to the exercise type name (name + (percentage%))
          // This is optional - if it fails, exercises still work without percentages
          for (const muscleGroup in muscleGroupToExercises) {
            vm.getExerciseDistributions(muscleGroup)
              .then((response) => {
                if (response === null || response.data === null) {
                  return
                }
                const exerciseDistributions = response.data
                muscleGroupToExercises[muscleGroup].forEach((exerciseType) => {
                  const exerciseDistribution =
                    exerciseDistributions[exerciseType.exerciseId]
                  if (exerciseDistribution) {
                    // Use originalName if available, otherwise use current name
                    const baseName = exerciseType.originalName || exerciseType.name
                    exerciseType.name = `${baseName} (${exerciseDistribution.percentage.toFixed(2)}%)`
                    exerciseType.percentage = exerciseDistribution.percentage
                  }
                })
                // Update localStorage with percentages
                localStorage.setItem(
                  'exerciseTypes',
                  JSON.stringify(vm.muscleGroupToExercises)
                )
              })
              .catch((err) => {
                // Silently fail for network/CORS errors - percentages are optional
                // Only log if it's not a network/CORS error
                if (err.code !== 'ERR_NETWORK' && err.code !== 'ERR_CANCELED') {
                  console.warn(
                    `Could not fetch percentages for ${muscleGroup}: ${err.message || 'Network error'}`
                  )
                }
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
        import.meta.env.VITE_API_ENDPOINT +
          `/gymstats/group/${muscleGroup}/percentages?only_prod=true&exclude_testing_data=true`,
        {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
          timeout: 3000, // 3 second timeout to avoid hanging
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
        metadata: JSON.parse(this.effectiveMetadataJson),
      }

      if (this.exercise.createdAt) {
        requestBody.createdAt = this.exercise.createdAt
      }

      console.log('adding exercise', requestBody)

      const vm = this
      axios
        .post(`${import.meta.env.VITE_API_ENDPOINT}/gymstats`, requestBody, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          if (!response.data) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          console.log(
            `Exercise ${response.data.id} added, today: ${response.data.countToday}, seconds since last: ${response.data.secondsSincePreviousSet}`
          )
          const secondsSincePreviousSet =
            response.data.secondsSincePreviousSet || -1
          // if no previous set was found (e.g. first set of the day), backend will return -1
          let timeSincePreviousSetMessage = 'no previous set found'
          if (secondsSincePreviousSet >= 0) {
            const minutes = Math.floor(secondsSincePreviousSet / 60)
            const seconds = secondsSincePreviousSet % 60
            timeSincePreviousSetMessage = `${minutes}m${seconds}s`
          }

          vm.snackbarText = `Exercise ${response.data.id} added [today: ${response.data.countToday}] [since last: ${timeSincePreviousSetMessage}]`
          vm.showSnackbar = true
          vm.showDialog = false
          vm.$emit('exercise-added', response.data.id)
        })
        .catch(function (error) {
          vm.snackbarText = `Error adding exercise: ${error.message}`
          vm.showSnackbar = true
          console.log(error)
        })
    },
  },
}
</script>
