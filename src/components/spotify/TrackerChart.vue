<template>
  <v-container>
    <v-divider :thickness="3" color="#54ab80"></v-divider>
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
    <v-divider :thickness="3" color="#54ab80"></v-divider>
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
      console.log('timestamps', this.timestamps)
      // here we iterate over the timestamps and create a dataset from them, based on the resolution
      // any timestamp that is not in the range of the "fromTimestamp" and "toTimestamp" will be ignored

      // to create lables, we use the range of "fromTimestamp" to "toTimestamp", based on the resolution

      var chartLabels = []
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

      console.log('chartLabels', chartLabels)

      var chartData = []
      // now we iterate over the timestamps and create the chart data based on the resolution
      // e.g. if the resolution is a year, we only check the year of the timestamp, and increase the value of that year
      this.timestamps.forEach((timestamp) => {
        const date = new Date(timestamp)
        if (this.resolution === 'year') {
          const year = date.getFullYear()
          const index = chartLabels.indexOf(year)
          if (index === -1) {
            return
          }
          if (chartData[index] === undefined) {
            chartData[index] = 1
          } else {
            chartData[index]++
          }
        } else if (this.resolution === 'month') {
          const month = `${String(date.getMonth() + 1).padStart(
            2,
            '0'
          )}-${date.getFullYear()}`
          const index = chartLabels.indexOf(month)
          if (index === -1) {
            return
          }
          if (chartData[index] === undefined) {
            chartData[index] = 1
          } else {
            chartData[index]++
          }
        } else if (this.resolution === 'day') {
          const day = date.toLocaleString('default', { day: 'numeric' })
          const index = chartLabels.indexOf(day)
          if (index === -1) {
            return
          }
          if (chartData[index] === undefined) {
            chartData[index] = 1
          } else {
            chartData[index]++
          }
        }
      })

      // for each label (year, month, day), we create a bucket/value in the chartData array
      // if the resolution is 'year', for each year of the timestamp, we increase the value of that bucket/value by 1
      // if the resolution is 'month', for each month of the timestamp, we increase the value of that bucket/value by 1
      // if the resolution is 'day', for each day of the timestamp, we increase the value of that bucket/value by 1
      // we will show the whole timestamp on the x-axis, and the value on the y-axis, regardless of the timestamps

      this.chart = {
        labels: chartLabels,
        datasets: [
          {
            label: `Songs played`,
            // backgroundColor: 'hsl(180,100%,50%)',
            data: chartData,
          },
        ],
      }
    },
  },
}
</script>
