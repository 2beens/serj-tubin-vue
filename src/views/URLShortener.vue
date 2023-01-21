<template>
  <v-container v-if="this.$root.loggedIn">
    <h2>URL Shortener</h2>
    <h4>Fun fact: uses a service written in Rust</h4>

    <v-form id="input-field">
      <v-row>
        <v-col cols="8" sm="8">
          <v-text-field v-model="url" label="URL" outlined></v-text-field>
        </v-col>

        <v-col cols="3" sm="3">
          <v-text-field v-model="customid" label="Custom ID" outlined></v-text-field>
        </v-col>
        <v-col cols="1" sm="1">
          <v-btn style="margin-top: 7px" @click="addUrl"> Shorten! </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="2" style="margin-top: 20px">
        Use {{ use2beensUrl ? '2beens' : 'serj-tubin' }}
      </v-col>
      <v-col cols="1">
        <v-switch v-model="use2beensUrl"></v-switch>
      </v-col>
      <v-col cols="6">
        <h4 style="margin-top: 15px">Current URLs saved</h4>
      </v-col>
      <v-col cols="3" style="padding: 22px">
        <v-alert dense :type="status.type">
          {{ status.message }}
        </v-alert>
      </v-col>
    </v-row>

    <v-data-table id="data-table" :headers="headers" :items="urls">
      <template v-slot:item.url="props">
        <v-edit-dialog
          :return-value.sync="props.item.url"
          @save="save"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          {{ props.item.url }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.url"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>

      <template v-slot:item.id="props">
        <a :href="currentApiEndpoint + '/l/' + props.item.id" target="_blank">{{
          props.item.id
        }}</a>
      </template>

      <template v-slot:item.ops="props">
        <v-btn class="mx-2" fab dark x-small color="error" @click="deleteUrl(props.item.id)">
          <v-icon> mdi-close </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')

const apiEndpoints = {
  twoBeens: process.env.VUE_APP_URL_SHORTENER_ENDPOINT_2BEENS,
  serjt: process.env.VUE_APP_URL_SHORTENER_ENDPOINT_SERJT
}

const statuses = {
  checking: {
    type: 'info',
    message: 'Checking ...'
  },
  ok: {
    type: 'success',
    message: 'Server OK'
  },
  error: {
    type: 'error',
    message: 'Server Bad :('
  },
  warning: {
    type: 'warning',
    message: 'Unexpected response'
  }
}

export default {
  name: 'URLShortener',

  computed: {
    currentApiEndpoint() {
      return this.use2beensUrl ? apiEndpoints.twoBeens : apiEndpoints.serjt
    }
  },

  data: () => ({
    use2beensUrl: true,

    url: '',
    customid: '',

    // server status stuff
    status: statuses['ok'],

    // table view stuff
    snack: false,
    snackColor: '',
    snackText: '',
    max25chars: (v) => v.length <= 25 || 'Input too long!',
    pagination: {},
    headers: [
      { text: 'Ops', value: 'ops', sortable: false },
      { text: 'ID', value: 'id' },
      {
        text: 'URL',
        align: 'start',
        sortable: false,
        value: 'url'
      }
    ],
    urls: []
  }),
  mounted: function () {
    if (!this.$root.loggedIn) {
      return
    }

    const apiEndpoint = this.use2beensUrl ? apiEndpoints.twoBeens : apiEndpoints.serjt

    const vm = this
    axios
      .get(apiEndpoint + '/all', {
        headers: {
          'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
        }
      })
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get all urls - received null response / data')
          return
        }

        vm.urls = response.data

        for (let i = 0; i < vm.urls.length; i++) {
          const redisKeyParts = vm.urls[i].key.split('::')
          if (redisKeyParts.length !== 2) {
            console.warn('unexpected url redis key', vm.urls[i].key)
            continue
          }
          vm.urls[i].id = redisKeyParts[1]
        }
      })
      .catch((error) => {
        console.log(error)
      })

    setInterval(function () {
      // TODO: if really needed, this can be better done via websockets
      vm.status = statuses['checking']
      axios
        .get(apiEndpoint + '/ping')
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('ping server - received null response / data')
            vm.status = statuses['error']
            return
          }

          if (String(response.data).trim() === 'Pong!') {
            vm.status = statuses['ok']
          } else {
            console.warn('received ping response:', response.data)
            vm.status = statuses['warning']
          }
        })
        .catch((error) => {
          console.log(error)
          vm.status = statuses['error']
        })
    }, 30000)
  },
  methods: {
    addUrl() {
      const requestBody = {
        url: this.url
      }

      if (this.customid !== '') {
        requestBody.cid = this.customid
      }

      const apiEndpoint = this.use2beensUrl ? apiEndpoints.twoBeens : apiEndpoints.serjt

      const vm = this
      axios
        .post(apiEndpoint + '/new', qs.stringify(requestBody), {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then(function (response) {
          console.log(response)
          const newId = response.data.trim()
          console.log('new id', newId)

          vm.snack = true
          vm.snackColor = 'success'
          vm.snackText = `url added, id: ${newId}`
          vm.urls.push({ url: vm.url, id: newId })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteUrl(urlId) {
      if (!urlId) {
        console.warn('cannot delete url, empty id')
        return
      }

      if (!confirm(`Are you sure you want to delete ${urlId}?`)) {
        return
      }

      console.log('will be deleting url:', urlId)
      const apiEndpoint = this.use2beensUrl ? apiEndpoints.twoBeens : apiEndpoints.serjt

      const vm = this
      axios
        .delete(apiEndpoint + '/delete?id=' + urlId, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete url - received null response / data')
            return
          }

          vm.snack = true
          vm.snackColor = 'success'
          vm.snackText = response.data

          let urlIdx = -1
          for (let i = 0; i < vm.urls.length; i++) {
            if (vm.urls[i].id === urlId) {
              urlIdx = i
              break
            }
          }

          vm.urls.splice(urlIdx, 1)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    save() {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel() {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open() {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close() {
      console.log('Dialog closed')
    }
  }
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
</style>

<style scoped>
#input-field {
  padding: 15px 80px 0 15px;
  background: #26c6da;
  color: white;
  border-radius: 10px;
}

#data-table {
  padding: 20px;
  background: #26c6da;
  border-radius: 10px;
  margin-bottom: 50px;
}
</style>
