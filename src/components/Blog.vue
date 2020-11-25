<template>
  <div id="blog">
    <h3>{{ title }}</h3>
    <v-btn
      class="mx-2"
      fab
      dark
      small
      color="primary"
    >
      <v-icon dark>
        mdi-minus
      </v-icon>
    </v-btn>
    <div id="blogs-list">
      <div v-for="post in posts" :key="post.id">
        <div class="blog-post" v-bind:id="'blog-' + post.id">
          <h4>{{ post.title }}</h4>
          <p>{{ post.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Blog',
  props: {
    title: String
  },
  data: function () {
    return {
      posts: []
    }
  },
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/blog/all')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('all blogs - received null response / data')
          return
        }
        vm.posts = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
#blog {
  margin-bottom: 100px;
}
.blog-post {
  margin: 15px 15% 15px 15%;

  background-color: cadetblue;
  border-left: 20px solid #42b983;;
  border-radius: 5px;
}
</style>
