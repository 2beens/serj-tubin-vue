<template>
  <div class="home">
    <h1>Work in progress 👨🏼‍💻</h1>
    <img id="my-image" alt="serj-tubin" src="../assets/ja.png">

    <SideBar />

    <HomePage msg="Welcome to my personal nothingness!"/>

    <!-- <div id="app">
      <link-prevue url="https://www.accountingcoach.com/"></link-prevue>
    </div> -->
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from '@/components/HomePage.vue'
import SideBar from '@/components/SideBar.vue'
// import LinkPrevue from 'link-prevue'

export default {
  name: 'Home',
  components: {
    HomePage,
    SideBar
    // https://morioh.com/p/faa3a48bf0d6
    // LinkPrevue
  }
}
</script>

<style scoped>
#my-image {
    border-radius: 50%;
    max-width: 20%;
    height: auto;
    /* float: right; */
}

#my-image:hover {
    box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}
</style>
