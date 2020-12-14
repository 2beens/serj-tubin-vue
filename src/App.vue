<template>
  <v-app>
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/board">Visitor Board</router-link> |
      <router-link to="/util">Util</router-link> |

      <v-btn
        class="ma-2"
        x-small
        text
        icon
        v-if="this.$root.loggedIn"
        @click="logout"
        color="teal lighten-1"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-dialog
        v-model="showLoginDialog"
        persistent
        max-width="400px"
        v-else
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            color="teal lighten-1"
            class="ma-2 login-btn"
            x-small
            text
            icon
            dark
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-login</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">Login</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    label="Username"
                    required
                    v-model="user.name"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    label="Password"
                    required
                    v-model="user.password"
                    append-icon="mdi-eye-off"
                    type="password"
                    name="input-10-1"
                    counter
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="showLoginDialog = false"
            >
              Abort
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="login"
            >
              Login!
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

    <div id="snackbar-div">
      <v-snackbar
        v-model="showSnackbar"
      >
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>

    <router-view />

    <Footer/>
  </v-app>
</template>

<script>
import Footer from '@/components/Footer.vue'
import axios from 'axios'
const qs = require('querystring')

export default {
  name: 'App',
  data: function () {
    return {
      user: {},
      showLoginDialog: false,
      snackbarText: '',
      showSnackbar: false
    }
  },
  components: {
    Footer
  },
  mounted: function () {
    console.log('loaded env: ' + process.env.VUE_APP_ENV)

    const token = this.getCookie('sessionkolacic')
    if (token === undefined || token === null || token === '') {
      // console.warn('no token in cookies, not logged in')
      return
    }

    this.$root.loggedIn = true
  },
  watch: {
    $route (to, from) {
      console.log('app: route change to ' + to.path)
    }
  },
  methods: {
    login: function () {
      if (this.user.name === undefined || this.user.name === '') {
        console.error('emtpy username')
        return
      }
      if (this.user.password === undefined || this.user.password === '') {
        console.error('emtpy password')
        return
      }

      const requestBody = {
        username: this.user.name,
        password: this.user.password
      }

      const vm = this
      axios
        .post(
          process.env.VUE_APP_API_ENDPOINT + '/login',
          qs.stringify(requestBody))
        .then(function (response) {
          if (response.data === null) {
            console.warn(response)
            return
          }

          const token = response.data.token
          vm.$root.loggedIn = true
          vm.setCookie('sessionkolacic', token, 1)
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
    logout: function () {
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT + '/logout', {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          })
        .then(response => {
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
        .catch(error => {
          if (error.response && error.response.status === 401) {
            vm.eraseCookie('sessionkolacic')
            vm.$root.loggedIn = false
            vm.showLoginDialog = false

            vm.showSnackbar = true
            vm.snackbarText = error
            vm.user = {}
          }
        })
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #264e77;
  background-color: black;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #264e77;
}

#nav a.router-link-exact-active {
  color: #259965;
}
</style>
