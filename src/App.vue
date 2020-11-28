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
        v-if="loggedIn"
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

    <router-view />

    <Footer/>
  </v-app>
</template>

<script>
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  data: function () {
    return {
      loggedIn: false,
      user: {},
      showLoginDialog: false
    }
  },
  components: {
    Footer
  },
  mounted: function () {
    console.log('loaded env: ' + process.env.VUE_APP_ENV)
  },
  watch: {
    $route (to, from) {
      console.log('app: route change to ' + to.path)
    }
  },
  methods: {
    login: function () {
      // TODO:
      this.loggedIn = true
      this.showLoginDialog = false
    },
    logout: function () {
      // TODO:
      this.loggedIn = false
      this.showLoginDialog = false
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
