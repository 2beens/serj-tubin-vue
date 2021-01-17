<template>
  <div id="visits-main">
    <div v-for="visit in visits" :key="visit.id">
      <div class="visit" v-bind:id="'visit-' + visit.id">
        <v-row>
          <v-col cols="10" class="text-left pa-md-0">
            <p class="visit-url">{{ visit.url }}</p>
          </v-col>
          <v-col cols="2" class="pa-md-0">
            <p class="visit-timestamp">{{ visit.timestamp }}</p>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'NetlogVisits',
  data: function () {
    return {
      visits: []
    }
  },
  methods: {
    removeMe (page) {
      console.log(this.visits.length)
    }
  },
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/netlog/')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('all blogs - received null response / data')
          return
        }
        vm.visits = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
#visits-main {
  margin-left: 30px;
}
.visit {
  /* border-bottom: 1px solid white; */
}
</style>
