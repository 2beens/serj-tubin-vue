<template>
  <Bar
    v-if="loaded"
    id="avg-set-duration-chart"
    :options="chartOptions"
    :data="chartData"
  />
</template>

<script>
import axios from 'axios'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'AvgSetDuration',
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
    this.refreshData()
  },

  methods: {
    refreshData() {
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT + `/gymstats/sets/avgduration`, {
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
