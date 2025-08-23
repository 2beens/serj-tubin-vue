import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { Bar } from 'vue-chartjs'
import { themes } from '@/composables/useTheme'

Vue.use(Vuetify)
Vue.use(Bar)

export default new Vuetify({
  theme: {
    dark: true, // Start with dark theme to match current design
    themes: {
      light: themes.light,
      dark: themes.dark,
    },
    options: {
      customProperties: true, // Enable CSS custom properties
    },
  },
})
