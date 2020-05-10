<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link to="/util">Util</router-link>
    </div>

    <router-view />

    <footer class="s-footer fixed-bottom">
      <div class="row">
        <div class="col-sm-2">Srđan Tubin</div>
        <div class="col-sm-1">
          <a href="https://github.com/2beens" class="fa fa-github"></a>
        </div>
        <div class="col-sm-1">
          <a href="https://www.facebook.com/srdjantubin" class="fa fa-facebook"></a>
        </div>
      </div>
    </footer>
  </div>
</template>

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
