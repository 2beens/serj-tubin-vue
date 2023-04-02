<template>
  <v-container id="main">
    <h2>📝 SumUp Testing / Experimenting / Learning 📝</h2>

    <v-row>
      <v-col cols="3"></v-col>
      <v-col cols="6">
        <v-row
          style="background-color: azure; margin-top: 20px; padding: 10px; border-radius: 20px"
        >
          <v-col cols="12">
            <v-text-field v-model="clientId" label="Client ID"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              v-model="clientSecret"
              variant="outlined"
              label="Client Secret"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-btn @click="onSetClientCredentialsClick" height="50" min-width="100" color="green">
              Set
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
    <v-row justify="center">
      <h5>
        * Will need to input those for now, to not leak client id and secret on the client side;
        will make a nodejs backend for exchanging the code for an access token.
      </h5>
    </v-row>

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
        <v-textarea v-model="userDetailsJson" rows="20" row-height="15" bg-color="light-blue" color="black"></v-textarea>
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
          <p v-if="tr.status === 'SUCCESSFUL'" style="background-color: green; border-radius: 5px">
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

    <v-row>
      <h3>Notes:</h3>
    </v-row>
    <v-row>
      <v-col>
        <p>How can we see the list of oauth apps we gave permissions to?</p>
        <p>Scopes do not seem to work properly; can login only if we omit the "scope" parameter.</p>
        <p>
          An error message gets written only in the URL:
          Requested+scope+is+invalid+or+not+available+to+this+client.
        </p>
      </v-col>
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
const redirectUri = process.env.VUE_APP_SUMUP_REDIRECT_URI

export default {
  name: 'SumUp',

  data: function () {
    return {
      clientId: '',
      clientSecret: '',
      user: null,
      userDetailsJson: null,
      merchantCode: '',
      transactions: null
    }
  },

  mounted: async function () {
    this.clientId = this.getCookie('clientId')
    this.clientSecret = this.getCookie('clientSecret')

    if (!this.clientId) {
      console.warn('client id missing')
      return
    }

    if (!this.clientSecret) {
      console.warn('client secret missing')
      return
    }

    if (this.user) {
      // user already loaded
      return
    }

    try {
      const userData = await this.getUserData()
      if (userData) {
        console.log('user data', userData)
        this.user = userData
        return
      }
    } catch (error) {
      console.error(error)
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
    exchangeCodeForToken(this.clientId, this.clientSecret, redirectUri, code, verifier)
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
    onSetClientCredentialsClick() {
      this.setCookie('clientId', this.clientId, 7)
      this.setCookie('clientSecret', this.clientSecret, 7)
    },
    async onLoginClick() {
      const { verifier, challenge } = await createCodeVerifierAndChallenge()
      this.setCookie('verifier', verifier, 1)

      // TODO: scope is ignored atm
      const scope = 'payments user.app-settings transactions.history user.profile_readonly'
      const authUrl = buildAuthorizationUrl(this.clientId, redirectUri, challenge, scope)
      window.location.href = authUrl.toString()
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
        headers: { Authorization: `Bearer ${accessToken}` }
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