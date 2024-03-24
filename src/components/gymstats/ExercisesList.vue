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
      <v-col cols="6" sm="3">
        <AddExerciseType @exerciseTypeAdded="onExerciseTypeAdded" />
      </v-col>
    </v-row>

    <v-row v-if="loadedExerciseDistributions" class="mb-0 mt-2" ref="loadedExerciseDistributions">
      <v-col>
        <v-list color="teal lighten-4" style="border-radius: 5px">
          <v-list-item-group color="primary" active-class="pink--text">
            <v-list-item
              v-for="(percentage, exercise) in loadedExerciseDistributions"
              :key="exercise.exerciseId"
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

    <div v-if="loadedExerciseHistory">
      <v-tabs
        class="mt-4"
        v-model="tab"
        style="border-top-left-radius: 5px; border-top-right-radius: 5px"
        background-color="teal lighten-4"
        centered
        icons-and-text
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#timeline">
          Timeline
          <v-icon>mdi-timeline-text</v-icon>
        </v-tab>
        <v-tab href="#setup">
          Setup
          <v-icon>mdi-wrench</v-icon>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab" class="pa-0">
        <v-tab-item value="timeline">
          <v-card flat class="pa-0">
            <v-card-text>
              <v-row class="pa-0" ref="loadedExerciseHistory">
                <v-col class="pa-0">
                  <ExercisesTimeline :loadedExerciseStats="loadedExerciseHistory.stats" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="setup">
          <v-card flat>
            <v-card-text>
              <ExerciseSetup
                :muscleGroup="selectedMuscleGroup.id"
                :exerciseId="selectedExercise.exerciseId"
                @exerciseTypeDeleted="onExerciseTypeDeleted"
              />
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </div>

    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script scoped>
import axios from 'axios'
import GymStatsData from '@/gymstats'
import ExercisesTimeline from '@/components/gymstats/ExerciseTimeline.vue'
import ExerciseSetup from '@/components/gymstats/ExerciseSetup.vue'
import AddExerciseType from '@/components/gymstats/AddExerciseType.vue'

export default {
  name: 'ExerciseList',
  components: {
    ExercisesTimeline,
    ExerciseSetup,
    AddExerciseType
  },

  data: function () {
    return {
      tab: 'timeline',
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
      },
      snackbarText: '',
      showSnackbar: false
    }
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
    },

    onExerciseTypeAdded(exerciseType) {
      this.muscleGroups.forEach((group) => {
        if (group.id === exerciseType.muscleGroup.id) {
          this.selectedMuscleGroup = group
          this.onMuscleGroupChange()
        }
      })

      // now select the new exercise type
      this.selectedExercise = {
        group: exerciseType.muscleGroup,
        exerciseId: exerciseType.exerciseId
      }
      this.onExerciseSelected(exerciseType.muscleGroup, exerciseType.exerciseId)

      this.snackbarText = `Added exercise type: ${exerciseType.name}`
      this.showSnackbar = true
    },

    onExerciseTypeDeleted(exerciseType) {
      this.muscleGroups.forEach((group) => {
        if (group.id === exerciseType.muscleGroup) {
          this.selectedMuscleGroup = group
          this.onMuscleGroupChange()
        }
      })

      // deselect the deleted exercise type
      this.selectedExercise = null
      this.loadedExerciseHistory = null
      this.loadedExerciseDistributions = null

      this.snackbarText = `Deleted exercise type: ${exerciseType.name}`
      this.showSnackbar = true
    }
  }
}
</script>
