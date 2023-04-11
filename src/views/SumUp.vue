<template>
  <v-container id="main">
    <h2>📝 SumUp Testing / Experimenting / Learning 📝</h2>
    <h4>Use this page to log in to your <a href="https://sumup.com/">SumUp account</a> via OAuth2 and get your personal details, transactions,
      etc.</h4>

    <v-row justify="center" style="margin-top: 20px">
      <v-col v-if="user" cols="auto">
        <v-btn @click="onLogoutClick" color="warning" height="72" min-width="164">
          Logout from SumUp
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col>
      <v-col v-else cols="auto">
        <v-btn @click="onLoginClick" color="success" height="72" min-width="164">
          Login with SumUp
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <v-combobox
          style="cursor: pointer; margin-top: 20px;"
          v-model="environment"
          :items="['local', 'theta', 'staging', 'live']"
          label="Environment"
          chips
          outlined
        ></v-combobox>
      </v-col>
    </v-row>

    <div v-if="user">
      <v-row justify="center">
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
        <v-col cols="auto">
          <v-btn @click="onGetMoreUserDetailsClick" color="info" height="50" min-width="120">
            Get More User Details
            <v-icon>mdi-account-arrow-down</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <h3 style="color: aquamarine">{{ merchantCode }}</h3>
        </v-col>
      </v-row>
      <v-row v-if="userDetailsJson">
        <v-col>
          <v-textarea
            v-model="userDetailsJson"
            rows="20"
            row-height="15"
            bg-color="light-blue"
            color="black"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-divider :thickness="6" color="white"></v-divider>
      </v-row>
      <h3>Transactions</h3>
      <v-row>
        <v-col cols="auto">
          <v-btn @click="onGetTransactionsClick" color="info" height="50" min-width="120">
            Get Transaction History
            <v-icon>mdi-cash</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="transactions" cols="10">
          <div v-for="tr in transactions" :key="tr.id">
            <p
              v-if="tr.status === 'SUCCESSFUL'"
              style="background-color: green; border-radius: 5px"
            >
              ** {{ tr.timestamp }} ->
              <span style="font-weight: bold; background-color: black">{{ tr.amount }}</span>
              {{ tr.currency }}: {{ tr.status }}, {{ tr.payout_plan }}
            </p>
            <p v-else-if="tr.status === 'FAILED'" style="background-color: red; border-radius: 5px">
              ** {{ tr.timestamp }} ->
              <span style="font-weight: bold; background-color: black">{{ tr.amount }}</span>
              {{ tr.currency }}: {{ tr.status }}, {{ tr.payout_plan }}
            </p>
            <p v-else style="background-color: gray">
              ** {{ tr.timestamp }} ->
              <span style="font-weight: bold; background-color: black; border-radius: 5px">{{
                  tr.amount
                }}</span>
              {{ tr.currency }}: {{ tr.status }}, {{ tr.payout_plan }}
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-divider :thickness="6" color="white"></v-divider>
      </v-row>
    </div>

    <div id="snackbar-div">
      <v-snackbar v-model="showSnackbar">
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false"> Close </v-btn>
        </template>
      </v-snackbar>
    </div>

    <v-row>
      <h3>Notes:</h3>
    </v-row>
    <v-row style="text-align: left;">
      <v-col>
        <ul>
          <li>How can we see the list of oauth apps we gave permissions to in the SumUp Dashboard?</li>
          <li>Scopes do not seem to work properly; can login only if we omit the "scope" parameter.</li>
          <li>
            An error message gets written only in the URL:
            Requested+scope+is+invalid+or+not+available+to+this+client.
          </li>
        </ul>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import {
  createCodeVerifierAndChallenge,
  buildAuthorizationUrl,
  exchangeCodeForAccessToken
} from '../oauth'

const redirectUri = process.env.VUE_APP_SUMUP_REDIRECT_URI

export default {
  name: 'SumUp',

  data: function () {
    return {
      user: null,
      userDetailsJson: null,
      merchantCode: '',
      transactions: null,
      environment: 'live',
      snackbarText: '',
      showSnackbar: false
    }
  },

  mounted: async function () {
    if (this.user) {
      // user already loaded
      console.log('mounted: user already loaded')
      return
    }

    try {
      const userData = await this.getUserData()
      if (userData) {
        console.log('user data:', userData)
        this.user = userData
        return
      }
    } catch (error) {
      this.user = null
      console.error(error)
    }

    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    if (!code) {
      console.warn('missing state param')
      return
    }

    const state = urlParams.get('state')
    if (!state) {
      console.warn('missing state param')
      return
    }

    const foundVerifier = this.getCookie('verifier')
    const foundState = this.getCookie('state')
    console.log('received code >', code)
    console.log('received state >', state)
    console.log('found state >', foundState)
    console.log('found verifier >', foundVerifier)

    if (state !== foundState) {
      console.error('found/sent state not equal to received state')
      this.snackbarText = `found/sent state not equal to received state`
      this.showSnackbar = true
      return
    }

    const vm = this
    exchangeCodeForAccessToken(code, redirectUri, foundVerifier, this.environment)
      .then((respData) => {
        console.log('received token response data', respData)
        if (respData.error) {
          vm.snackbarText = `${respData.error}: ${respData.error_description}`
          vm.showSnackbar = true
          return
        }

        vm.setCookie('access_token', respData.access_token, 7)
        vm.setCookie('refresh_token', respData.refresh_token, 7)
        vm.eraseCookie('verifier')
        vm.eraseCookie('state')

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
      const {verifier, challenge} = await createCodeVerifierAndChallenge()
      this.setCookie('verifier', verifier, 1)

      // TODO: scope is ignored atm
      const clientId = process.env.VUE_APP_SUMUP_CLIENT_ID
      const scope = 'payments user.app-settings transactions.history user.profile_readonly'
      const authUrlInfo = buildAuthorizationUrl(clientId, redirectUri, challenge, scope, this.environment)

      const state = authUrlInfo.state
      this.setCookie('state', state, 1)

      window.location.href = authUrlInfo.url.toString()
    },
    async onGetTransactionsClick() {
      const transactions = await this.listTransactions()
      console.log(transactions)
      if (!transactions) {
        return
      }
      this.transactions = transactions.items
    },
    async onGetMoreUserDetailsClick() {
      console.log('getting more user data ...')
      const userDetails = await this.getMoreUserDetails()
      this.userDetailsJson = JSON.stringify(userDetails, null, 2)
      this.merchantCode = userDetails.merchant_profile.merchant_code
      console.log(this.merchantCode, userDetails)
    },
    onLogoutClick() {
      this.eraseCookie('access_token')
      this.eraseCookie('refresh_token')
      location.reload()
    },
    async makeApiRequest(url) {
      const accessToken = this.getCookie('access_token')
      if (!accessToken) {
        console.log(`can't make a request, no access token`)
        return null
      }

      const response = await axios.get(url, {
        headers: {Authorization: `Bearer ${accessToken}`}
      })
      return response.data
    },
    async getUserData() {
      return await this.makeApiRequest('https://api.sumup.com/v0.1/me/personal-profile')
    },
    async listTransactions() {
      return await this.makeApiRequest('https://api.sumup.com/v0.1/me/transactions/history')
    },
    async getMoreUserDetails() {
      return await this.makeApiRequest('https://api.sumup.com/v0.1/me')
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
