<template>
  <v-app>
    <v-app-bar
      v-if="$vuetify.display.smAndDown"
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
      v-if="$vuetify.display.smAndDown"
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
        :color="$vuetify.theme.dark ? '#40A9FF' : '#1976D2'"
        variant="text"
        rounded
        :to="route.path"
        :class="$vuetify.theme.dark ? 'text-azure' : 'text-primary'"
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
      <cookie-consent @accept="handleCookieAccept">
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
        <template #button="{ acceptCookies }">
          <button
            id="cookies-ok-btn"
            style="background-color: black"
            class="btn btn-info"
            @click="acceptCookies"
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
import { loggedIn, useAuth } from '@/composables/useAuth'

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
      // Access loggedIn from reactive $root - this will be reactive
      // Since $root is a reactive object, accessing .loggedIn will track changes
      const isLoggedIn = this.$root && this.$root.loggedIn ? this.$root.loggedIn : false
      return this.routes.filter((route) => !route.requiresAuth || isLoggedIn)
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
      // The useAuth composable checks the cookie on initialization
      // This method ensures $root.loggedIn is synced with the composable state
      const { checkAuth } = useAuth()
      checkAuth()
      // Sync with $root for backward compatibility
      if (this.$root) {
        this.$root.loggedIn = loggedIn.value
      }
    },

    handleCookieAccept() {
      this.showConsent = false
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

<style>
/* Theme-aware menu button styles */
.theme--dark #main-menu-bar .v-btn {
  color: #40A9FF !important;
}

.theme--dark #main-menu-bar .v-btn:hover {
  color: #69C0FF !important;
  background-color: rgba(64, 169, 255, 0.1) !important;
}

.theme--light #main-menu-bar .v-btn {
  color: #1976D2 !important;
}

.theme--light #main-menu-bar .v-btn:hover {
  color: #1565C0 !important;
  background-color: rgba(25, 118, 210, 0.1) !important;
}

/* Active route styling */
.theme--dark #main-menu-bar .v-btn.v-btn--active {
  color: #69C0FF !important;
  background-color: rgba(64, 169, 255, 0.15) !important;
}

.theme--light #main-menu-bar .v-btn.v-btn--active {
  color: #1565C0 !important;
  background-color: rgba(25, 118, 210, 0.15) !important;
}
</style>
