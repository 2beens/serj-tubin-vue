<template>
  <v-container>
    <!-- now: an input box to select a muscle group, and after it's selected, we call "/api/gymstats/group/<selected-group>/percentages" -->
    <!-- and we display results: all exercises with their percentage distribution, e.g. backend might return: -->
    <!-- {
      "barbell_row_inclined": 15.83,
      "bent_over_row": 0.94,
      "deadlift": 1.41,
      "exercise1": 1.18,
      "exercise2": 0.23,
      "hyperextensions": 20.56,
      "lat_pull_down_barbell": 21.51,
      "lat_pull_down_v_handle": 4.72,
      "pull_up": 10.4,
      "seated_row_barbell": 0.94,
      "seated_row_v_handle": 18.43,
      "single_arm_dumbell_row": 2.36,
      "t_bar_row": 0.94
    } -->

    <!-- and we display it as a list of different shade of green color, depending on the percentage -->
    <v-row>
      <v-col class="d-flex" cols="12" sm="12">
        <v-select
          v-model="selectedMuscleGroup"
          :items="muscleGroups"
          item-text="text"
          item-value="id"
          label="Muscle Group"
          return-object
          dark
          solo
          dense
          @change="onMuscleGroupChange"
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="loadedExerciseDistributions" class="mb-12" ref="loadedExerciseDistributions">
      <v-col>
        <v-divider :thickness="3" color="#54ab80"></v-divider>
        <v-list color="teal lighten-4" style="border-radius: 5px">
          <v-list-item-group color="primary" active-class="pink--text">
            <v-list-item
              v-for="(percentage, exercise) in loadedExerciseDistributions"
              :key="exercise.id"
            >
              <v-list-item-icon>
                <v-icon :color="getPercentageColor(percentage)">mdi-circle</v-icon>
              </v-list-item-icon>
              <v-list-item-content @click="onExerciseSelected(selectedMuscleGroup, exercise)">
                <v-list-item-title>
                  {{
                    muscleGroupToExerciseToExerciseText[selectedMuscleGroup.id][exercise] ??
                    exercise
                  }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip color="teal lighten-1"> {{ percentage }}% </v-chip>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>

    <!-- TODO: when an exercise is clicked in the list, we get its history from the server, and show bellow -->
    <!-- path: /api/gymstats/exercise/<exerciseId>/group/<muscleGroup>/history -->
    <!-- server might return something like: -->
    <!-- {
      "exerciseId": "dumbells",
      "muscleGroup": "biceps",
      "stats": {
        "2023-05-12T00:00:00Z": {
          "avgKilos": 50,
          "avgReps": 11,
          "sets": 1
        },
        "2023-05-15T00:00:00Z": {
          "avgKilos": 17,
          "avgReps": 18,
          "sets": 4
        },
        "2023-05-20T00:00:00Z": {
          "avgKilos": 32,
          "avgReps": 11,
          "sets": 4
        }
      }
    } -->
    <v-row v-if="loadedExerciseHistory" class="mb-12" ref="loadedExerciseHistory">
      <v-col>
        <v-timeline align-top dense dark>
          <v-timeline-item v-for="(stats, date) in loadedExerciseHistory.stats" :key="date" small>
            <v-card dark class="mx-auto pa-0" max-width="600">
              <v-card-title>{{ date }}</v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-chip color="teal lighten-1" label>
                      <v-icon left> mdi-weight-lifter </v-icon>
                      Avg. Kilos
                    </v-chip>
                    <v-chip class="ml-2" color="primary">{{ stats.avgKilos }}</v-chip>
                  </v-col>
                  <v-col>
                    <v-chip color="teal lighten-1" label>
                      <v-icon left> mdi-dumbbell </v-icon>
                      Avg. Reps
                    </v-chip>
                    <v-chip class="ml-2" color="primary">{{ stats.avgReps }}</v-chip>
                  </v-col>
                  <v-col>
                    <v-chip color="teal lighten-1" label>
                      <v-icon left> mdi-clock-time-four-outline </v-icon>
                      Sets
                    </v-chip>
                    <v-chip class="ml-2" color="primary">{{ stats.sets }}</v-chip>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import GymStatsData from '@/gymstats'

export default {
  name: 'ExerciseList',

  data: function () {
    return {
      loaded: false,
      selectedMuscleGroup: null,
      selectedExercise: null,
      loadedExerciseDistributions: null,
      loadedExerciseHistory: null,
      muscleGroups: GymStatsData.muscleGroups,
      muscleGroupToExerciseToExerciseText: GymStatsData.muscleGroupToExerciseToExerciseText,
      chartData: null,
      chartOptions: {
        responsive: true
      }
    }
  },

  mounted() {
    console.log('ex. list mounted')
  },

  methods: {
    getPercentageColor(percentage) {
      if (percentage < 2) {
        return 'red'
      } else if (percentage < 6) {
        return 'orange'
      } else if (percentage < 12) {
        return 'yellow'
      } else if (percentage < 20) {
        return 'light-green'
      } else if (percentage < 30) {
        return 'green'
      } else {
        return 'blue'
      }
    },

    onExerciseSelected(group, exerciseId) {
      console.log('selectedExercise', exerciseId, 'from group', group.id)
      this.selectedExercise = {
        group: group,
        exerciseId: exerciseId
      }

      // get exercise history from the server
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/gymstats/exercise/${exerciseId}/group/${group.id}/history?only_prod=true&exclude_testing_data=true`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('response is null')
            return
          }

          const loadedExerciseHistory = response.data

          //sort by date desc
          loadedExerciseHistory.stats = Object.fromEntries(
            Object.entries(loadedExerciseHistory.stats).sort(
              (a, b) => new Date(b[0]) - new Date(a[0])
            )
          )
          // format timestamps to a human readable string in EU/DE format: dd.mm.yyyy [day name]
          Object.keys(loadedExerciseHistory.stats).forEach((key) => {
            const date = new Date(key)
            const newKey = `${date.toLocaleDateString('de-DE')} [${date.toLocaleString('de-DE', {
              weekday: 'long'
            })}]`
            loadedExerciseHistory.stats[newKey] = loadedExerciseHistory.stats[key]
            delete loadedExerciseHistory.stats[key]
          })

          vm.loadedExerciseHistory = loadedExerciseHistory

          this.$nextTick(() => {
            this.$refs.loadedExerciseHistory.scrollIntoView({ behavior: 'smooth' })
          })
        })
        .catch((err) => {
          console.error(err)
        })
    },

    onMuscleGroupChange() {
      console.log('selectedMuscleGroup', this.selectedMuscleGroup.id, '=', this.selectedMuscleGroup)
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/gymstats/group/${this.selectedMuscleGroup.id}/percentages?only_prod=true&exclude_testing_data=true`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('response is null')
            return
          }
          vm.loadedExerciseDistributions = response.data
          this.$nextTick(() => {
            this.$refs.loadedExerciseDistributions.scrollIntoView({ behavior: 'smooth' })
          })
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>
