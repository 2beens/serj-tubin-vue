<template>
  <v-footer
    max-height="52"
    dark
    padless
    fixed
  >
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-title class="teal lighten-1">
        <strong class="subheading">Serj, Berlin 2021/2022</strong>

        <v-spacer></v-spacer>

        {{ new Date().getFullYear() }} — {{ versionInfo }}

        <v-spacer></v-spacer>

        <v-btn
          class="mx-4"
          dark
          icon
          @click="goTo('fb')"
        >
          <v-icon size="24px">
            mdi-facebook
          </v-icon>
        </v-btn>

        <v-btn
          class="mx-4"
          dark
          icon
          @click="goTo('gh')"
        >
          <v-icon size="24px">
            mdi-github-circle
          </v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </v-footer>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Footer',
  data: function () {
    return {
      versionInfo: '...'
    }
  },
  methods: {
    goTo: function (target) {
      if (target === 'gh') {
        window.open('https://github.com/2beens', '_blank').focus()
      } else if (target === 'fb') {
        window.open('https://www.facebook.com/srdjantubin', '_blank').focus()
      }
    }
  },
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/version')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('get version info: received null response / data')
          return
        }
        vm.versionInfo = response.data.trim()
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>
