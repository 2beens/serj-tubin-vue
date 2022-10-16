<template>
  <v-container fluid>
    <v-row>
      <v-spacer></v-spacer>
      <v-col>
        <h2>Work in constant progress 👨🏼‍💻🛠</h2>
        <img id="my-image" alt="serj-tubin" src="../assets/ja.png">
      </v-col>
      <v-spacer></v-spacer>
    </v-row>

    <SideBar />

    <v-row>
      <HomePage title="A personal tech sandbox"/>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import HomePage from '@/components/HomePage.vue'
import SideBar from '@/components/SideBar.vue'

export default {
  name: 'Home',
  components: {
    HomePage,
    SideBar
  }
}
</script>

<style scoped>
#my-image {
    border-radius: 50%;
    max-width: 60%;
    height: auto;
}

#my-image:hover {
    box-shadow: 0 0 8px 2px rgba(0, 140, 186, 0.5);
}
</style>
