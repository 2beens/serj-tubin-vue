<template>
  <v-container>
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
      style="padding: 20px; background: #26c6da; color: white; border-radius: 10px; margin-bottom: 50px;"
      :headers="headers"
      :items="urls"
    >
      <template v-slot:item.name="props">
        <v-edit-dialog
          :return-value.sync="props.item.name"
          @save="save"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          {{ props.item.name }}
          <template v-slot:input>
            <v-text-field
              v-model="props.item.name"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.iron="props">
        <v-edit-dialog
          :return-value.sync="props.item.iron"
          large
          persistent
          @save="save"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          <div>{{ props.item.iron }}</div>
          <template v-slot:input>
            <div class="mt-4 text-h6">
              Update Iron
            </div>
            <v-text-field
              v-model="props.item.iron"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
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
    ],
    urls: [],
  }),
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_URL_SHORTENER_ENDPOINT + '/all')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get all urls - received null response / data')
          return
        }
        console.log('received urls', response.data)
        vm.urls = response.data
      })
      .catch((error) => {
        console.log(error)
      })

    setInterval(function () {
      // TODO: if really needed, this can be better done via websockets
      vm.status = statuses["checking"]
      console.log('checking server status...')
      axios
        .get(process.env.VUE_APP_URL_SHORTENER_ENDPOINT + '/ping')
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('ping server - received null response / data')
            vm.status = statuses["error"]
            return
          }
          console.log('received ping response: ', response.data)
          vm.status = statuses["ok"]
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

      // const vm = this
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
        })
        .catch(function (error) {
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
  background: #26c6da; 
  color: white; 
  border-radius: 10px;
}
</style>
