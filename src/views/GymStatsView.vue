<template>
  <v-container>
    <h2>💪 GymStats 💪</h2>

    <template>
      <v-data-table
        id="data-table"
        :headers="headers"
        :items="stats"
        :items-per-page="itemsPerPage"
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
            :color="item.isTesting === 'yes' ? 'red' : 'green'"
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
      itemsPerPage: 150,
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
      ],
      stats: [],
      total: 0,
    }
  },

  mounted: function () {
    if (!this.$root.loggedIn) {
      return
    }

    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/gymstats/list/page/1/size/200', {
        headers: {
          'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
        }
      })
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get all urls - received null response / data')
          return
        }
        vm.stats = response.data.exercises
        vm.total = response.data.total

        for (let i = 0; i < vm.stats.length; i++) {
          vm.stats[i].metadataJson = JSON.stringify(vm.stats[i].metadata)
          vm.stats[i].isTesting = vm.stats[i].metadata.isTesting ? 'yes' : 'no'
        }
      })
      .catch((error) => {
        console.log(error)
      })
  },

  methods: {
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
