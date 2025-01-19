<template>
  <v-container>
    <v-row>
      <v-col>
        <Bar
          :options="chartOptions"
          :data="chart"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-text-field
          v-model="fromTimestamp"
          label="From"
          type="string"
          outlined
        ></v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="toTimestamp"
          label="To"
          type="string"
          outlined
        ></v-text-field>
      </v-col>
      <v-col>
        <v-select
          v-model="resolution"
          :items="['year', 'month', 'day']"
          label="Resolution"
          outlined
        ></v-select>
      </v-col>
      <v-col>
        <v-btn @click="refresh">Refresh</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  name: 'TrackerChart',
  components: { Bar },

  // props will be: an array of timestamps that we will use to fill the chart with data
  props: {
    timestamps: {
      type: Array,
      required: true,
    },
    chartId: {
      type: String,
      default: 'bar-chart',
    },
    datasetIdKey: {
      type: String,
      default: 'label',
    },
    width: {
      type: Number,
      default: 400,
    },
    height: {
      type: Number,
      default: 400,
    },
    cssClasses: {
      default: '',
      type: String,
    },
    styles: {
      type: Object,
      default: () => {},
    },
    plugins: {
      type: Array,
      default: () => [],
    },
  },

  // default chart timeline will be from the first record (2004) to the current year
  data: function () {
    const year2004 = new Date(2004, 0, 1)
    const today = new Date()
    return {
      // convert to string format: day-month-year
      fromTimestamp: year2004.toISOString().split('T')[0],
      toTimestamp: today.toISOString().split('T')[0],
      resolution: 'year', // can be 'year', 'month', 'day'
      chartOptions: {
        responsive: true,
      },
      chart: {
        labels: [],
        datasets: [],
      },
    }
  },

  mounted() {
    this.refresh()
  },

  methods: {
    refresh() {
      const chartLabels = this.generateChartLabels()
      const chartData = this.generateChartData(chartLabels)
      const backgroundColors = this.getBarColors(chartData)
      this.chart = {
        labels: chartLabels,
        datasets: [
          {
            label: `Timeline of the songs played`,
            backgroundColor: backgroundColors,
            data: chartData,
          },
        ],
      }
    },

    generateChartLabels() {
      let chartLabels = []
      if (this.resolution === 'year') {
        chartLabels = Array.from(
          {
            length:
              new Date(this.toTimestamp).getFullYear() -
              new Date(this.fromTimestamp).getFullYear() +
              1,
          },
          (_, i) => new Date(this.fromTimestamp).getFullYear() + i
        )
      } else if (this.resolution === 'month') {
        const from = new Date(this.fromTimestamp)
        const to = new Date(this.toTimestamp)
        const months =
          (to.getFullYear() - from.getFullYear()) * 12 +
          to.getMonth() -
          from.getMonth()
        chartLabels = Array.from({ length: months + 1 }, (_, i) => {
          const date = new Date(from)
          date.setMonth(date.getMonth() + i)
          return `${String(date.getMonth() + 1).padStart(
            2,
            '0'
          )}-${date.getFullYear()}`
        })
      } else if (this.resolution === 'day') {
        const from = new Date(this.fromTimestamp)
        const to = new Date(this.toTimestamp)
        const days = Math.floor((to - from) / (1000 * 60 * 60 * 24))
        chartLabels = Array.from({ length: days + 1 }, (_, i) => {
          const date = new Date(from)
          date.setDate(date.getDate() + i)
          return date.toLocaleString('default', { day: 'numeric' })
        })
      }
      return chartLabels
    },

    generateChartData(chartLabels) {
      const chartData = new Array(chartLabels.length).fill(0)
      this.timestamps.forEach((timestamp) => {
        const date = new Date(timestamp)
        if (this.resolution === 'year') {
          const year = date.getFullYear()
          const index = chartLabels.indexOf(year)
          if (index === -1) {
            return
          }
          chartData[index]++
        } else if (this.resolution === 'month') {
          const month = `${String(date.getMonth() + 1).padStart(
            2,
            '0'
          )}-${date.getFullYear()}`
          const index = chartLabels.indexOf(month)
          if (index === -1) {
            return
          }
          chartData[index]++
        } else if (this.resolution === 'day') {
          const day = date.toLocaleString('default', { day: 'numeric' })
          const index = chartLabels.indexOf(day)
          if (index === -1) {
            return
          }
          chartData[index]++
        }
      })
      return chartData
    },

    getBarColors(chartData) {
      const backgroundColors = []
      const maxDataValue = Math.max(...chartData)
      chartData.forEach((value) => {
        const hue = (value / maxDataValue) * 120 // 0 (red) to 120 (green)
        backgroundColors.push(`hsl(${hue}, 100%, 50%)`)
      })
      return backgroundColors
    },
  },
}
</script>
