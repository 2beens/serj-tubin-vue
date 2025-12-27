import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

app.use(router)
app.use(vuetify)

// Create a reactive global state object for $root.loggedIn compatibility
const globalState = reactive({
  loggedIn: false,
})

app.mixin({
  methods: {
    date2string(aDate) {
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
        aDate
      )
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(aDate)
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(aDate)
      return `${da}-${mo}-${ye}`
    },
    getTimestampString(date) {
      const hourInfo =
        ('0' + date.getHours()).slice(-2) +
        ':' +
        ('0' + date.getMinutes()).slice(-2)

      const y = date.getFullYear()
      const m = date.getMonth()
      const d = date.getDate()
      const dateInfo =
        ('0' + d).slice(-2) + '/' + ('0' + (m + 1)).slice(-2) + '/' + y

      return dateInfo + ' ' + hourInfo
    },
    setCookie(name, value, days) {
      var expires = ''
      if (days) {
        var date = new Date()
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
        expires = '; expires=' + date.toUTCString()
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/'
    },
    getCookie(name) {
      var nameEQ = name + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    },
    eraseCookie(name) {
      document.cookie =
        name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
  },
})

// Set it as a global property for direct access
// In Vue 3, we set $root to the reactive state object
// This ensures loggedIn is always defined and reactive
app.config.globalProperties.$root = globalState

// Provide the state via provide/inject as well for better Vue 3 compatibility
app.provide('loggedInState', globalState)

// Theme will be initialized by ThemeToggle component

app.mount('#app')
