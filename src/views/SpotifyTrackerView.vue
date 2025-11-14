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

            <v-col cols="1" sm="1">
              <v-text-field
                v-model="page"
                label="Page"
                outlined
                @keyup.enter="getPageFromDB"
              />
            </v-col>

            <v-col cols="1" sm="1">
              <v-text-field
                v-model="size"
                label="Size"
                outlined
                @keyup.enter="getPageFromDB"
              />
            </v-col>

            <v-col cols="4" sm="4">
              <v-text-field
                v-model="keywords"
                label="Search Keywords"
                outlined
                @keyup.enter="getPageFromDB"
              />
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
            <v-col cols="2" sm="2">
              <v-btn color="warning" @click="runNow">Run now!</v-btn>
            </v-col>
            <v-col cols="1" sm="1">
              <v-divider vertical></v-divider>
            </v-col>
            <v-col cols="2" sm="2">Periodic tracker check:</v-col>
            <v-col cols="1" sm="1">
              <v-btn color="success" @click="enablePeriodicCheck">Enable</v-btn>
            </v-col>
            <v-col cols="1" sm="1">
              <v-btn color="error" @click="disablePeriodicCheck">Disable</v-btn>
            </v-col>
          </v-row>
        </v-form>

        <v-divider></v-divider>
        <v-row v-if="loadingTableData" id="loading-data-chart-skeleton">
          <v-col>
            <v-skeleton-loader type="sentences"></v-skeleton-loader>
            <v-skeleton-loader type="table-heading"></v-skeleton-loader>
            <v-skeleton-loader type="table-tbody"></v-skeleton-loader>
            <v-skeleton-loader type="sentences"></v-skeleton-loader>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col>
            <v-card id="chart-card">
              <TrackerChart
                :timestamps="trackRecordsTimestamps"
                :height="120"
              />
            </v-card>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <v-row>
          <v-col>
            <v-card id="table-row-card">
              <v-card-title>
                <v-text-field
                  v-model="searchString"
                  append-icon="mdi-magnify"
                  label="Search"
                  single-line
                  hide-details
                />
              </v-card-title>

              <v-data-table
                id="data-table"
                :headers="headers"
                :items="trackRecords"
                :search="searchString"
                :loading="loadingTableData"
                loading-text="Loading... Please wait"
                :items-per-page="Number(size)"
              >
                <template #[`item.played_at`]="props">
                  <v-chip color="primary">
                    {{ new Date(props.item.played_at).toLocaleString() }}
                  </v-chip>
                </template>
                <template #[`item.artists`]="props">
                  <v-chip
                    v-for="(artist, index) in props.item.artists"
                    :key="index"
                    color="green"
                  >
                    {{ artist }}
                  </v-chip>
                </template>
                <template #[`item.name`]="props">
                  <strong>{{ props.item.name }}</strong>
                </template>
                <template #[`item.id`]="props">
                  {{ props.item.id }}
                </template>
                <template #[`item.album`]="props">
                  {{ props.item.album }}
                </template>
                <template #[`item.album_images`]="props">
                  <v-img
                    v-if="props.item.album_images.length > 0"
                    :src="
                      props.item.album_images[
                        props.item.album_images.length - 1
                      ].url
                    "
                    max-width="50"
                    max-height="50"
                    class="mr-2"
                  />
                </template>
                <template #[`item.release_date`]="props">
                  {{ new Date(props.item.release_date).toLocaleDateString() }}
                </template>
                <template #[`item.duration_ms`]="props">
                  {{ Math.floor(props.item.duration_ms / 60000) }}:{{
                    ((props.item.duration_ms % 60000) / 1000).toFixed(0)
                  }}
                </template>
                <template #[`item.explicit`]="props">
                  {{ props.item.explicit }}
                </template>
                <template #[`item.external_urls`]="props">
                  <v-chip
                    v-if="
                      props.item.external_urls &&
                      props.item.external_urls.spotify
                    "
                    color="blue"
                    :href="props.item.external_urls.spotify"
                    target="_blank"
                  >
                    link>
                  </v-chip>
                  <v-chip v-else color="blue">
                    {{ props.item.external_urls }}
                  </v-chip>
                </template>
                <template #[`item.source`]="props">
                  {{ props.item.source }}
                </template>
                <template #[`item.endpoint`]="props">
                  {{ props.item.endpoint }}
                </template>
                <template #[`item.spotify_id`]="props">
                  {{ props.item.spotify_id }}
                </template>
                <template #[`item.uri`]="props">
                  {{ props.item.uri }}
                </template>
                <template #[`item.type`]="props">
                  {{ props.item.type }}
                </template>
              </v-data-table>
            </v-card>
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

  components: {
    TrackerChart: () => import('@/components/spotify/TrackerChart.vue'),
  },

  data: function () {
    return {
      // status can be 'running' or 'stopped'
      status: 'loading...',
      // message is at the moment returned only if the tracker is stopped with an error/reason
      message: '',
      authUrl: import.meta.env.VITE_API_ENDPOINT + '/spotify/auth?token=todo',
      page: 1,
      size: 25,
      // keywords is a string that can be used to search for a track in the table
      // by artist and track name; it is a space separated list of keywords
      keywords: '',
      trackRecords: [],
      trackRecordsTimestamps: [],
      searchString: '',
      loadingTableData: false,
      headers: [
        { text: 'Played At', value: 'played_at' },
        { text: 'Artists', value: 'artists' },
        { text: 'Name', value: 'name' },
        { text: 'ID', value: 'id' },
        { text: 'Album', value: 'album' },
        { text: 'Album Images', value: 'album_images' },
        { text: 'Release Date', value: 'release_date' },
        { text: 'Duration', value: 'duration_ms' },
        { text: 'Explicit', value: 'explicit' },
        { text: 'External URLs', value: 'external_urls' },
        { text: 'Source', value: 'source' },
        { text: 'Endpoint', value: 'endpoint' },
        { text: 'Spotify ID', value: 'spotify_id' },
        { text: 'URI', value: 'uri' },
        { text: 'Type', value: 'type' },
      ],
    }
  },

  mounted: function () {
    this.getTrackerStatus()
    this.getPageFromDB()
  },

  methods: {
    getTrackerStatus() {
      const vm = this
      axios
        .get(import.meta.env.VITE_API_ENDPOINT + '/spotify/tracker/status', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('received null response / data')
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
        .get(import.meta.env.VITE_API_ENDPOINT + '/spotify/tracker/start', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('received null response / data')
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
        .get(import.meta.env.VITE_API_ENDPOINT + '/spotify/tracker/stop', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('received null response / data')
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

    // runNow is a function that invokes /spotify/tracker/run to get recent songs from Spotify right now,
    // in which case server will return no content 204 for success.
    runNow() {
      const vm = this
      axios
        .get(import.meta.env.VITE_API_ENDPOINT + '/spotify/tracker/run', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response.status === 204) {
            vm.status = 'running'
            vm.message = 'Tracker ran successfully'
            console.log('run now: Tracker ran successfully')
          } else {
            console.error('Unexpected response status:', response.status)
          }
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 400) {
              vm.status = 'stopped'
              vm.message = 'Tracker not running'
              console.log('run now: Tracker not running')
            } else if (error.response.status === 500) {
              vm.status = 'error'
              vm.message = `Failed to save recently played tracks: ${error.response.data}`
              console.log(
                `run now: Failed to save recently played tracks: ${error.response.data}`
              )
            } else {
              vm.status = 'error'
              vm.message = `Unexpected error: ${error.response.data}`
              console.log(`run now: Unexpected error: ${error.response.data}`)
            }
          } else {
            vm.status = 'error'
            vm.message = 'Network error'
            console.log('run now: Network error', error)
          }
        })
    },

    enablePeriodicCheck() {
      const vm = this
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT + '/spotify/tracker/check/enable',
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('received null response / data')
            return
          }
          vm.message = response.data.message
          console.log(
            `enable periodic check: received ${vm.status} status and message: ${vm.message}`
          )
        })
        .catch((error) => {
          vm.message = error.response.data.message
          console.log(error)
        })
    },

    disablePeriodicCheck() {
      const vm = this
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT + '/spotify/tracker/check/disable',
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('received null response / data')
            return
          }
          vm.message = response.data.message
          console.log(
            `disable periodic check: received ${vm.status} status and message: ${vm.message}`
          )
        })
        .catch((error) => {
          vm.message = error.response.data.message
          console.log(error)
        })
    },

    getPageFromDB() {
      this.loadingTableData = true
      const vm = this

      // Replace spaces with commas in the keywords string
      const keywordsParam = this.keywords.replace(/\s+/g, ',')

      axios
        .get(
          `${import.meta.env.VITE_API_ENDPOINT}/spotify/page/${this.page}/size/${this.size}?keywords=${keywordsParam}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.warn('get page from db - received null response / data')
            vm.trackRecords = []
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
        .finally(() => {
          this.loadingTableData = false

          // calculate timestamps from the trackRecords
          this.trackRecordsTimestamps = this.trackRecords.map(
            (record) => record.played_at
          )
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

#table-row-card {
  background: #26c6da;
  border-radius: 10px;
  margin-bottom: 60px;
  margin-left: 5%;
  margin-right: 5%;
}

#chart-card {
  background: #26c6da;
  border-radius: 10px;
  margin-left: 5%;
  margin-right: 5%;
  padding: 0px;
}

#loading-data-chart-skeleton {
  background: #26c6da;
  border-radius: 10px;
  margin-left: 5%;
  margin-right: 5%;
}

#data-table {
  padding: 20px;
  background: #26c6da;
}
</style>
