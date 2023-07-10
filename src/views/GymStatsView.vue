<template>
  <v-container>
    <h2>💪 GymStats 💪</h2>

    <v-row>
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
      <v-col cols="8">
        <v-pagination
          style="margin-top: 30px; margin-bottom: 15px"
          v-if="stats && stats.length > 0"
          v-model="page"
          :length="paginationLen"
          :total-visible="7"
          @input="onPageChange"
        />
      </v-col>
      <v-col cols="2">
        <AddExercise @exercise-added="getExercises" style="margin-top: 30px; margin-right: 40px" />
      </v-col>
    </v-row>

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
        <template v-slot:item.exerciseId="{ item }">
          <v-edit-dialog :return-value.sync="item.exerciseId" @save="saveExercise(item)">
            {{ item.exerciseId }}
            <template v-slot:input>
              <v-text-field v-model="item.exerciseId" label="Edit" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <!-- MUSCLE GROUP -->
        <template v-slot:item.muscleGroup="{ item }">
          <v-edit-dialog :return-value.sync="item.muscleGroup" @save="saveExercise(item)">
            <v-chip :color="getMuscleGroupColor(item.muscleGroup)" dark>
              {{ item.muscleGroup }}
            </v-chip>
            <template v-slot:input>
              <v-text-field v-model="item.muscleGroup" label="Edit" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <!-- KILOS -->
        <template v-slot:item.kilos="{ item }">
          <v-edit-dialog :return-value.sync="item.kilos" @save="saveExercise(item)">
            <v-chip :color="getKilosColor(item.kilos)" dark>
              {{ item.kilos }}
            </v-chip>
            <template v-slot:input>
              <v-text-field v-model="item.kilos" label="Edit" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <!-- REPS -->
        <template v-slot:item.reps="{ item }">
          <v-edit-dialog :return-value.sync="item.reps" @save="saveExercise(item)">
            {{ item.reps }}
            <template v-slot:input>
              <v-text-field v-model="item.reps" label="Edit" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <!-- CREATED AT -->
        <template v-slot:item.createdAt="{ item }">
          <v-edit-dialog :return-value.sync="item.createdAt" @save="saveExercise(item)">
            {{ item.createdAt }}
            <template v-slot:input>
              <v-text-field v-model="item.createdAt" label="Edit" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <!-- METADATA -->
        <template v-slot:item.metadataJson="{ item }">
          <v-edit-dialog :return-value.sync="item.metadataJson" @save="saveExercise(item)">
            {{ item.metadataJson }}
            <template v-slot:input>
              <v-text-field v-model="item.metadataJson" label="Edit" single-line></v-text-field>
            </template>
          </v-edit-dialog>
        </template>
        <template v-slot:item.isTesting="{ item }">
          <v-chip :color="item.isTesting === 'yes' ? 'gray' : 'green'" dark>
            {{ item.isTesting }}
          </v-chip>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon small class="mr-2" @click="editExercise(item)"> mdi-pencil </v-icon>
          <v-icon small @click="deleteExercise(item)"> mdi-delete </v-icon>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<style scoped>
h1,
h2,
h3,
h4,
h5 {
  color: #26c6da;
}

#data-table {
  padding: 20px;
  margin-bottom: 100px;
  background: #26c6da;
}
</style>

<script scoped>
import AddExercise from '@/components/gymstats/AddExercise.vue'
import axios from 'axios'

export default {
  name: 'GymStatsView',
  components: {
    AddExercise
  },

  data() {
    return {
      page: 1,
      paginationLen: 0,
      itemsPerPageInput: String,
      itemsPerPage: 50,
      stats: [],
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id'
        },
        { text: 'Exercise', value: 'exerciseId' },
        { text: 'Muscle Group', value: 'muscleGroup' },
        { text: 'Kilos', value: 'kilos' },
        { text: 'Reps', value: 'reps' },
        { text: 'At', value: 'createdAt' },
        { text: 'Metadata', value: 'metadataJson' },
        { text: 'IsTesting', value: 'isTesting' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },

  mounted: function () {
    this.getExercises()
  },

  methods: {
    getExercises() {
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
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
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
        metadata: JSON.parse(exercise.metadataJson)
      }

      const vm = this
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + `/gymstats/${exercise.id}`, requestBody, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('save exercise - received null response / data')
            return
          }
          vm.getExercises()
        })
        .catch((error) => {
          console.log(error)
        })
    },

    deleteExercise(exercise) {
      if (
        !confirm(
          `Are you sure you want to delete exercise: [' ${exercise.id} '] ${exercise.exerciseId} ?`
        )
      ) {
        return
      }

      const vm = this
      axios
        .delete(process.env.VUE_APP_API_ENDPOINT + `/gymstats/${exercise.id}`, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete exercise - received null response / data')
            return
          }
          vm.getExercises()
        })
        .catch((error) => {
          console.log(error)
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
          process.env.VUE_APP_API_ENDPOINT + `/gymstats/list/page/${page}/size/${vm.itemsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
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
        this.stats[i].isTesting = this.stats[i].metadata.testing === 'true' ? 'yes' : 'no'
      }
      this.paginationLen = Math.ceil(response.data.total / this.itemsPerPage)
      console.log('new pagination len: ' + this.paginationLen)
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
    }
  }
}
</script>
