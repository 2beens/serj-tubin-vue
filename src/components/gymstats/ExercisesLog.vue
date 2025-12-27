<template>
  <v-container>
    <v-row v-if="$vuetify.display.mdAndUp" align="center" class="mb-4" no-gutters>
      <v-col cols="auto" class="mr-4">
        <v-text-field
          v-model="itemsPerPageInput"
          label="Items per page"
          type="number"
          min="1"
          step="5"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 150px"
          @change="onItemsPerPageChange"
        />
      </v-col>
      <v-col cols="auto" class="mr-4">
        <v-checkbox
          v-model="showTable"
          label="Show table"
          hide-details
          density="compact"
          @change="onShowTableChange"
        ></v-checkbox>
      </v-col>
      <v-col cols="auto" class="flex-grow-1">
        <div class="d-flex justify-center">
          <v-pagination
            v-if="stats && stats.length > 0"
            v-model="page"
            :length="paginationLen"
            :total-visible="$vuetify.display.mdAndUp ? 8 : 3"
            density="compact"
            @update:model-value="onPageChange"
          />
        </div>
      </v-col>
      <v-col cols="auto" class="ml-4">
        <AddExercise @exercise-added="getExercises" />
      </v-col>
    </v-row>

    <!-- Mobile layout -->
    <!------------------------------------------------->
    <v-row v-if="$vuetify.display.smAndDown" align="center" class="mb-2">
      <v-col cols="6">
        <v-text-field
          v-model="itemsPerPageInput"
          label="Items per page"
          type="number"
          min="1"
          step="5"
          variant="outlined"
          density="compact"
          @change="onItemsPerPageChange"
        />
      </v-col>
      <v-col cols="6">
        <v-checkbox
          v-model="showTable"
          label="Show table"
          @change="onShowTableChange"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.display.smAndDown" class="mb-2">
      <v-col>
        <v-pagination
          v-if="stats && stats.length > 0"
          v-model="page"
          :length="paginationLen"
          :total-visible="6"
          @update:model-value="onPageChange"
        />
      </v-col>
    </v-row>
    <v-row v-if="$vuetify.display.smAndDown" class="mb-4">
      <v-col>
        <AddExercise @exercise-added="getExercises" />
      </v-col>
    </v-row>

    <!-- Time elapsed since last exercise - Mobile only -->
    <v-row v-if="$vuetify.display.smAndDown && lastExerciseTime" class="mb-4">
      <v-col>
        <v-card
          color="blue darken-2"
          class="mx-2"
          style="border-radius: 8px"
        >
          <v-card-text class="text-center py-2">
            <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
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
            <span
              v-if="editingCell?.itemId !== item.id || editingCell?.field !== 'exerciseId'"
              @click="startEdit(item, 'exerciseId')"
              style="cursor: pointer; text-decoration: underline"
            >
              {{ item.exerciseId }}
            </span>
            <v-text-field
              v-else
              v-model="editValue"
              @blur="saveEdit(item, 'exerciseId')"
              @keyup.enter="saveEdit(item, 'exerciseId')"
              @keyup.esc="cancelEdit"
              autofocus
              dense
              hide-details
              style="max-width: 150px"
            ></v-text-field>
          </template>
          <!-- EXERCISE NAME (not editable) -->
          <template #[`item.exerciseName`]="{ item }">
            {{ item.exerciseName }}
          </template>
          <!-- MUSCLE GROUP -->
          <template #[`item.muscleGroup`]="{ item }">
            <v-chip
              v-if="editingCell?.itemId !== item.id || editingCell?.field !== 'muscleGroup'"
              :color="getMuscleGroupColor(item.muscleGroup)"
              dark
              @click="startEdit(item, 'muscleGroup')"
              style="cursor: pointer"
            >
              {{ item.muscleGroup }}
            </v-chip>
            <v-text-field
              v-else
              v-model="editValue"
              @blur="saveEdit(item, 'muscleGroup')"
              @keyup.enter="saveEdit(item, 'muscleGroup')"
              @keyup.esc="cancelEdit"
              autofocus
              dense
              hide-details
              style="max-width: 150px"
            ></v-text-field>
          </template>
          <!-- KILOS -->
          <template #[`item.kilos`]="{ item }">
            <v-chip
              v-if="editingCell?.itemId !== item.id || editingCell?.field !== 'kilos'"
              :color="getKilosColor(item.kilos)"
              dark
              @click="startEdit(item, 'kilos')"
              style="cursor: pointer"
            >
              {{ item.kilos }}
            </v-chip>
            <v-text-field
              v-else
              v-model="editValue"
              @blur="saveEdit(item, 'kilos')"
              @keyup.enter="saveEdit(item, 'kilos')"
              @keyup.esc="cancelEdit"
              autofocus
              dense
              hide-details
              type="number"
              style="max-width: 100px"
            ></v-text-field>
          </template>
          <!-- REPS -->
          <template #[`item.reps`]="{ item }">
            <span
              v-if="editingCell?.itemId !== item.id || editingCell?.field !== 'reps'"
              @click="startEdit(item, 'reps')"
              style="cursor: pointer; text-decoration: underline"
            >
              {{ item.reps }}
            </span>
            <v-text-field
              v-else
              v-model="editValue"
              @blur="saveEdit(item, 'reps')"
              @keyup.enter="saveEdit(item, 'reps')"
              @keyup.esc="cancelEdit"
              autofocus
              dense
              hide-details
              type="number"
              style="max-width: 100px"
            ></v-text-field>
          </template>
          <!-- CREATED AT -->
          <template #[`item.createdAt`]="{ item }">
            <span
              v-if="editingCell?.itemId !== item.id || editingCell?.field !== 'createdAt'"
              @click="startEdit(item, 'createdAt')"
              style="cursor: pointer; text-decoration: underline"
            >
              {{ item.createdAt }}
            </span>
            <v-text-field
              v-else
              v-model="editValue"
              @blur="saveEdit(item, 'createdAt')"
              @keyup.enter="saveEdit(item, 'createdAt')"
              @keyup.esc="cancelEdit"
              autofocus
              dense
              hide-details
              style="max-width: 200px"
            ></v-text-field>
          </template>
          <!-- METADATA -->
          <template #[`item.metadataJson`]="{ item }">
            <span
              v-if="editingCell?.itemId !== item.id || editingCell?.field !== 'metadataJson'"
              @click="startEdit(item, 'metadataJson')"
              style="cursor: pointer; text-decoration: underline"
            >
              {{ item.metadataJson }}
            </span>
            <v-text-field
              v-else
              v-model="editValue"
              @blur="saveEdit(item, 'metadataJson')"
              @keyup.enter="saveEdit(item, 'metadataJson')"
              @keyup.esc="cancelEdit"
              autofocus
              dense
              hide-details
              style="max-width: 200px"
            ></v-text-field>
          </template>
          <template #[`item.isTesting`]="{ item }">
            <v-chip :color="item.isTesting === 'yes' ? 'gray' : 'green'">
              {{ item.isTesting }}
            </v-chip>
          </template>
          <template #[`item.actions`]="{ item }">
            <v-icon size="small" class="mr-2" @click="editExercise(item)">
              mdi-pencil
            </v-icon>
            <v-icon size="small" @click="deleteExercise(item)">mdi-delete</v-icon>
          </template>
        </v-data-table>
    </div>
    <div v-else style="text-align: left">
      <!-- used for small devices, ability to show exercises log in a simple list instead of a table -->
      <v-list density="compact" style="border-radius: 5px">
        <template v-for="(exercise, index) in stats" :key="exercise.id">
          <v-divider v-if="index > 0" class="ma-0"></v-divider>
          <v-list-item>
            <template v-slot:prepend>
              <v-chip
                :color="getColorFromName(exercise.exerciseName)"
                :style="{
                  color: getTextColor(getColorFromName(exercise.exerciseName)),
                }"
                size="small"
                class="mt-2"
              >
                {{ index + 1 }}
              </v-chip>
            </template>
            <v-list-item-title>
              {{ exercise.exerciseName }}
            </v-list-item-title>
            <v-list-item-subtitle style="font-size: 0.8em">
              {{ new Date(exercise.createdAt).toLocaleString() }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              {{ muscleGroupToText[exercise.muscleGroup] }}
              <v-chip size="small" color="blue lighten-1" class="ml-1">
                {{ exercise.kilos }} kg
              </v-chip>
              <v-chip size="small" color="blue lighten-4" class="ml-1">
                {{ exercise.reps }} reps
              </v-chip>
            </v-list-item-subtitle>
          </v-list-item>
        </template>
      </v-list>
    </div>

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
  </v-container>
</template>

<style scoped>
#data-table {
  padding: 20px;
  margin-bottom: 100px;
  background: #26c6da;
  border-radius: 4px;
}

