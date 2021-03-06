<template>
  <div id="blog" data-app="true">
    <h3>{{ title }}</h3>

    <v-dialog
      v-model="dialog"
      v-if="theRoot.loggedIn"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="teal lighten-1"
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
          <span v-if="editBlogMode" class="headline">Edit Blog Post</span>
          <span v-else class="headline">Add Blog Post</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="Title"
                  required
                  v-model="selectedPost.title"
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
                  v-model="selectedPost.content"
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
            @click="abortEditPost"
          >
            Abort
          </v-btn>
          <v-btn
            v-if="editBlogMode"
            color="blue darken-1"
            text
            @click="updateBlogPost"
          >
            Update!
          </v-btn>
          <v-btn
            v-else
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
          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="8">
              <h4 class="blog-post-title">{{ post.title }}</h4>
            </v-col>
            <v-col cols="2">
              <p class="blog-post-date">{{ date2string(Date.parse(post.created_at)) }}</p>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10">
              <span v-html="post.content"></span>
            </v-col>
            <v-col v-if="theRoot.loggedIn" cols="1">
              <div class="delete-post-button">
                <v-btn class="mx-2" fab dark x-small color="cyan" @click="openEditPostDialog(post)">
                  <v-icon dark>mdi-pencil</v-icon>
                </v-btn>
                <v-btn class="mx-2" fab dark x-small color="error" @click="deletePost(post.id, post.title)">
                  <v-icon dark>mdi-minus</v-icon>
                </v-btn>
              </div>
            </v-col>
            <v-col v-else cols="1"></v-col>
          </v-row>
        </div>
      </div>

      <!-- PAGNIATION HERE -->
      <div class="text-center">
        <v-pagination
          @input="onBlogPageChange"
          v-if="posts.length > 0"
          v-model="blogPage"
          :length="blogPageLength"
          :total-visible="7"
        ></v-pagination>
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
      editBlogMode: false,
      blogPage: 1,
      maxPostsPerPage: 5,
      blogPageLength: 0,
      posts: [],
      dialog: false,
      selectedPost: {},
      editedPost: {},
      snackbarText: '',
      showSnackbar: false,
      theRoot: this.$root
    }
  },
  methods: {
    onBlogPageChange (page) {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + `/blog/page/${page}/size/${vm.maxPostsPerPage}`)
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all blogs - received null response / data')
            return
          }
          vm.posts = response.data.posts
          vm.blogPageLength = Math.ceil(response.data.total / vm.maxPostsPerPage)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    deletePost: function (id, title) {
      if (!confirm('Are you sure you want to remove blog post [' + title + ']?')) {
        return
      }

      const vm = this
      axios
        .delete(
          process.env.VUE_APP_API_ENDPOINT + '/blog/delete/' + id, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          })
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
      this.editBlogMode = false

      if (this.selectedPost.title === undefined || this.selectedPost.title === '') {
        console.error('emtpy title')
        return
      }
      if (this.selectedPost.content === undefined || this.selectedPost.content === '') {
        console.error('emtpy content')
        return
      }

      const requestBody = {
        title: this.selectedPost.title,
        content: this.selectedPost.content
      }

      const vm = this
      axios
        .post(
          process.env.VUE_APP_API_ENDPOINT + '/blog/new',
          qs.stringify(requestBody), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('added:')) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          const postId = response.data.split(':')[1]
          vm.posts.unshift({
            id: postId,
            title: requestBody.title,
            content: requestBody.content,
            created_at: vm.date2string(Date.now())
          })

          if (vm.posts.length > vm.maxPostsPerPage) {
            vm.posts.pop()
          }

          vm.snackbarText = `Post ${requestBody.title} added!`
          vm.showSnackbar = true
          vm.selectedPost = {}
        })
        .catch(function (error) {
          vm.snackbarText = error
          vm.showSnackbar = true
          console.log(error)
        })
        .finally(() => {
          vm.dialog = false
        })
    },
    abortEditPost: function () {
      this.selectedPost.title = this.editedPost.title
      this.selectedPost.content = this.editedPost.content
      this.editedPost = {}
      this.dialog = false
    },
    openEditPostDialog: function (post) {
      this.editBlogMode = true
      this.dialog = true
      this.editedPost = Object.assign({}, post)
      this.selectedPost = post
    },
    updateBlogPost: function () {
      if (this.selectedPost.title === undefined || this.selectedPost.title === '') {
        console.error('emtpy title')
        return
      }
      if (this.selectedPost.content === undefined || this.selectedPost.content === '') {
        console.error('emtpy content')
        return
      }

      const requestBody = {
        id: this.selectedPost.id,
        title: this.selectedPost.title,
        content: this.selectedPost.content
      }

      const vm = this
      axios
        .post(
          process.env.VUE_APP_API_ENDPOINT + '/blog/update',
          qs.stringify(requestBody), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('updated:')) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          const postId = response.data.split(':')[1]
          vm.snackbarText = `Post ${postId} ${requestBody.title} updated!`
          vm.showSnackbar = true
          vm.selectedPost = {}
        })
        .catch(function (error) {
          vm.snackbarText = error
          vm.showSnackbar = true
          console.log(error)
        })
        .finally(() => {
          this.editBlogMode = false
          this.dialog = false
        })
    }
  },
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + `/blog/page/${vm.blogPage}/size/${vm.maxPostsPerPage}`)
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('all blogs - received null response / data')
          return
        }
        vm.posts = response.data.posts
        vm.blogPageLength = Math.ceil(response.data.total / vm.maxPostsPerPage)
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
  border-left: 20px solid #26A69A;
  border-radius: 5px;
  padding: 10px;
  position: relative;
}
.blog-post-title {
  border-bottom: 10px solid #26A69A;
  border-radius: 5px;
}
.blog-post-date {
  background-color: #26A69A;
  border-radius: 5px;
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
