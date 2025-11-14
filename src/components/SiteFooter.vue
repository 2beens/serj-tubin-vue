<template>
  <v-footer :dark="$vuetify.theme.dark" padless fixed>
    <v-card class="footer-card" flat tile :dark="$vuetify.theme.dark">
      <v-card-title class="blue darken-4 py-4 px-4 footer-card-title">
        <div class="footer-left">
          <strong class="subheading">Serj, Berlin 2024</strong>
        </div>

        <div id="version-info" class="text-body-2 footer-center">
          {{ new Date().getFullYear() }} — {{ versionInfo }}
        </div>

        <div class="footer-right d-flex">
          <v-btn
            class="mx-4"
            :dark="$vuetify.theme.dark"
            icon
            variant="text"
            @click="goTo('gh')"
          >
            <v-icon size="35px">mdi-github</v-icon>
          </v-btn>

          <v-btn
            class="mx-4"
            :dark="$vuetify.theme.dark"
            icon
            variant="text"
            @click="goTo('insta')"
          >
            <v-icon size="35px">mdi-instagram</v-icon>
          </v-btn>

          <v-btn
            class="mx-4"
            :dark="$vuetify.theme.dark"
            icon
            variant="text"
            @click="goTo('fb')"
          >
            <v-icon size="35px">mdi-facebook</v-icon>
          </v-btn>
        </div>
      </v-card-title>
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
        if (
          typeof response.data === 'string' &&
          !response.data.includes('<!DOCTYPE')
        ) {
          vm.versionInfo = response.data.trim()
        } else {
          console.warn(
            'Version endpoint returned unexpected format:',
            typeof response.data
          )
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

<style>
.v-footer {
  position: fixed !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  z-index: 3 !important;
  background-color: rgb(13, 71, 161) !important; /* blue darken-4 */
  padding: 0 !important;
  margin: 0 !important;
}

.footer-card {
  width: 100% !important;
  max-width: 100% !important;
  background-color: rgb(13, 71, 161) !important; /* blue darken-4 */
  margin: 0 !important;
  padding: 0 !important;
}

.footer-card-title {
  width: 100% !important;
  background-color: rgb(13, 71, 161) !important; /* blue darken-4 */
  padding: 16px !important;
  min-height: 68px !important;
  display: grid !important;
  grid-template-columns: 1fr auto 1fr !important;
  align-items: center !important;
  gap: 16px !important;
}

.footer-left {
  justify-self: start;
  white-space: nowrap;
}

.footer-center {
  justify-self: center;
  text-align: center;
}

.footer-right {
  justify-self: end;
  display: flex;
  align-items: center;
}
</style>
