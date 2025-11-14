<template>
  <v-container>
    <v-row v-if="$vuetify.breakpoint.mdAndUp">
      <v-col cols="2">
        <v-text-field
          dark
          style="margin-top: 30px; margin-left: 15px"
          v-model="itemsPerPageInput"
          label="Items per page"
          type="number"
          min="1"
          step="5"
          outlined
          dense
          @change="onItemsPerPageChange"
        />
      </v-col>
      <v-col cols="1">
        <v-checkbox
          v-model="showTable"
          label="Show table"
          dark
          @change="onShowTableChange"
        ></v-checkbox>
      </v-col>
      <v-col cols="7">
        <v-pagination
          style="margin-top: 30px; margin-bottom: 15px"
          v-if="stats && stats.length > 0"
          v-model="page"
          :length="paginationLen"
          :total-visible="$vuetify.breakpoint.mdAndUp ? '8' : '3'"
          @input="onPageChange"
        />
      </v-col>
      <v-col cols="2">
        <AddExercise
          @exercise-added="getExercises"
          style="margin-top: 30px; margin-right: 40px"
        />
      </v-col>
    </v-row>

    <!-- v-else - next three rows for small devices -->
    <!------------------------------------------------->
    <v-row v-if="$vuetify.breakpoint.smAndDown">
      <v-col cols="7" style="padding: 0%">
        <v-text-field
          dark
          style="margin-right: 20%; margin-left: 20%; margin-top: 10px"
          v-model="itemsPerPageInput"
          label="Items per page"
          type="number"
          min="1"
          step="5"
          outlined
          dense
          @change="onItemsPerPageChange"
        />
      </v-col>
      <v-col cols="5" style="padding: 0%">
        <v-checkbox
          v-model="showTable"
          label="Show table"
          dark
          @change="onShowTableChange"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.breakpoint.smAndDown">
      <v-col>
        <v-pagination
          v-if="stats && stats.length > 0"
          style="margin-top: -20px"
          v-model="page"
          :length="paginationLen"
          :total-visible="6"
          @input="onPageChange"
        />
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.breakpoint.smAndDown">
      <v-col>
        <AddExercise
          @exercise-added="getExercises"
          style="margin-bottom: 0px"
        />
      </v-col>
    </v-row>

    <!-- Time elapsed since last exercise - Mobile only -->
    <v-row v-if="$vuetify.breakpoint.smAndDown && lastExerciseTime">
      <v-col>
        <v-card
          dark
          color="blue darken-2"
          class="mx-2 mb-3 mt-0"
          style="border-radius: 8px"
        >
          <v-card-text class="text-center py-2">
            <v-icon small class="mr-2">mdi-clock-outline</v-icon>
            <span class="text-body-2">
              {{ timeElapsedText }}
            </span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!------------------------------------------------->

    <v-row v-if="loadingData">
      <v-col>
        <v-skeleton-loader type="sentences"></v-skeleton-loader>
        <v-skeleton-loader type="table-heading"></v-skeleton-loader>
        <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
      </v-col>
    </v-row>
    <div v-else-if="showTable">
      <template>
        <v-data-table
          id="data-table"
          :headers="headers"
          :items="stats"
          :items-per-page="itemsPerPage"
          hide-default-footer
          disable-pagination
          class="elevation-1"
        >
          <!-- EXERCISE ID -->
          <template #[`item.exerciseId`]="{ item }">
            <v-edit-dialog
              v-model:return-value="item.exerciseId"
              @save="saveExercise(item)"
            >
              {{ item.exerciseId }}
              <template #input>
                <v-text-field
                  v-model="item.exerciseId"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <!-- EXERCISE NAME (not editable) -->
          <template #[`item.exerciseName`]="{ item }">
            {{ item.exerciseName }}
          </template>
          <!-- MUSCLE GROUP -->
          <template #[`item.muscleGroup`]="{ item }">
            <v-edit-dialog
              v-model:return-value="item.muscleGroup"
              @save="saveExercise(item)"
            >
              <v-chip :color="getMuscleGroupColor(item.muscleGroup)" dark>
                {{ item.muscleGroup }}
              </v-chip>
              <template #input>
                <v-text-field
                  v-model="item.muscleGroup"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <!-- KILOS -->
          <template #[`item.kilos`]="{ item }">
            <v-edit-dialog
              v-model:return-value="item.kilos"
              @save="saveExercise(item)"
            >
              <v-chip :color="getKilosColor(item.kilos)" dark>
                {{ item.kilos }}
              </v-chip>
              <template #input>
                <v-text-field
                  v-model="item.kilos"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <!-- REPS -->
          <template #[`item.reps`]="{ item }">
            <v-edit-dialog
              v-model:return-value="item.reps"
              @save="saveExercise(item)"
            >
              {{ item.reps }}
              <template #input>
                <v-text-field
                  v-model="item.reps"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <!-- CREATED AT -->
          <template #[`item.createdAt`]="{ item }">
            <v-edit-dialog
              v-model:return-value="item.createdAt"
              @save="saveExercise(item)"
            >
              {{ item.createdAt }}
              <template #input>
                <v-text-field
                  v-model="item.createdAt"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <!-- METADATA -->
          <template #[`item.metadataJson`]="{ item }">
            <v-edit-dialog
              v-model:return-value="item.metadataJson"
              @save="saveExercise(item)"
            >
              {{ item.metadataJson }}
              <template #input>
                <v-text-field
                  v-model="item.metadataJson"
                  label="Edit"
                  single-line
                ></v-text-field>
              </template>
            </v-edit-dialog>
          </template>
          <template #[`item.isTesting`]="{ item }">
            <v-chip :color="item.isTesting === 'yes' ? 'gray' : 'green'" dark>
              {{ item.isTesting }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="editExercise(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteExercise(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
      </template>
    </div>
    <div v-else style="text-align: left">
      <!-- used for small devices, ability to show exercises log in a simple list instead of a table -->
      <v-list dark dense style="border-radius: 5px">
        <v-list-item-group v-for="(exercise, index) in stats" :key="index">
          <v-divider v-if="index > 0" dark class="ma-0"></v-divider>

          <v-list-item :key="exercise.id">
            <v-list-item-icon>
              <v-chip
                :color="getColorFromName(exercise.exerciseName)"
                :style="{
                  color: getTextColor(getColorFromName(exercise.exerciseName)),
                }"
                small
                class="mt-2"
              >
                {{ index + 1 }}
              </v-chip>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>
                {{ exercise.exerciseName }}
              </v-list-item-title>
              <v-list-item-subtitle style="font-size: 0.8em; color: blue">
                {{ new Date(exercise.createdAt).toLocaleString() }}
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                {{ muscleGroupToText[exercise.muscleGroup] }}
                <v-chip small color="blue lighten-1">
                  {{ exercise.kilos }} kg
                </v-chip>
                <v-chip small color="blue lighten-4" text-color="black">
                  {{ exercise.reps }} reps
                </v-chip>
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>

    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn color="pink" variant="text" v-bind="attrs" @click="showSnackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
