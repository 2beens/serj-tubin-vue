<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Spotify Tracker</h1>
        <p>
          Status: <strong>{{ status }}</strong>
        </p>
        <p v-if="message">Message: {{ message }}</p>
        <v-btn color="primary" :href="authUrl" target="_blank"> Init Tracker </v-btn>
        <v-divider></v-divider>
        <v-card>
          <v-card-text>
            <v-text-field v-model="authUrl" label="Auth URL" outlined></v-text-field>
          </v-card-text>
        </v-card>
        <v-divider></v-divider>
        <v-btn color="success" @click="startTracker">Start Tracker</v-btn>
        <v-btn color="error" @click="stopTracker">Stop Tracker</v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SpotifyTrackerView',

  data: function () {
    return {
      // status can be 'running' or 'stopped'
      status: 'loading...',
      // message is at the moment returned only if the tracker is stopped with an error/reason
      message: '',
      authUrl: process.env.VUE_APP_API_ENDPOINT + '/spotify/auth?token=TODO'
    }
  },

  mounted: function () {
    this.getTrackerStatus()
  },

  methods: {
    getTrackerStatus() {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + '/spotify/tracker/status', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all notes - received null response / data')
            return
          }
          vm.status = response.data.status
          vm.message = response.data.message
          console.log(`get tracker status: received ${vm.status} status and message: ${vm.message}`)
        })
        .catch((error) => {
          console.log(error)
        })
    },

    startTracker() {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + '/spotify/tracker/start', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all notes - received null response / data')
            return
          }
          vm.status = response.data.status
          vm.message = response.data.message
          console.log(`start tracker: received ${vm.status} status and message: ${vm.message}`)
        })
        .catch((error) => {
          vm.status = error.response.data.status
          vm.message = error.response.data.message
          console.log(error)
        })
    },

    stopTracker() {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + '/spotify/tracker/stop', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all notes - received null response / data')
            return
          }
          vm.status = response.data.status
          vm.message = response.data.message
          console.log(`stop tracker: received ${vm.status} status and message: ${vm.message}`)
        })
        .catch((error) => {
          vm.status = error.response.data.status
          vm.message = error.response.data.message
          console.log(error)
        })
    }
  }
}
</script>