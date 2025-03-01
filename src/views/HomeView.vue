<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="3" class="pa-0">
            <SideBar />
          </v-col>
          <v-col cols="6" class="pa-0">
            <h2>Work in constant progress 👨🏼‍💻🛠</h2>
            <img
              id="my-image"
              alt="serj-tubin"
              src="../assets/ja-2022-dec.jpg"
            />
            <h3 style="margin: 40px 0 0">A personal tech sandbox</h3>
            <h5>* not fully adapted to small screens yet 🤷‍♂️</h5>
          </v-col>
          <v-col cols="3" class="pa-0">
            <RightSideBar />
          </v-col>
        </v-row>

        <BlogsList title="Recent Posts" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SideBar from '@/components/SideBar.vue'
import RightSideBar from '@/components/RightSideBar.vue'
import BlogsList from '@/components/BlogsList.vue'

export default {
  name: 'HomeView',
  components: {
    SideBar,
    RightSideBar,
    BlogsList,
  },
}
</script>

<style scoped>
#my-image {
  border-radius: 50%;
  max-width: 35%;
  height: auto;
}

#my-image:hover {
  box-shadow: 0 0 8px 2px rgba(0, 140, 186, 0.5);
}
</style>
