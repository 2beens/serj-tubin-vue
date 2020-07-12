<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/board">Visitor Board</router-link> |
      <router-link to="/util">Util</router-link>
    </div>

    <router-view />

    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'

export default {
  name: 'App',
  components: {
    Footer
  },
  mounted: function () {
    console.log('loaded env: ' + process.env.VUE_APP_ENV)
  },
  watch: {
    $route (to, from) {
      console.log('app: route change to ' + to.path)
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
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #264e77;
}

#nav a.router-link-exact-active {
  color: #259965;
}
</style>
