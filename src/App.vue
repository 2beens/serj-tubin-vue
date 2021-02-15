<template>
<v-app>
  <v-row>
    <v-col cols="4">
    </v-col>
    <v-col cols="4">
      <div id="nav" class="mt-2">
        <router-link to="/">Home</router-link> |
        <router-link to="/about">About</router-link> |
        <router-link to="/board">Visitor Board</router-link> |
        <router-link to="/util">Util</router-link> |
        <router-link to="/netlog">Netlog</router-link>
      </div>
    </v-col>

    <v-col cols="4">
      <LoginLogoutButton />
    </v-col>
  </v-row>
  <router-view />

  <Footer/>
</v-app>
</template>

<script>
import Footer from '@/components/Footer.vue'
import LoginLogoutButton from '@/components/LoginLogoutButton.vue'

export default {
  name: 'App',
  components: {
    Footer,
    LoginLogoutButton
  },
  mounted: function () {
    console.log('loaded env: ' + process.env.VUE_APP_ENV)

    const token = this.getCookie('sessionkolacic')
    if (token === undefined || token === null || token === '') {
      // console.warn('no token in cookies, not logged in')
      return
    }

    this.$root.loggedIn = true
  },
  watch: {
    $route (to, from) {
      console.log(`app: route change from ${from.path} to ${to.path}`)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #264e77;
  background-color: black;
}

#nav a {
  font-weight: bold;
  color: #264e77;
}

#nav a.router-link-exact-active {
  color: #259965;
}
</style>