#data-table {
  padding: 20px;
  margin-bottom: 100px;
  background: #26c6da;
}
</style>

<script scoped>
import AddExercise from '@/components/gymstats/AddExercise.vue'
import GymStatsData from '@/gymstats'
import axios from 'axios'

export default {
  name: 'ExercisesLog',
  components: {
    AddExercise,
  },

  data() {
    return {
      loadingData: false,
      page: 1,
      paginationLen: 0,
      itemsPerPageInput: String,
      itemsPerPage: 50,
      stats: [],
      currentTime: new Date(),
      timeUpdateInterval: null,
      headers: [
        {
          text: 'DB ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'ID', value: 'exerciseId' },
        { text: 'Name', value: 'exerciseName' },
        { text: 'Muscle Group', value: 'muscleGroup' },
        { text: 'Kilos', value: 'kilos' },
        { text: 'Reps', value: 'reps' },
        { text: 'At', value: 'createdAt' },
        { text: 'Metadata', value: 'metadataJson' },
        { text: 'IsTesting', value: 'isTesting' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      snackbarText: '',
      showSnackbar: false,
      showTable: true,
      muscleGroupToText: GymStatsData.muscleGroupToText,
    }
  },

  computed: {
    lastExerciseTime() {
      if (!this.stats || this.stats.length === 0) {
        return null
      }
      // Get the most recent exercise (first one since they're sorted by creation date desc)
      return new Date(this.stats[0].createdAt)
    },

    timeElapsedText() {
      if (!this.lastExerciseTime) {
        return 'No exercises recorded yet'
      }

      const diffMs = this.currentTime - this.lastExerciseTime
      const totalSeconds = Math.floor(diffMs / 1000)
      const totalMinutes = Math.floor(totalSeconds / 60)
      const totalHours = Math.floor(totalMinutes / 60)
      const totalDays = Math.floor(totalHours / 24)

      const days = totalDays
      const hours = totalHours % 24
      const minutes = totalMinutes % 60
      const seconds = totalSeconds % 60

      let timeText = 'Last exercise: '

      if (days > 0) {
        timeText += `${days}d ${hours}h ${minutes}m ${seconds}s ago`
      } else if (hours > 0) {
        timeText += `${hours}h ${minutes}m ${seconds}s ago`
      } else if (minutes > 0) {
        timeText += `${minutes}m ${seconds}s ago`
      } else {
        timeText += `${seconds}s ago`
      }

      return timeText
    },
  },

  mounted: function () {
    const storedShowTable = localStorage.getItem('showExercisesLogTable')
    if (storedShowTable) {
      this.showTable = storedShowTable === 'true'
    }
    this.getExercises()
    this.startTimeUpdater()
  },

  beforeUnmount() {
    this.stopTimeUpdater()
  },

  methods: {
    startTimeUpdater() {
      // Update time every second
      this.timeUpdateInterval = setInterval(() => {
        this.currentTime = new Date()
      }, 1000)
    },

    stopTimeUpdater() {
      if (this.timeUpdateInterval) {
        clearInterval(this.timeUpdateInterval)
        this.timeUpdateInterval = null
      }
    },

    onShowTableChange() {
      localStorage.setItem('showExercisesLogTable', this.showTable)
    },

    getExercises() {
      this.loadingData = true

      const storedItemsPerPageInput = localStorage.getItem('itemsPerPageInput')
      if (storedItemsPerPageInput) {
        this.itemsPerPage = parseInt(storedItemsPerPageInput)
      }

      this.itemsPerPageInput = String(this.itemsPerPage)
      if (!this.$root.loggedIn) {
        return
      }

      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/gymstats/list/page/${vm.page}/size/${vm.itemsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('get all urls - received null response / data')
            vm.stats = []
            return
          }
          vm.handleStatsResp(response)
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          vm.loadingData = false
        })
    },

    editExercise(exercise) {
      console.warn('will edit exercise', exercise)
      // TODO: implement
    },

    saveExercise(exercise) {
      console.warn('will save exercise', exercise)
      const requestBody = {
        id: exercise.id,
        muscleGroup: exercise.muscleGroup,
        exerciseId: exercise.exerciseId,
        kilos: Number(exercise.kilos),
        reps: Number(exercise.reps),
        createdAt: exercise.createdAt,
        metadata: JSON.parse(exercise.metadataJson),
      }

      const vm = this
      axios
        .put(process.env.VUE_APP_API_ENDPOINT + `/gymstats`, requestBody, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('save exercise - received null response / data')
            return
          }
          vm.getExercises()
          vm.snackbarText = `Exercise [${exercise.id}] ${exercise.exerciseId} saved`
          vm.showSnackbar = true
        })
        .catch((error) => {
          console.log(error)
          vm.snackbarText = `Error saving exercise [${exercise.id}] ${exercise.exerciseId}: ${error.message}`
          vm.showSnackbar = true
        })
    },

    deleteExercise(exercise) {
      if (
        !confirm(
          `Are you sure you want to delete exercise: [${exercise.id}] ${exercise.exerciseId} ?`
        )
      ) {
        return
      }

      const vm = this
      axios
        .delete(process.env.VUE_APP_API_ENDPOINT + `/gymstats/${exercise.id}`, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete exercise - received null response / data')
            return
          }
          vm.getExercises()
          vm.snackbarText = `Exercise [${exercise.id}] ${exercise.exerciseId} deleted`
          vm.showSnackbar = true
        })
        .catch((error) => {
          console.log(error)
          vm.snackbarText = `Error deleting exercise [${exercise.id}] ${exercise.exerciseId}: ${error.message}`
          vm.showSnackbar = true
        })
    },

    onItemsPerPageChange() {
      this.itemsPerPage = parseInt(this.itemsPerPageInput)
      this.onPageChange(this.page)
      localStorage.setItem('itemsPerPageInput', this.itemsPerPageInput)
    },

    onPageChange(page) {
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/gymstats/list/page/${page}/size/${vm.itemsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('get all urls - received null response / data')
            return
          }
          vm.handleStatsResp(response)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    handleStatsResp(response) {
      this.stats = response.data.exercises
      for (let i = 0; i < this.stats.length; i++) {
        this.stats[i].metadataJson = JSON.stringify(this.stats[i].metadata)
        this.stats[i].isTesting =
          this.stats[i].metadata.testing === 'true' ? 'yes' : 'no'
      }
      this.paginationLen = Math.ceil(response.data.total / this.itemsPerPage)
    },

    getColorFromName(name) {
      let hash = 0
      for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash)
      }
      let color = (hash & 0x00ffffff).toString(16).toUpperCase()
      color = '#' + '00000'.substring(0, 6 - color.length) + color
      let r = Math.max(parseInt(color.substring(1, 3), 16), 30)
      let g = Math.max(parseInt(color.substring(3, 5), 16), 30)
      let b = Math.max(parseInt(color.substring(5, 7), 16), 30)
      r = Math.floor((255 - r) * 0.1) + r
      g = Math.floor((255 - g) * 0.1) + g
      b = Math.floor((255 - b) * 0.1) + b
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
    },

    getTextColor(color) {
      let r = parseInt(color.substring(1, 3), 16)
      let g = parseInt(color.substring(3, 5), 16)
      let b = parseInt(color.substring(5, 7), 16)
      let luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5 ? '#000000' : '#FFFFFF'
    },

    getKilosColor(kilos) {
      // returns different shares of green color based on kilos
      if (kilos < 10) {
        return 'green lighten-5'
      } else if (kilos < 20) {
        return 'green lighten-4'
      } else if (kilos < 30) {
        return 'green lighten-3'
      } else if (kilos < 40) {
        return 'green lighten-2'
      } else if (kilos < 50) {
        return 'green lighten-1'
      } else if (kilos < 60) {
        return 'green'
      } else if (kilos < 70) {
        return 'green darken-1'
      } else if (kilos < 80) {
        return 'green darken-2'
      } else if (kilos < 90) {
        return 'green darken-3'
      } else if (kilos < 100) {
        return 'green darken-4'
      } else {
        return 'green'
      }
    },

    getMuscleGroupColor(muscleGroup) {
      switch (muscleGroup) {
        case 'biceps':
          return 'red'
        case 'triceps':
          return 'blue'
        case 'legs':
          return 'green'
        case 'shoulders':
          return 'orange'
        case 'chest':
          return 'purple'
        case 'back':
          return 'brown'
        case 'other':
          return 'grey'
        default:
          return 'black'
      }
    },
  },
}
</script>
