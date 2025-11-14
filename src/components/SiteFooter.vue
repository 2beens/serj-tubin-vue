<template>
  <v-footer max-height="52" :dark="$vuetify.theme.dark" padless fixed>
    <v-card class="flex" flat tile :dark="$vuetify.theme.dark">
      <v-card-title
        :class="$vuetify.theme.dark ? 'blue darken-4' : 'blue-grey lighten-2'"
      >
        <strong class="subheading">Serj, Berlin 2024</strong>

        <v-spacer />

        <div id="version-info">
          {{ new Date().getFullYear() }} — {{ versionInfo }}
        </div>

        <v-spacer />

        <v-btn
          class="mx-4"
          :dark="$vuetify.theme.dark"
          icon
          @click="goTo('gh')"
        >
          <v-icon size="35px">mdi-github</v-icon>
        </v-btn>

        <v-btn
          class="mx-4"
          :dark="$vuetify.theme.dark"
          icon
          @click="goTo('insta')"
        >
          <v-icon size="35px">mdi-instagram</v-icon>
        </v-btn>

        <v-btn
          class="mx-4"
          :dark="$vuetify.theme.dark"
          icon
          @click="goTo('fb')"
        >
          <v-icon size="35px">mdi-facebook</v-icon>
        </v-btn>
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
    axios
      .get(import.meta.env.VITE_API_ENDPOINT + '/version')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get version info: received null response / data')
          return
        }
        vm.versionInfo = response.data.trim()
      })
      .catch((error) => {
        console.log(error)
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
