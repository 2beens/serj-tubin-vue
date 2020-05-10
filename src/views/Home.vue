<template>
  <div class="home">
    <h1>Work in progress</h1>
    <img id="my-image" alt="serj-tubin" src="../assets/ja.png">
    <HomePage msg="Welcome to my personal nothingness!"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomePage from '@/components/HomePage.vue'

export default {
  name: 'Home',
  components: {
    HomePage
  }
}
</script>

<style scoped>
#my-image {
    border-radius: 50%;
    max-width: 25%;
    height: auto;
    /* float: right; */
}

#my-image:hover {
    box-shadow: 0 0 2px 1px rgba(0, 140, 186, 0.5);
}
</style>
