<template>
  <v-container>
    <v-divider :thickness="3" color="#54ab80"></v-divider>
    <v-row>
      <v-col>
        <Bar v-if="loaded" id="avg-set-duration-chart" :options="chartOptions" :data="chartData" />
      </v-col>
    </v-row>
    <v-divider :thickness="3" color="#54ab80"></v-divider>
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

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'ExerciseStats',
  components: { Bar },

  data: function () {
    return {
      loaded: false,
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
          const durationPerDayMinutes = []
          const backgroundColors = []
          Object.keys(response.data.durationPerDay).forEach((key) => {
            const dayOnly = key.split('T')[0]
            const durationInMinutes = response.data.durationPerDay[key] / 1000000000 / 60
            durationPerDayMinutes.push(durationInMinutes)
            dayLabels.push(dayOnly)

            // Calculate color based on duration
            const hue =
              180 *
              (1 - Math.min(Math.max((durationInMinutes - 1.5) / (3 - 1.8), 0), 1))
            backgroundColors.push(['hsl(', hue, ',100%,50%)'].join(''))
          })

          vm.chartData = {
            labels: dayLabels,
            datasets: [
              {
                label: `Duration [avg total ${response.data.duration / 1000000000 / 60} min]`,
                backgroundColor: backgroundColors,
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
