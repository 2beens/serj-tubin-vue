<template>
  <v-container v-if="this.$root.loggedIn">
    <h2>URL Shortener</h2>
    <h4>Fun fact: uses a service written in Rust</h4>

    <v-form id="input-field">
      <v-row>
        <v-col
          cols="8"
          sm="8"
        >
          <v-text-field
            v-model="url"
            label="URL"
            outlined
          ></v-text-field>
        </v-col>

        <v-col
          cols="3"
          sm="3"
        >
          <v-text-field
            v-model="customid"
            label="Custom ID"
            outlined
          ></v-text-field>
        </v-col>
        <v-col
          cols="1"
          sm="1"
        >
          <v-btn
            style="margin-top: 7px;"
            @click="addUrl"
          >
            Shorten!
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row>
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <h4 style="margin-top: 15px;">Current URLs saved</h4>
      </v-col>
      <v-col cols="3" style="padding: 22px;">
        <v-alert
          dense
          :type="status.type"
        >
          {{ status.message }}
        </v-alert>
      </v-col>
    </v-row>

    <v-data-table
      id="data-table"
      :headers="headers"
      :items="urls"
    >
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
      <template v-slot:item.ops="props">
        <v-btn
          class="mx-2"
          fab
          dark
          x-small
          color="error"
          @click="deleteUrl(props.item.key)"
        >
          <v-icon>
            mdi-close
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-snackbar
      v-model="snack"
      :timeout="3000"
      :color="snackColor"
    >
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          v-bind="attrs"
          text
          @click="snack = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')

const statuses = {
  "checking": {
    type: "info",
    message: "Checking ..."
  },
  "ok": {
    type: "success",
    message: "Server OK"
  },
  "error": {
    type: "error",
    message: "Server Bad :("
  },
  "warning": {
    type: "warning",
    message: "Unexpected response"
  }
}

export default {
  name: 'URLShortener',
  data: () => ({
    url: '',
    customid: '',

    // server status stuff
    status: statuses["ok"],

    // table view stuff
    snack: false,
    snackColor: '',
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
    pagination: {},
    headers: [
      {
        text: 'URL',
        align: 'start',
        sortable: false,
        value: 'url',
      },
      { text: 'Key', value: 'key' },
      { text: 'Ops',  value: 'ops', sortable: false }
    ],
    urls: [],
  }),
  mounted: function () {
    if (!this.$root.loggedIn) {
      return;
    }

    const vm = this
    axios
      .get(process.env.VUE_APP_URL_SHORTENER_ENDPOINT + '/all')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get all urls - received null response / data')
          return
        }
        // console.log('received urls', response.data)
        vm.urls = response.data

        for (let i = 0; i < vm.urls.length; i++) {
          const redisKeyParts = vm.urls[i].key.split('::')
          if (redisKeyParts.length != 2) {
            console.warn('unexpected url redis key', vm.urls[i].key)
            continue
          }
           vm.urls[i].key = redisKeyParts[1]
        }
      })
      .catch((error) => {
        console.log(error)
      })

    setInterval(function () {
      // TODO: if really needed, this can be better done via websockets
      vm.status = statuses["checking"]
      // console.log('checking server status...')
      axios
        .get(process.env.VUE_APP_URL_SHORTENER_ENDPOINT + '/ping')
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('ping server - received null response / data')
            vm.status = statuses["error"]
            return
          }

          if (String(response.data).trim() === 'Pong!') {
            vm.status = statuses["ok"]
          } else {
            console.warn('received ping response:', response.data)
            vm.status = statuses["warning"]
          }
        })
        .catch((error) => {
          console.log(error)
          vm.status = statuses["error"]
        })
    }, 15000);
  },
  methods: {
    addUrl () {
      console.log('url', this.url)

      const requestBody = {
        url: this.url
      }

      const vm = this
      axios
        .post(
          process.env.VUE_APP_URL_SHORTENER_ENDPOINT + '/new',
          qs.stringify(requestBody), {
            headers: {
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
        .then(function (response) {
          console.log(response)

          vm.snack = true
          vm.snackColor = 'success'
          vm.snackText = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    deleteUrl (urlId) {
      if (!urlId) {
        console.warn('cannot delete url, empty id');
        return;
      }

      if (!confirm(`Are you sure you want to delete ${urlId}?`)) {
        return
      }

      console.log('will be deleting url:', urlId)

      const vm = this
      axios
        .delete(process.env.VUE_APP_URL_SHORTENER_ENDPOINT + '/delete?id=' + urlId)
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete url - received null response / data')
            return
          }

          vm.snack = true
          vm.snackColor = 'success'
          vm.snackText = response.data

          let urlIdx = -1;
          for (let i = 0; i < vm.urls.length; i++) {
            if (vm.urls[i].key == urlId) {
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
    save () {
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close () {
      console.log('Dialog closed')
    },
  },
}
</script>

<style scoped>
h1, h2, h3, h4, h5 {
  color: #26c6da;
}
</style>

<style scoped>
#input-field {
  padding: 15px;
  padding-right: 80px;
  padding-bottom: 0px;
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