/* Improve table row colors for better visibility */
#data-table :deep(.v-data-table__tbody tr) {
  background-color: rgba(255, 255, 255, 0.1);
}

#data-table :deep(.v-data-table__tbody tr:hover) {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Better text contrast in table */
#data-table :deep(.v-data-table__tbody td) {
  color: #ffffff;
  font-weight: 500;
}

/* Header styling */
#data-table :deep(.v-data-table__thead th) {
  background-color: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-weight: 600;
}
</style>

<script>
import AddExercise from '@/components/gymstats/AddExercise.vue'
import GymStatsData from '@/gymstats'
import axios from 'axios'
import { loggedIn } from '@/composables/useAuth'

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
      editingCell: null, // Track which cell is being edited: {itemId, field}
      editValue: '', // Temporary value while editing
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
      // Check if user is logged in using composable
      if (!loggedIn.value) {
        this.loadingData = false
        this.stats = []
        return
      }

      this.loadingData = true

      const storedItemsPerPageInput = localStorage.getItem('itemsPerPageInput')
      if (storedItemsPerPageInput) {
        this.itemsPerPage = parseInt(storedItemsPerPageInput)
      }

      this.itemsPerPageInput = String(this.itemsPerPage)

      const vm = this
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT +
            `/gymstats/list/page/${vm.page}/size/${vm.itemsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('getExercises - received null response / data')
            vm.stats = []
            vm.loadingData = false
            return
          }
          console.log('getExercises - received response:', response.data)
          vm.handleStatsResp(response)
        })
        .catch((error) => {
          console.error('getExercises - error:', error)
          vm.stats = []
          vm.loadingData = false
        })
        .finally(() => {
          vm.loadingData = false
          console.log('getExercises - loadingData set to false, stats length:', vm.stats?.length)
        })
    },

    editExercise(exercise) {
      console.warn('will edit exercise', exercise)
      // TODO: implement
    },

    startEdit(item, field) {
      this.editingCell = { itemId: item.id, field }
      this.editValue = item[field]
    },

    cancelEdit() {
      this.editingCell = null
      this.editValue = ''
    },

    saveEdit(item, field) {
      if (this.editValue !== item[field]) {
        item[field] = this.editValue
        this.saveExercise(item)
      }
      this.cancelEdit()
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
        .put(import.meta.env.VITE_API_ENDPOINT + `/gymstats`, requestBody, {
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
        .delete(
          import.meta.env.VITE_API_ENDPOINT + `/gymstats/${exercise.id}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
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
          import.meta.env.VITE_API_ENDPOINT +
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
