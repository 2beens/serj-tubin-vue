<template>
  <v-footer :dark="$vuetify.theme.dark" padless fixed>
    <v-card class="flex" flat tile :dark="$vuetify.theme.dark">
      <v-card-text
        :class="$vuetify.theme.dark ? 'blue darken-4' : 'blue-grey lighten-2'"
        class="py-2 px-4 d-flex align-center"
      >
        <strong class="subheading">Serj, Berlin 2024</strong>

        <v-spacer />

        <div id="version-info" class="text-body-2">
          {{ new Date().getFullYear() }} — {{ versionInfo }}
        </div>

        <v-spacer />

        <v-btn
          class="mx-2"
          :dark="$vuetify.theme.dark"
          icon
          variant="text"
          @click="goTo('gh')"
        >
          <v-icon size="35px">mdi-github</v-icon>
        </v-btn>

        <v-btn
          class="mx-2"
          :dark="$vuetify.theme.dark"
          icon
          variant="text"
          @click="goTo('insta')"
        >
          <v-icon size="35px">mdi-instagram</v-icon>
        </v-btn>

        <v-btn
          class="mx-2"
          :dark="$vuetify.theme.dark"
          icon
          variant="text"
          @click="goTo('fb')"
        >
          <v-icon size="35px">mdi-facebook</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SiteFooter',
  data: function () {
    return {
      versionInfo: '...',
    }
  },
  mounted: function () {
    const vm = this
    const apiEndpoint = import.meta.env.VITE_API_ENDPOINT
    if (!apiEndpoint) {
      vm.versionInfo = 'dev'
      return
    }
    axios
      .get(apiEndpoint + '/version')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get version info: received null response / data')
          vm.versionInfo = 'unknown'
          return
        }
        // Check if response.data is a string (not HTML)
        if (typeof response.data === 'string' && !response.data.includes('<!DOCTYPE')) {
          vm.versionInfo = response.data.trim()
        } else {
          console.warn('Version endpoint returned unexpected format:', typeof response.data)
          vm.versionInfo = 'dev'
        }
      })
      .catch((error) => {
        console.log('Error fetching version:', error)
        vm.versionInfo = 'dev'
      })
  },
  methods: {
    goTo: function (target) {
      if (target === 'gh') {
        window
          .open('https://github.com/2beens', '2beens GitHub', 'noopener')
          .focus()
      } else if (target === 'insta') {
        window
          .open('https://www.instagram.com/2beens', '2beens Insta', 'noopener')
          .focus()
      } else if (target === 'fb') {
        window
          .open('https://www.facebook.com/srdjantubin', 'Serj FB', 'noopener')
          .focus()
      }
    },
  },
}
</script>
