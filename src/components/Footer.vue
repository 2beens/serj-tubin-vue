<template>
  <v-footer
    dark
    padless
    fixed
  >
    <v-card
      class="flex"
      flat
      tile
    >
      <v-card-title class="teal">
        <strong class="subheading">Srđan Tubin, Berlin 2019/2020</strong>

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
          @click="goTo('github')"
        >
          <v-icon size="24px">
            mdi-github-circle
          </v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text class="py-2 white--text text-center">
        {{ new Date().getFullYear() }} — <strong>Vuetify</strong>
      </v-card-text>
    </v-card>
  </v-footer>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Footer',
  methods: {
    goTo: function (target) {
      alert(target)
    }
  },
  mounted: function () {
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/version')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('get version info: received null response / data')
          return
        }
        document.getElementById('version-info').innerHTML = '[' + response.data.trim() + ']'
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
div {
  /* color: cadetblue; */
}
</style>
