<template>
  <v-app>
    <v-app-bar
      v-if="$vuetify.breakpoint.smAndDown"
      id="main-menu-bar-sm"
      app
      :color="$vuetify.theme.dark ? 'black' : 'white'"
    >
      <v-btn icon @click="drawer = !drawer">
        <v-icon color="blue lighten-1">mdi-menu</v-icon>
      </v-btn>
      <v-spacer />
      <ThemeToggle class="mr-2" />
      <LoginLogoutButton />
    </v-app-bar>

    <!-- Navigation drawer for small screens -->
    <!------------------------------------------>
    <v-navigation-drawer
      v-model="drawer"
      app
      v-if="$vuetify.breakpoint.smAndDown"
      :color="$vuetify.theme.dark ? 'black' : 'white'"
    >
      <v-btn icon @click="drawer = false">
        <v-icon color="blue lighten-1">mdi-close</v-icon>
      </v-btn>
      <v-list>
        <v-list-item
          v-for="route in filteredRoutes"
          :key="route.path"
          :to="route.path"
        >
          <v-list-item-title>
            {{ route.name }} {{ route.icon }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Navigation bar for large screens -->
    <!------------------------------------------>
    <v-app-bar
      id="main-menu-bar"
      app
      :color="$vuetify.theme.dark ? 'black' : 'white'"
      v-else
    >
      <v-spacer />
      <v-btn
        v-for="route in filteredRoutes"
        :key="route.path"
        :color="$vuetify.theme.dark ? '#4b9ff2' : '#1976D2'"
        text
        rounded
        :to="route.path"
      >
        {{ route.name }} {{ route.icon }}
      </v-btn>
      <v-spacer />
      <ThemeToggle class="mr-2" />
      <LoginLogoutButton />
    </v-app-bar>

    <v-main class="main-content">
      <router-view />
    </v-main>

    <div v-show="showConsent" id="consent-div">
      <cookie-consent>
        <template #message>
          <div style="color: white">
            <p>Hey, over here 👋</p>
            <p>
              This site uses cookies to analyze website traffic and optimize
              your website experience.
            </p>
            <p>
              Cookies are used only for analytics purposes. By using this site,
              you consent to the use of these cookies.
            </p>
            <p>🍪🍪🍪 ❓</p>
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

    <SiteFooter v-if="$route.path !== '/gymstats'" />
  </v-app>
</template>

<script>
import SiteFooter from '@/components/SiteFooter.vue'
import LoginLogoutButton from '@/components/LoginLogoutButton.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import CookieConsent from '@/components/CookieConsent.vue'

export default {
  name: 'App',
  components: {
    SiteFooter,
    LoginLogoutButton,
    ThemeToggle,
    CookieConsent,
  },
  data: function () {
    return {
      showConsent: true,
      drawer: false,
      routes: [
        { path: '/', name: 'Home', icon: '', requiresAuth: false },
        { path: '/about', name: 'About', icon: '', requiresAuth: false },
        {
          path: '/board',
          name: 'Visitor Board',
          icon: '',
          requiresAuth: false,
        },
        { path: '/util', name: 'Util', icon: '', requiresAuth: false },
        { path: '/gymstats', name: 'GymStats', icon: '🏋️‍♀️', requiresAuth: true },
        { path: '/netlog', name: 'Netlog', icon: '🕸', requiresAuth: false },
        {
          path: '/url-shortener',
          name: 'URLs',
          icon: '🌏',
          requiresAuth: true,
        },
        { path: '/notes', name: 'Notes', icon: '📝', requiresAuth: true },
        {
          path: '/spotify',
          name: 'Spotify Tracker',
          icon: '🎸',
          requiresAuth: true,
        },
        { path: '/sumup', name: 'SumUp', icon: '🤑', requiresAuth: false },
      ],
    }
  },
  computed: {
    filteredRoutes() {
      return this.routes.filter(
        (route) => !route.requiresAuth || this.$root.loggedIn
      )
    },
  },
  watch: {
    $route(to, from) {
      console.log(`app: route change from ${from.path} to ${to.path}`)
    },
  },
  methods: {
    checkCookieConsent() {
      try {
        const consentStatus = this.getCookie('cookieconsent_status')
        this.showConsent = !consentStatus
      } catch (error) {
        console.error('Error checking cookie consent:', error)
        this.showConsent = true
      }
    },

    checkAuthentication() {
      try {
        const token = this.getCookie('sessionkolacic')
        this.$root.loggedIn = Boolean(token)
      } catch (error) {
        console.error('Error checking authentication:', error)
        this.$root.loggedIn = false
      }
    },
  },
  mounted() {
    this.checkCookieConsent()
    this.checkAuthentication()
    console.log('Environment:', import.meta.env.VITE_ENV)
  },
}
</script>

<style scoped>
.main-content {
  padding-bottom: 80px !important; /* Add space for fixed footer */
}

#consent-div {
  max-width: min(300px, 90vw);
  background-color: #007acc;
  border-radius: 8px;
  position: fixed;
  top: 130px;
  right: 5%;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

@media (max-width: 600px) {
  #consent-div {
    top: auto;
    bottom: 20px;
    right: 50%;
    transform: translateX(50%);
  }
}

#cookies-ok-btn {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ffffff3d;
  cursor: pointer;
  transition: all 0.3s ease;
}

#cookies-ok-btn:hover {
  background-color: #111;
  transform: translateY(-1px);
}
</style>
