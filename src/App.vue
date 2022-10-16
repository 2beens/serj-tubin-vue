<template>
  <v-app>
    <v-app-bar app color="black">
      <v-spacer></v-spacer>
      <v-btn color="#305d8a" text rounded to="/">Home</v-btn>
      <v-btn color="#305d8a" text rounded to="/about">About</v-btn>
      <v-btn color="#305d8a" text rounded to="/board">Visitor Board</v-btn>
      <v-btn color="#305d8a" text rounded to="/util">Util</v-btn>
      <v-btn color="#305d8a" text rounded to="/netlog">Netlog 🕸</v-btn>
      <v-btn color="#305d8a" text rounded to="/url-shortener" v-if="this.$root.loggedIn">URLs 🌏</v-btn>
      <v-btn color="#305d8a" text rounded to="/notes" v-if="this.$root.loggedIn">Notes 📝</v-btn>
      <v-spacer></v-spacer>
      <LoginLogoutButton />
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

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
</style>
