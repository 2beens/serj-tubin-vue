import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { themes } from '@/composables/useTheme'

// Note: Bar component from vue-chartjs will be registered in main.js if needed

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark', // Start with dark theme to match current design
    themes: {
      light: themes.light,
      dark: themes.dark,
    },
  },
})
