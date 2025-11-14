<template>
  <v-container
    id="main"
    :class="$vuetify.theme.dark ? 'theme--dark' : 'theme--light'"
  >
    <h2>📝 SumUp Testing / Experimenting / Learning 📝</h2>
    <h4>
      Use this page to log in to your
      <a href="https://sumup.com/">SumUp account</a>
      via OAuth2 and get your personal details, transactions, etc.
    </h4>

    <v-row justify="center" style="margin-top: 20px">
      <v-col v-if="user" cols="auto">
        <v-btn
          color="warning"
          height="72"
          min-width="164"
          @click="onLogoutClick"
        >
          Logout from SumUp
          <v-icon>mdi-logout</v-icon>
        </v-btn>
      </v-col>
      <v-col v-else cols="auto">
        <v-btn
          color="success"
          height="72"
          min-width="164"
          @click="onLoginClick"
        >
          Login with SumUp
          <v-icon>mdi-login</v-icon>
        </v-btn>
        <v-combobox
          v-model="environment"
          style="cursor: pointer; margin-top: 20px"
          :items="['local', 'theta', 'staging', 'live']"
          label="Environment"
          chips
          outlined
          :dark="$vuetify.theme.dark"
        />
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
        <v-divider
          :thickness="6"
          :color="$vuetify.theme.dark ? 'white' : 'grey darken-2'"
        />
      </v-row>
      <v-row>
        <v-col cols="auto">
          <v-btn
            color="info"
            height="50"
            min-width="120"
            @click="onGetMoreUserDetailsClick"
          >
            Get More User Details
            <v-icon>mdi-account-arrow-down</v-icon>
          </v-btn>
        </v-col>
        <v-col>
          <h3 class="merchant-code">
            {{ merchantCode }}
          </h3>
        </v-col>
      </v-row>
      <v-row v-if="userDetailsJson">
        <v-col>
          <v-textarea
            v-model="userDetailsJson"
            rows="20"
            row-height="15"
            :bg-color="$vuetify.theme.dark ? 'grey darken-3' : 'blue lighten-4'"
            :color="$vuetify.theme.dark ? 'white' : 'black'"
            :dark="$vuetify.theme.dark"
          />
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-divider
          :thickness="6"
          :color="$vuetify.theme.dark ? 'white' : 'grey darken-2'"
        />
      </v-row>
      <h3>Transactions</h3>
      <v-row>
        <v-col cols="auto">
          <v-btn
            color="info"
            height="50"
            min-width="120"
            @click="onGetTransactionsClick"
          >
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
              class="transaction-successful"
              style="border-radius: 5px; padding: 8px; margin: 4px 0"
            >
              ** {{ tr.timestamp }} ->
              <span class="transaction-amount">
                {{ tr.amount }}
              </span>
              {{ tr.currency }}: {{ tr.status }}, {{ tr.payout_plan }}
            </p>
            <p
              v-else-if="tr.status === 'FAILED'"
              class="transaction-failed"
              style="border-radius: 5px; padding: 8px; margin: 4px 0"
            >
              ** {{ tr.timestamp }} ->
              <span class="transaction-amount">
                {{ tr.amount }}
              </span>
              {{ tr.currency }}: {{ tr.status }}, {{ tr.payout_plan }}
            </p>
            <p
              v-else
              class="transaction-other"
              style="border-radius: 5px; padding: 8px; margin: 4px 0"
            >
              ** {{ tr.timestamp }} ->
              <span class="transaction-amount">
                {{ tr.amount }}
              </span>
              {{ tr.currency }}: {{ tr.status }}, {{ tr.payout_plan }}
            </p>
          </div>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-divider
          :thickness="6"
          :color="$vuetify.theme.dark ? 'white' : 'grey darken-2'"
        />
      </v-row>
    </div>

    <div id="snackbar-div">
      <v-snackbar v-model="showSnackbar" :dark="$vuetify.theme.dark">
        {{ snackbarText }}

        <template #action="{ attrs }">
          <v-btn color="pink" variant="text" v-bind="attrs" @click="showSnackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>

    <v-row>
      <h3>Notes:</h3>
    </v-row>
    <v-row style="text-align: left">
      <v-col>
        <ul>
          <li>
            How can we see the list of oauth apps we gave permissions to in the
            SumUp Dashboard?
          </li>
          <li>
            Scopes do not seem to work properly; can login only if we omit the
            "scope" parameter.
          </li>
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
  exchangeCodeForAccessToken,
} from '../oauth'

const redirectUri = import.meta.env.VITE_SUMUP_REDIRECT_URI

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
      showSnackbar: false,
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
    exchangeCodeForAccessToken(
      code,
      redirectUri,
      foundVerifier,
      this.environment
    )
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
          window.location.protocol +
          '//' +
          window.location.host +
          window.location.pathname
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
      const clientId = import.meta.env.VITE_SUMUP_CLIENT_ID
      const scope =
        'payments user.app-settings transactions.history user.profile_readonly'
      const authUrlInfo = buildAuthorizationUrl(
        clientId,
        redirectUri,
        challenge,
        scope,
        this.environment
      )

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
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      return response.data
    },
    async getUserData() {
      return await this.makeApiRequest(
        'https://api.sumup.com/v0.1/me/personal-profile'
      )
    },
    async listTransactions() {
      return await this.makeApiRequest(
        'https://api.sumup.com/v0.1/me/transactions/history'
      )
    },
    async getMoreUserDetails() {
      return await this.makeApiRequest('https://api.sumup.com/v0.1/me')
    },
  },
}
</script>

<style scoped>
#main {
  margin-top: 30px;
  border-radius: 10px;
  padding: 50px;
  transition: all 0.3s ease;
}

/* Dark theme styles */
.theme--dark #main {
  color: #e6f3ff;
  background-color: #2a3441; /* brighter azure background */
  border: 1px solid rgba(64, 169, 255, 0.4);
}

/* Light theme styles */
.theme--light #main {
  color: #2c3e50;
  background-color: #f0f8ff;
  border: 1px solid rgba(0, 122, 204, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Theme-aware transaction styles */
.theme--dark .transaction-successful {
  background-color: #4caf50 !important;
  color: white;
}

.theme--light .transaction-successful {
  background-color: #c8e6c9 !important;
  color: #2e7d32;
}

.theme--dark .transaction-failed {
  background-color: #f44336 !important;
  color: white;
}

.theme--light .transaction-failed {
  background-color: #ffcdd2 !important;
  color: #c62828;
}

.theme--dark .transaction-other {
  background-color: #9e9e9e !important;
  color: white;
}

.theme--light .transaction-other {
  background-color: #f5f5f5 !important;
  color: #424242;
}

.transaction-amount {
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin: 0 4px;
}

.theme--dark .transaction-amount {
  background-color: #1a1f2e;
  color: #87ceeb;
}

.theme--light .transaction-amount {
  background-color: #ffffff;
  color: #000000;
  border: 1px solid #ddd;
}

/* Theme-aware merchant code styling */
.theme--dark .merchant-code {
  color: #40a9ff !important;
}

.theme--light .merchant-code {
  color: #007acc !important;
}
</style>
