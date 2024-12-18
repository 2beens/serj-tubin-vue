<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <h1>Spotify Tracker</h1>
        <h3>
          Status:
          <strong>{{ status }}</strong>
        </h3>
        <h4 v-if="message">Message: {{ message }}</h4>
        <v-btn color="primary" :href="authUrl" target="_blank">
          Init Tracker
        </v-btn>
        <v-divider></v-divider>

        <v-divider></v-divider>
        <v-form id="input-field">
          <v-row>
            <v-col cols="4" sm="4">
              <v-text-field v-model="authUrl" label="Auth URL" outlined />
            </v-col>

            <!-- add vertical divider now -->
            <v-col cols="1" sm="1">
              <v-divider vertical></v-divider>
            </v-col>

            <v-col cols="3" sm="3">
              <v-text-field v-model="page" label="Page" outlined />
            </v-col>

            <v-col cols="3" sm="3">
              <v-text-field v-model="size" label="Size" outlined />
            </v-col>
            <v-col cols="1" sm="1">
              <!-- a call to: /spotify/page/{page}/size/{size} on backend -->
              <v-btn style="margin-top: 7px" @click="getPageFromDB">
                Get from DB
              </v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2" sm="2">
              <v-btn color="success" @click="startTracker">Start Tracker</v-btn>
            </v-col>
            <v-col cols="2" sm="2">
              <v-btn color="error" @click="stopTracker">Stop Tracker</v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-divider></v-divider>
        <v-row style="margin-bottom: 100px">
          <v-col>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Played At</th>
                    <th class="text-left">Artists</th>
                    <th class="text-left">Name</th>
                    <th class="text-left">ID</th>
                    <th class="text-left">Album</th>
                    <th class="text-left">Duration</th>
                    <th class="text-left">Explicit</th>
                    <th class="text-left">External URLs</th>
                    <th class="text-left">Endpoint</th>
                    <th class="text-left">Spotify ID</th>
                    <th class="text-left">URI</th>
                    <th class="text-left">Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="trackRecord in trackRecords" :key="trackRecord.id">
                    <td>{{ trackRecord.played_at }}</td>
                    <td>{{ trackRecord.artists }}</td>
                    <td>{{ trackRecord.name }}</td>
                    <td>{{ trackRecord.id }}</td>
                    <td>{{ trackRecord.album }}</td>
                    <td>{{ trackRecord.duration }}</td>
                    <td>{{ trackRecord.explicit }}</td>
                    <td>{{ trackRecord.external_urls }}</td>
                    <td>{{ trackRecord.endpoint }}</td>
                    <td>{{ trackRecord.spotify_id }}</td>
                    <td>{{ trackRecord.uri }}</td>
                    <td>{{ trackRecord.type }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
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
      authUrl: process.env.VUE_APP_API_ENDPOINT + '/spotify/auth?token=todo',
      page: 1,
      size: 10,
      trackRecords: [],
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
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all notes - received null response / data')
            return
          }
          vm.status = response.data.status
          vm.message = response.data.message
          console.log(
            `get tracker status: received ${vm.status} status and message: ${vm.message}`
          )
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
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all notes - received null response / data')
            return
          }
          vm.status = response.data.status
          vm.message = response.data.message
          console.log(
            `start tracker: received ${vm.status} status and message: ${vm.message}`
          )
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
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all notes - received null response / data')
            return
          }
          vm.status = response.data.status
          vm.message = response.data.message
          console.log(
            `stop tracker: received ${vm.status} status and message: ${vm.message}`
          )
        })
        .catch((error) => {
          vm.status = error.response.data.status
          vm.message = error.response.data.message
          console.log(error)
        })
    },

    getPageFromDB() {
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            '/spotify/page/' +
            this.page +
            '/size/' +
            this.size,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all notes - received null response / data')
            return
          }
          vm.trackRecords = response.data
          console.log(
            `get page from db: received ${vm.trackRecords.length} records`
          )
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>

<style scoped>
h1,
h2,
h3,
h4,
h5 {
  color: #26c6da;
}

#input-field {
  padding: 15px 80px 15px 15px;
  background: #26c6da;
  color: white;
  border-radius: 10px;
  margin-left: 10%;
  margin-right: 10%;
}
</style>
