<template>
  <div>
    <v-btn
      v-if="$root.loggedIn"
      id="logout-button"
      class="mt-1"
      icon
      color="blue lighten-1"
      @click="onLogoutClick"
    >
      <v-icon>mdi-logout</v-icon>
    </v-btn>

    <v-dialog v-else v-model="showLoginDialog" persistent max-width="400px">
      <template #activator="{ on, attrs }">
        <v-btn
          id="login-button"
          class="ma-1"
          icon
          v-bind="attrs"
          color="blue lighten-1"
          v-on="on"
        >
          <v-icon>mdi-login</v-icon>
        </v-btn>
      </template>
      <v-card id="login-form">
        <v-card-title>
          <span class="text-h5">Login</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  id="login-form-username"
                  v-model="user.name"
                  label="Username"
                  required
                  autofocus
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  id="login-form-password"
                  v-model="user.password"
                  label="Password"
                  required
                  append-icon="mdi-eye-off"
                  type="password"
                  name="input-10-1"
                  counter
                  @keyup="loginOnEnter"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="showLoginDialog = false">
            Abort
          </v-btn>
          <v-btn
            id="login-form-login-button"
            color="blue darken-1"
            text
            @click="onLoginClick"
          >
            Login!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div id="snackbar-div">
      <v-snackbar v-model="showSnackbar">
        {{ snackbarText }}

        <template #action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LoginLogoutButton',
  data: function () {
    return {
      user: {},
      showLoginDialog: false,
      snackbarText: '',
      showSnackbar: false,
    }
  },
  methods: {
    loginOnEnter: function (e) {
      if (e.keyCode === 13) {
        this.onLoginClick()
      }
    },
    onLoginClick: function () {
      if (this.user.name === undefined || this.user.name === '') {
        console.error('empty username')
        return
      }
      if (this.user.password === undefined || this.user.password === '') {
        console.error('empty password')
        return
      }

      const requestBody = {
        username: this.user.name,
        password: this.user.password,
      }

      const vm = this
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + '/a/login', requestBody, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          if (response.data === null) {
            console.warn(response)
            return
          }

          const token = response.data.token
          vm.$root.loggedIn = true
          vm.setCookie('sessionkolacic', token, 90)
          vm.showSnackbar = true
          vm.snackbarText = 'logged in'
        })
        .catch(function (error) {
          console.log(error)
          vm.showSnackbar = true
          vm.snackbarText = error
          vm.user = {}
        })
        .finally(() => {
          vm.showLoginDialog = false
        })
    },
    onLogoutClick: function () {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + '/a/logout', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('received null response / data')
            return
          }
          if (response.data !== 'logged-out') {
            console.error('received unexpected response / data')
            return
          }

          vm.eraseCookie('sessionkolacic')
          vm.$root.loggedIn = false
          vm.showLoginDialog = false

          vm.showSnackbar = true
          vm.snackbarText = 'logged out'
          vm.user = {}
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            vm.eraseCookie('sessionkolacic')
            vm.$root.loggedIn = false
            vm.showLoginDialog = false

            vm.showSnackbar = true
            vm.snackbarText = error
            vm.user = {}
          }
        })
    },
  },
}
</script>
