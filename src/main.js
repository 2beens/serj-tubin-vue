import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    date2string (aDate) {
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(aDate)
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(aDate)
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(aDate)
      return `${da}-${mo}-${ye}`
    },
    setCookie (name, value, days) {
      var expires = ''
      if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
        expires = '; expires=' + date.toUTCString()
      }
      document.cookie = name + '=' + (value || '') + expires + '; path=/'
    },
    getCookie (name) {
      var nameEQ = name + '='
      var ca = document.cookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) === ' ') c = c.substring(1, c.length)
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
      }
      return null
    },
    eraseCookie (name) {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    }
  }
})

new Vue({
  router,
  vuetify,
  render: function (h) { return h(App) },
  data: {
    loggedIn: false
  }
}).$mount('#app')
