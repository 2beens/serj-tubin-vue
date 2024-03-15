<template>
  <v-container style="text-align: left">
    <v-row>
      <v-col cols="6" sm="3">
        <v-card
          @click="
            selectedMuscleGroup = muscleGroups[0]
            onMuscleGroupChange()
          "
          class="teal lighten-4"
        >
          <v-img
            src="../../assets/gymstats/biceps.png"
            height="80"
            class="grey darken-4"
            contain
          ></v-img>
          <v-card-title class="text-h6"> Biceps </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card
          @click="
            selectedMuscleGroup = muscleGroups[1]
            onMuscleGroupChange()
          "
          class="teal lighten-4"
        >
          <v-img
            src="../../assets/gymstats/triceps.png"
            height="80"
            class="grey darken-4"
            contain
          ></v-img>
          <v-card-title class="text-h6"> Triceps </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card
          @click="
            selectedMuscleGroup = muscleGroups[2]
            onMuscleGroupChange()
          "
          class="teal lighten-4"
        >
          <v-img
            src="../../assets/gymstats/legs.png"
            height="80"
            class="grey darken-4"
            contain
          ></v-img>
          <v-card-title class="text-h6"> Legs </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card
          @click="
            selectedMuscleGroup = muscleGroups[3]
            onMuscleGroupChange()
          "
          class="teal lighten-4"
        >
          <v-img
            src="../../assets/gymstats/shoulders.png"
            height="80"
            class="grey darken-4"
            contain
          ></v-img>
          <v-card-title class="text-h6"> Shoulders </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card
          @click="
            selectedMuscleGroup = muscleGroups[4]
            onMuscleGroupChange()
          "
          class="teal lighten-4"
        >
          <v-img
            src="../../assets/gymstats/chest.png"
            height="80"
            class="grey darken-4"
            contain
          ></v-img>
          <v-card-title class="text-h6"> Chest </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card
          @click="
            selectedMuscleGroup = muscleGroups[5]
            onMuscleGroupChange()
          "
          class="teal lighten-4"
        >
          <v-img
            src="../../assets/gymstats/back_2.png"
            height="80"
            class="grey darken-4"
            contain
          ></v-img>
          <v-card-title class="text-h6"> Back </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card
          @click="
            selectedMuscleGroup = muscleGroups[6]
            onMuscleGroupChange()
          "
          class="teal lighten-4"
        >
          <v-img
            src="../../assets/gymstats/core.png"
            height="80"
            class="grey darken-4"
            contain
          ></v-img>
          <v-card-title class="text-h6"> Other </v-card-title>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-if="loadedExerciseDistributions" class="mb-0 mt-2" ref="loadedExerciseDistributions">
      <v-col>
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

    <v-row v-if="loadedExerciseHistory" ref="loadedExerciseHistory">
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
