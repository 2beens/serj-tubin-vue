<template>
  <v-app>
    <v-app-bar
      id="main-menu-bar"
      app
      color="black"
    >
      <v-spacer />
      <v-btn
        color="#4b9ff2"
        text
        rounded
        to="/"
      >
        Home
      </v-btn>
      <v-btn
        color="#4b9ff2"
        text
        rounded
        to="/about"
      >
        About
      </v-btn>
      <v-btn
        color="#4b9ff2"
        text
        rounded
        to="/board"
      >
        Visitor Board
      </v-btn>
      <v-btn
        color="#4b9ff2"
        text
        rounded
        to="/util"
      >
        Util
      </v-btn>
      <v-btn
        color="#4b9ff2"
        text
        rounded
        to="/netlog"
      >
        Netlog 🕸
      </v-btn>
      <v-btn
        v-if="$root.loggedIn"
        color="#4b9ff2"
        text
        rounded
        to="/url-shortener"
      >
        URLs 🌏
      </v-btn>
      <v-btn
        v-if="$root.loggedIn"
        color="#4b9ff2"
        text
        rounded
        to="/notes"
      >
        Notes 📝
      </v-btn>
      <v-btn
        color="#4b9ff2"
        text
        rounded
        to="/gymstats"
      >
        GymStats 🏋️‍♀️
      </v-btn>
      <v-btn
        color="#4b9ff2"
        text
        rounded
        to="/sumup"
      >
        🤑SumUp🤑
      </v-btn>
      <v-spacer />
      <LoginLogoutButton />
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <div
      v-show="showConsent"
      id="consent-div"
    >
      <cookie-consent>
        <template #message>
          <div style="color: white">
            <p>Hey, over here 👋</p>
            <p>
              This site uses cookies to analyze website traffic and optimize your website experience.
            </p>
            <p>
              Cookies are used only for analytics purposes. By using this site, you consent to the use of these cookies.
            </p>
            <p>
              🍪🍪🍪 ❓
            </p>
          </div>
        </template>
        <template #button>
          <button
            id="cookies-ok-btn"
            style="background-color: black"
            class="btn btn-info"
            onclick="location.reload()"
          >
            Yeah, sure...
          </button>
        </template>
      </cookie-consent>
    </div>

    <SiteFooter />
  </v-app>
</template>

<script>
import SiteFooter from '@/components/SiteFooter.vue'
import LoginLogoutButton from '@/components/LoginLogoutButton.vue'
import CookieConsent from 'vue-cookieconsent-component'

export default {
  name: 'App',
  components: {
    SiteFooter,
    LoginLogoutButton,
    CookieConsent
  },
  data: function () {
    return {
      showConsent: true
    }
  },
  watch: {
    $route(to, from) {
      console.log(`app: route change from ${from.path} to ${to.path}`)
    }
  },
  mounted: function () {
    this.showConsent = !(this.getCookie('cookieconsent_status'))

    console.log('loaded env: ' + process.env.VUE_APP_ENV)

    const token = this.getCookie('sessionkolacic')
    if (token === undefined || token === null || token === '') {
      // console.warn('no token in cookies, not logged in')
      return
    }

    this.$root.loggedIn = true
  }
}
</script>

<style scoped>
#consent-div {
  max-width: 300px;
  background-color: #26a69a;
  border-radius: 5px;
  position: absolute;
  top: 130px;
  right: 5%;
  float: right;
  padding: 10px;
}
</style>
