<template>
  <v-container>
    <h2>📝 SumUp Testing / Experimenting / Learning 📝</h2>

    <v-row justify="center" style="margin-top: 20px;">

      <v-col cols="auto">
        <v-btn @click="onLoginClick" height="72" min-width="164">
          Login with SumUp
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-divider :thickness="6" color="white"></v-divider>
    </v-row>
    <v-row v-if="user" justify="center">
      <h3>Logged in as: {{ user.first_name }} {{ user.last_name }}</h3>
    </v-row>

  </v-container>
</template>

<script>
import axios from 'axios'
import { createCodeVerifierAndChallenge, buildAuthorizationUrl, exchangeCodeForToken } from '../oauth'
const clientId = process.env.VUE_APP_SUMUP_CLIENT_ID;
const redirectUri = process.env.VUE_APP_SUMUP_REDIRECT_URI;
const clientSecret = process.env.VUE_APP_SUMUP_CLIENT_SECRET;

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

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (!code) {
      return;
    }

    const verifier = this.getCookie('verifier')
    console.log('found code >', code);
    console.log('found verifier >', verifier);

    const vm = this
    exchangeCodeForToken(clientId, clientSecret, redirectUri, code, verifier)
      .then(tokenData => {
        console.log('received token data', tokenData)
        vm.setCookie('access_token', tokenData.access_token, 7)
        vm.setCookie('refresh_token', tokenData.refresh_token, 7)

        // TODO: load user

      })
      .catch(error => {
        console.error(error);
      });
  },

  methods: {
    async onLoginClick() {
      const { verifier, challenge } = await createCodeVerifierAndChallenge();
      this.setCookie('verifier', verifier, 1)

      // TODO: scope is ignored atm
      const scope = 'payments user.app-settings transactions.history user.profile_readonly';
      const authUrl = buildAuthorizationUrl(clientId, redirectUri, challenge, scope);
      console.warn(authUrl.toString())
      window.location.href = authUrl.toString();
    },
    async makeApiRequest(url) {
      const accessToken = this.getCookie('access_token')
      if (!accessToken) {
        console.error(`can't make a request, no access token`)
        return null
      }

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    },
    async getUserData() {
      // curl -L -X GET 'https://api.sumup.com/v0.1/me/personal-profile' \
      // -H 'Accept: application/json' \
      // -H 'Authorization: Bearer <TOKEN>'
      return await this.makeApiRequest('https://api.sumup.com/v0.1/me/personal-profile')
    }
  }
}
</script>