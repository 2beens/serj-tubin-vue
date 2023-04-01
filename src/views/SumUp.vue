<template>
  <v-container>
    <h2>📝 SumUp Testing / Experimenting / Learning 📝</h2>

    <v-row justify="center" style="margin-top: 20px;">

      <v-col cols="auto">
        <v-btn @click="login" height="72" min-width="164">
          Login with SumUp
        </v-btn>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-divider :thickness="6" color="white"></v-divider>
    </v-row>
    <v-row justify="center">
      <h3>Logged in as:</h3>
    </v-row>

  </v-container>
</template>

<script>
// import axios from 'axios'
import { createCodeVerifierAndChallenge, buildAuthorizationUrl } from '../oauth'

export default {
  name: 'SumUp',

  data: function () {
    return {
      //
    }
  },

  mounted: function () {
    console.log('mounted')
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    console.log('found code >', code)
  },

  methods: {
    async login() {
      const { verifier, challenge } = await createCodeVerifierAndChallenge();
      const clientId = process.env.VUE_APP_SUMUP_CLIENT_ID;
      const redirectUri = process.env.VUE_APP_SUMUP_REDIRECT_URI;
      const scope = 'payments user.app-settings transactions.history user.profile_readonly';

      const authUrl = buildAuthorizationUrl(clientId, redirectUri, challenge, scope);
      console.warn(authUrl.toString())
      window.location.href = authUrl.toString();
    },
    async makeApiRequest(url, accessToken) {
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    }
  }
}
</script>