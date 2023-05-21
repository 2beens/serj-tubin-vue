<template>
  <v-container>
    <h2>💪 GymStats 💪</h2>

    <template>
      <v-data-table
        :headers="headers"
        :items="stats"
        items-per-page="50"
        class="elevation-1"
      >
        <template v-slot:item.kilos="{ item }">
          <v-chip
            color="green"
            dark
          >
            {{ item.kilos }}
          </v-chip>
        </template>
      </v-data-table>
    </template>
  </v-container>
</template>

<script scoped>
import axios from "axios";

export default {
  name: 'GymStatsView',

  data () {
    return {
      headers: [
        {
          text: 'ID',
          align: 'start',
          sortable: true,
          value: 'id',
        },
        { text: 'Exercise', value: 'exerciseId' },
        { text: 'Muscle Group', value: 'muscleGroup' },
        { text: 'Kilos', value: 'kilos' },
        { text: 'Reps', value: 'reps' },
        { text: 'At', value: 'createdAt' },
        { text: 'Metadata', value: 'metadata' },
      ],
      stats: [],
    }
  },

  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/gymstats/list', {
        headers: {
          'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
        }
      })
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get all urls - received null response / data')
          return
        }
        vm.stats = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },

  methods: {
    getColor (calories) {
      if (calories > 400) return 'red'
      else if (calories > 200) return 'orange'
      else return 'green'
    },
  },
}
</script>
