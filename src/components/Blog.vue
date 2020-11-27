<template>
  <div id="blog" data-app="true">
    <h3>{{ title }}</h3>

    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Add Blog Post</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Title"
                  required
                  v-model="newPost.title"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  required
                  name="input-7-1"
                  filled
                  label="Content"
                  auto-grow
                  value=""
                  v-model="newPost.content"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Abort
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="addBlogPost"
          >
            Post!
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div id="blogs-list">
      <div v-for="post in posts" :key="post.id">
        <div class="blog-post" v-bind:id="'blog-' + post.id">
          <h4>{{ post.title }}</h4>
          <p>{{ post.content }}</p>
          <div class="delete-post-button">
            <v-btn class="mx-2" fab dark x-small color="error" @click="deletePost(post.id, post.title)">
              <v-icon dark>mdi-minus</v-icon>
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <div id="snackbar-div">
      <v-snackbar
        v-model="showSnackbar"
      >
        {{ snackbarText }}

        <template v-slot:action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
const qs = require('querystring')

export default {
  name: 'Blog',
  props: {
    title: String
  },
  data: function () {
    return {
      posts: [],
      dialog: false,
      newPost: {},
      snackbarText: '',
      showSnackbar: false
    }
  },
  methods: {
    deletePost: function (id, title) {
      if (!confirm('Are you sure you want to remove blog post [' + title + ']?')) {
        return
      }
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + '/blog/delete/' + id)
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete blog - received null response / data')
            return
          }
          if (!response.data.startsWith('deleted:')) {
            console.error('delete blog - invalid response received: ' + response.data)
            return
          }

          var removedPostIndex = -1
          var i
          for (i = 0; i < vm.posts.length; i++) {
            if (vm.posts[i].id === id) {
              removedPostIndex = i
              break
            }
          }

          if (removedPostIndex >= 0) {
            vm.posts.splice(removedPostIndex, 1)
            vm.snackbarText = `Post ${title} removed!`
          } else {
            console.error('failed to find deleted post')
            vm.snackbarText = `Post ${title} not removed :(`
          }

          vm.showSnackbar = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    addBlogPost: function (event) {
      if (this.newPost.title === undefined || this.newPost.title === '') {
        console.error('emtpy title')
        return
      }
      if (this.newPost.content === undefined || this.newPost.content === '') {
        console.error('emtpy content')
        return
      }

      const requestBody = {
        title: this.newPost.title,
        content: this.newPost.content
      }

      const vm = this
      axios
        .post(
          process.env.VUE_APP_API_ENDPOINT + '/blog/new',
          qs.stringify(requestBody))
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('added:')) {
            console.warn(response)
            return
          }

          const postId = response.data.split(':')[1]
          vm.posts.push({
            id: postId,
            title: requestBody.title,
            content: requestBody.content
          })

          vm.snackbarText = `Post ${requestBody.title} added!`
          vm.showSnackbar = true
        })
        .catch(function (error) {
          console.log(error)
        })
        .finally(() => {
          vm.dialog = false
        })
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
  border-left: 20px solid #42b983;
  border-radius: 5px;
  padding: 10px;
  position: relative;
}
.delete-post-button {
  top: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  margin-top: 10px;
}
#snackbar-div {
  margin-bottom: 200px;
}
</style>
