<template>
  <v-container id="main">
    <h2>📝 SumUp Testing / Experimenting / Learning 📝</h2>

    <v-row justify="center" style="margin-top: 20px">
      <v-col v-if="user" cols="auto">
        <v-btn @click="onLogoutClick" height="72" min-width="164"> Logout from SumUp </v-btn>
      </v-col>
      <v-col v-else cols="auto">
        <v-btn @click="onLoginClick" height="72" min-width="164"> Login with SumUp </v-btn>
      </v-col>
    </v-row>

    <v-row v-if="user" justify="center">
      <v-col>
        <h3>Logged in as: {{ user.first_name }} {{ user.last_name }}</h3>
        <h4>Phone: {{ user.mobile_phone }}</h4>
        <h4>Location: {{ user.address.city }}, {{ user.address.country }}</h4>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-divider :thickness="6" color="white"></v-divider>
    </v-row>

    <v-row>
      <h3>Notes:</h3>
    </v-row>
    <v-row>
      <ul>
        <li>How can we see the list of oauth apps we gave permissions to?</li>
      </ul>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import {
  createCodeVerifierAndChallenge,
  buildAuthorizationUrl,
  exchangeCodeForToken
} from '../oauth'
const clientId = process.env.VUE_APP_SUMUP_CLIENT_ID
const redirectUri = process.env.VUE_APP_SUMUP_REDIRECT_URI
const clientSecret = process.env.VUE_APP_SUMUP_CLIENT_SECRET

export default {
  name: 'SumUp',

  data: function () {
    return {
      user: null
    }
  },

  mounted: async function () {
    const userData = await this.getUserData()
    if (userData) {
      console.log('user data', userData)
      this.user = userData
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (!code) {
      return
    }

    const verifier = this.getCookie('verifier')
    console.log('found code >', code)
    console.log('found verifier >', verifier)

    const vm = this
    exchangeCodeForToken(clientId, clientSecret, redirectUri, code, verifier)
      .then((tokenData) => {
        console.log('received token data', tokenData)
        vm.setCookie('access_token', tokenData.access_token, 7)
        vm.setCookie('refresh_token', tokenData.refresh_token, 7)
        vm.eraseCookie('verifier')

        // remove the search part from the URL
        const newUrl =
          window.location.protocol + '//' + window.location.host + window.location.pathname
        // replace the displayed URL in the address bar
        window.history.replaceState({}, document.title, newUrl)
        window.location.reload()
      })
      .catch((error) => {
        console.error(error)
      })
  },

  methods: {
    async onLoginClick() {
      const { verifier, challenge } = await createCodeVerifierAndChallenge()
      this.setCookie('verifier', verifier, 1)

      // TODO: scope is ignored atm
      const scope = 'payments user.app-settings transactions.history user.profile_readonly'
      const authUrl = buildAuthorizationUrl(clientId, redirectUri, challenge, scope)
      window.location.href = authUrl.toString()
    },
    onLogoutClick() {
      this.eraseCookie('access_token')
      this.eraseCookie('refresh_token')
      location.reload()
    },
    async makeApiRequest(url) {
      const accessToken = this.getCookie('access_token')
      if (!accessToken) {
        console.error(`can't make a request, no access token`)
        return null
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      return response.data
    },
    async getUserData() {
      return await this.makeApiRequest('https://api.sumup.com/v0.1/me/personal-profile')
    }
  }
}
</script>

<style scoped>
#main {
  margin-top: 30px;
  border-radius: 10px;
  color: white;
  padding: 50px;
  background-color: cadetblue;
}
</style>