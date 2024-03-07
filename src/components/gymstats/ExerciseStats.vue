<template>
  <v-container>
    <v-divider :thickness="3" color="#54ab80"></v-divider>
    <v-row>
      <v-col>
        <Bar v-if="loaded" id="avg-set-duration-chart" :options="chartOptions" :data="chartData" />
      </v-col>
    </v-row>
    <v-divider :thickness="3" color="#54ab80"></v-divider>

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
      <v-col>
        <v-select
          v-model="selectedMuscleGroup"
          :items="muscleGroups"
          item-text="text"
          item-value="id"
          label="Muscle Group"
          return-object
          solo
          dense
          @change="onMuscleGroupChange"
        ></v-select>
      </v-col>
    </v-row>

    <v-row v-if="loadedExerciseDistributions" class="mb-12">
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
                <v-list-item-subtitle>{{ percentage }}%</v-list-item-subtitle>
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
  </v-container>
</template>

<script>
import axios from 'axios'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import GymStatsData from '@/gymstats'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'ExerciseStats',
  components: { Bar },

  data: function () {
    return {
      loaded: false,
      selectedMuscleGroup: null,
      loadedExerciseDistributions: null,
      muscleGroups: GymStatsData.muscleGroups,
      muscleGroupToExerciseToExerciseText: GymStatsData.muscleGroupToExerciseToExerciseText,
      chartData: null,
      chartOptions: {
        responsive: true
      }
    }
  },

  mounted() {
    this.refreshAverageSetDurationData()
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
        return 'lightgreen'
      } else if (percentage < 30) {
        return 'green'
      } else {
        return 'darkgreen'
      }
    },

    onExerciseSelected(group, exerciseId) {
      console.log('selectedExercise', exerciseId, 'from group', group.id)
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
        })
        .catch((err) => {
          console.error(err)
        })
    },

    refreshAverageSetDurationData() {
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/gymstats/sets/avgduration?only_prod=true&exclude_testing_data=true`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('avg set duration: response is null')
            return
          }

          vm.loaded = true

          // response.data.durationPerDay values represent duration in nanoseconds, let's convert them to seconds
          const dayLabels = []
          const durationPerDayMinutes = {}
          Object.keys(response.data.durationPerDay).forEach((key) => {
            const dayOnly = key.split('T')[0]
            durationPerDayMinutes[dayOnly] = response.data.durationPerDay[key] / 1000000000 / 60
            dayLabels.push(dayOnly)
          })

          vm.chartData = {
            labels: dayLabels,
            datasets: [
              {
                label: `Duration [avg total ${response.data.duration / 1000000000 / 60} min]`,
                backgroundColor: '#54ab80',
                data: durationPerDayMinutes
              }
            ]
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
</script>
