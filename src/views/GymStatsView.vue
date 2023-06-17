<template>
  <v-container>
    <h2>💪 GymStats 💪</h2>

    <!-- PAGINATION HERE -->
    <v-pagination
      style="margin-top: 30px; margin-bottom: 15px;"
      v-if="stats && stats.length > 0"
      v-model="page"
      :length="paginationLen"
      :total-visible="7"
      @input="onPageChange"
    />

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
        <template v-slot:item.kilos="{ item }">
          <v-chip
            :color="getKilosColor(item.kilos)"
            dark
          >
            {{ item.kilos }}
          </v-chip>
        </template>
        <template v-slot:item.muscleGroup="{ item }">
          <v-chip
            :color="getMuscleGroupColor(item.muscleGroup)"
            dark
          >
            {{ item.muscleGroup }}
          </v-chip>
        </template>
        <template v-slot:item.isTesting="{ item }">
          <v-chip
            :color="item.isTesting === 'yes' ? 'gray' : 'green'"
            dark
          >
            {{ item.isTesting }}
          </v-chip>
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
import axios from "axios";

export default {
  name: 'GymStatsView',

  data() {
    return {
      page: 1,
      paginationLen: 0,
      itemsPerPage: 50,
      stats: [],
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        {text: 'Exercise', value: 'exerciseId'},
        {text: 'Muscle Group', value: 'muscleGroup'},
        {text: 'Kilos', value: 'kilos'},
        {text: 'Reps', value: 'reps'},
        {text: 'At', value: 'createdAt'},
        {text: 'Metadata', value: 'metadataJson'},
        {text: 'IsTesting', value: 'isTesting'},
      ]
    }
  },

  mounted: function () {
    if (!this.$root.loggedIn) {
      return
    }

    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + `/gymstats/list/page/${vm.page}/size/${vm.itemsPerPage}`, {
        headers: {
          'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
        }
      })
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

  methods: {
    onPageChange(page) {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + `/gymstats/list/page/${page}/size/${vm.itemsPerPage}`, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
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
