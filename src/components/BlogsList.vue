<template>
  <div class="blogs-container">
    <div class="d-flex align-center justify-space-between mb-4">
      <h2
        :class="
          $vuetify.theme.dark
            ? 'text-h4 teal--text text--lighten-1'
            : 'text-h4 blue--text text--darken-2'
        "
      >
        {{ title }}
      </h2>

      <!-- Add new blog post button -->
      <v-btn
        v-if="theRoot.loggedIn"
        color="teal lighten-1"
        dark
        @click="dialog = true"
        class="ml-4"
      >
        <v-icon left>mdi-plus</v-icon>
        Add Post
      </v-btn>
    </div>

    <v-card
      v-for="post in posts"
      :key="post.id"
      :dark="$vuetify.theme.dark"
      :color="
        $vuetify.theme.dark
          ? 'rgba(13, 71, 71, 0.6)'
          : 'rgba(255, 255, 255, 0.9)'
      "
      class="blog-post mb-6 custom-card"
      elevation="0"
    >
      <!-- Post Header -->
      <div class="post-header">
        <v-card-title
          class="d-flex flex-column align-start justify-space-between pa-4 pb-2"
        >
          <div class="d-flex justify-space-between align-center w-100">
            <span class="text-h5">{{ post.title }}</span>
            <div class="d-flex align-center">
              <div class="action-buttons">
                <v-btn icon small @click="clap(post)" class="mr-1">
                  <v-icon color="teal lighten-1">mdi-hand-clap</v-icon>
                </v-btn>
                <span
                  class="text-caption teal--text text--lighten-1 clap-count"
                >
                  {{ post.claps || 0 }}
                </span>
              </div>
              <div v-if="theRoot.loggedIn" class="d-flex ml-4">
                <v-btn
                  icon
                  small
                  class="mr-2"
                  @click="openEditPostDialog(post)"
                >
                  <v-icon color="teal lighten-1">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon small @click="deletePost(post.id, post.title)">
                  <v-icon color="red lighten-1">mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <span
            v-if="post.created_at"
            class="post-date text-subtitle-2 grey--text mt-1 mb-1"
          >
            {{ formatDate(post.created_at) }}
          </span>
        </v-card-title>
        <v-divider class="mx-4 mb-2 teal--text text--lighten-1"></v-divider>
      </div>

      <v-card-text class="pt-4">
        <div
          class="blog-content"
          v-if="post.content"
          v-html="post.content"
        ></div>

        <div
          class="embedded-content mt-4"
          v-if="post.embedded"
          v-html="post.embedded"
        ></div>
      </v-card-text>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card :dark="$vuetify.theme.dark">
        <v-card-title>
          <span class="text-h5">
            {{ editBlogMode ? 'Edit Post' : 'New Post' }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="selectedPost.title"
                  label="Title"
                  required
                  :dark="$vuetify.theme.dark"
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="selectedPost.content"
                  label="Content"
                  required
                  :dark="$vuetify.theme.dark"
                  rows="10"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey darken-1"
            text
            @click="editBlogMode ? abortEditPost() : (dialog = false)"
          >
            Cancel
          </v-btn>
          <v-btn
            color="teal lighten-1"
            text
            @click="editBlogMode ? updateBlogPost() : addBlogPost()"
          >
            {{ editBlogMode ? 'Update' : 'Add' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="3000"
      color="teal lighten-1"
      :dark="$vuetify.theme.dark"
    >
      {{ snackbarText }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'BlogsList',
  props: {
    title: String,
  },
  data: function () {
    return {
      editBlogMode: false,
      blogPage: 1,
      maxPostsPerPage: 20,
      blogPageLength: 0,
      posts: [],
      dialog: false,
      selectedPost: {},
      editedPost: {},
      snackbarText: '',
      showSnackbar: false,
      theRoot: this.$root,
      screenWidth: window.innerWidth,
    }
  },
  mounted: function () {
    window.addEventListener('resize', this.handleResize)

    const vm = this
    axios
      .get(
        process.env.VUE_APP_API_ENDPOINT +
          `/blog/page/${vm.blogPage}/size/${vm.maxPostsPerPage}`
      )
      .then((response) => {
        if (!response || !response.data) {
          console.error('all blogs - received null response / data')
          vm.posts = []
          return
        }
        vm.posts = response.data.posts
        vm.blogPageLength = Math.ceil(response.data.total / vm.maxPostsPerPage)
      })
      .catch((error) => {
        console.log(error)
      })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },

  computed: {
    isSmallScreen() {
      return this.screenWidth <= 600
    },
  },

  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth
    },
    onBlogPageChange(page) {
      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/blog/page/${page}/size/${vm.maxPostsPerPage}`
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all blogs - received null response / data')
            return
          }
          vm.posts = response.data.posts
          vm.blogPageLength = Math.ceil(
            response.data.total / vm.maxPostsPerPage
          )
        })
        .catch((error) => {
          console.log(error)
        })
    },
    clap: function (post) {
      const requestBody = {
        id: post.id,
      }

      const vm = this
      axios
        .patch(process.env.VUE_APP_API_ENDPOINT + '/blog/clap', requestBody, {
          headers: {
            // TODO: cookies are sent with each request, no need to place them in headers
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('updated:')) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          const receivedPostId = response.data.split(':')[1]
          if (receivedPostId !== post.id) {
            console.warn(
              'received different blog post id from server',
              post.id,
              'vs',
              receivedPostId
            )
          }
          post.claps++
        })
        .catch(function (error) {
          vm.snackbarText = error
          vm.showSnackbar = true
          console.log(error)
        })
    },
    deletePost: function (id, title) {
      if (
        !confirm('Are you sure you want to remove blog post [' + title + ']?')
      ) {
        return
      }

      const vm = this
      axios
        .delete(process.env.VUE_APP_API_ENDPOINT + '/blog/delete/' + id, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete blog - received null response / data')
            return
          }
          if (!response.data.startsWith('deleted:')) {
            console.error(
              'delete blog - invalid response received: ' + response.data
            )
            return
          }

          let removedPostIndex = -1
          let i
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
    addBlogPost: function () {
      this.editBlogMode = false

      if (
        this.selectedPost.title === undefined ||
        this.selectedPost.title === ''
      ) {
        console.error('emtpy title')
        return
      }
      if (
        this.selectedPost.content === undefined ||
        this.selectedPost.content === ''
      ) {
        console.error('emtpy content')
        return
      }

      const requestBody = {
        title: this.selectedPost.title,
        content: this.selectedPost.content,
      }

      const vm = this
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + '/blog/new', requestBody, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            'Content-Type': 'application/json',
          },
        })
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('added:')) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          if (!vm.posts) {
            vm.posts = []
          }

          const postId = response.data.split(':')[1]
          vm.posts.unshift({
            id: postId,
            title: requestBody.title,
            content: requestBody.content,
            created_at: vm.date2string(Date.now()),
            claps: 0,
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
      if (
        this.selectedPost.title === undefined ||
        this.selectedPost.title === ''
      ) {
        console.error('emtpy title')
        return
      }
      if (
        this.selectedPost.content === undefined ||
        this.selectedPost.content === ''
      ) {
        console.error('emtpy content')
        return
      }

      const requestBody = {
        id: parseInt(this.selectedPost.id),
        title: this.selectedPost.title,
        content: this.selectedPost.content,
      }

      const vm = this
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + '/blog/update', requestBody, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            'Content-Type': 'application/json',
          },
        })
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
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    },
  },
}
</script>

<style scoped>
.blogs-container {
  width: 100%;
  margin: 0 auto;
}

.blog-post {
  border: none;
  border-radius: 12px;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  margin-bottom: 2rem;
  overflow: hidden;
  position: relative;
}

/* Dark theme styles */
.theme--dark .blog-post {
  background: rgba(13, 71, 71, 0.6) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
}

.theme--dark .blog-post:hover {
  background: rgba(19, 106, 106, 0.75) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3) !important;
}

/* Light theme styles */
.theme--light .blog-post {
  background: rgba(255, 255, 255, 0.9) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  border: 1px solid rgba(25, 118, 210, 0.2);
}

.theme--light .blog-post:hover {
  background: rgba(255, 255, 255, 1) !important;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
  border-color: rgba(25, 118, 210, 0.3);
}

.post-header {
  background: rgba(38, 166, 154, 0.1);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

.post-header .v-card-title {
  padding-bottom: 0;
}

.post-title {
  font-size: 1.5rem;
  margin-bottom: 8px;
}

.post-date {
  font-size: 0.9rem;
  opacity: 0.8;
  font-style: italic;
}

/* Theme-aware post title and date colors */
.theme--light .post-date {
  color: #666666 !important;
}

.theme--light .v-card-title {
  color: #212121 !important;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.clap-count {
  min-width: 24px;
  text-align: right;
}

/* Content styles */
.blog-content {
  padding: 0.5rem 0;
}

/* Dark theme blog content */
.theme--dark .blog-content ::v-deep(*) {
  color: #fff;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

/* Light theme blog content */
.theme--light .blog-content ::v-deep(*) {
  color: #212121 !important;
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.blog-content ::v-deep(a) {
  color: #26a69a;
  text-decoration: none;
  transition: all 0.2s ease;
}

.blog-content ::v-deep(a:hover) {
  color: #4db6ac;
  text-decoration: underline;
}

.embedded-content {
  width: 100%;
  margin: 1rem 0;
  border-radius: 8px;
  padding: 1rem;
  border: none;
}

/* Theme-aware embedded content */
.theme--dark .embedded-content {
  background: rgba(0, 0, 0, 0.3);
}

.theme--light .embedded-content {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.embedded-content ::v-deep(iframe) {
  width: 100%;
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

/* Dividers */
::v-deep .v-divider {
  opacity: 0.2;
  border-color: #26a69a !important;
}

/* Button styles */
.v-btn.v-btn--icon {
  transition: all 0.3s ease;
  opacity: 0.85;
}

.v-btn.v-btn--icon:hover {
  transform: scale(1.15);
  background: rgba(38, 166, 154, 0.15);
  opacity: 1;
}

/* Responsive adjustments */
@media (min-width: 601px) {
  .blog-post {
    padding: 0;
    margin-bottom: 2.5rem;
  }

  .post-header {
    padding: 8px 16px 0;
  }

  .v-card-text {
    padding: 16px 24px;
  }

  .v-card-actions {
    padding: 8px 16px;
    background: rgba(38, 166, 154, 0.03);
    border-bottom-left-radius: 22px;
    border-bottom-right-radius: 22px;
  }
}

@media (max-width: 600px) {
  .blog-post {
    margin: 0 8px 24px;
    border-width: 2px;
  }

  .post-header {
    padding: 6px 12px 0;
  }

  .v-card-text {
    padding: 12px 16px;
  }

  .v-card-actions {
    padding: 6px 12px;
    background: rgba(38, 166, 154, 0.03);
  }
}

/* Dialog styles */
::v-deep .v-dialog {
  border-radius: 16px;
  overflow: hidden;
  margin: 24px;
}

::v-deep .v-dialog .v-card {
  background: rgb(18, 38, 38) !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
  border: none;
  position: relative;
}

::v-deep .v-dialog .v-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 2px;
  background: linear-gradient(45deg, #26a69a, #00695c);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

::v-deep .v-dialog .v-card-title {
  background: rgb(13, 71, 71) !important;
  padding: 20px 24px;
  font-size: 1.5rem !important;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(38, 166, 154, 0.2);
}

::v-deep .v-dialog .v-card-text {
  padding: 24px;
  background: rgb(18, 38, 38) !important;
}

::v-deep .v-dialog .v-text-field {
  margin-top: 8px;
}

::v-deep .v-dialog .v-text-field > .v-input__control > .v-input__slot {
  background: rgba(0, 0, 0, 0.2) !important;
  border: 1px solid rgba(38, 166, 154, 0.2);
  border-radius: 8px;
  transition: all 0.3s ease;
}

::v-deep .v-dialog .v-text-field > .v-input__control > .v-input__slot:hover,
::v-deep
  .v-dialog
  .v-text-field
  > .v-input__control
  > .v-input__slot:focus-within {
  border-color: rgba(38, 166, 154, 0.5);
}

::v-deep
  .v-dialog
  .v-text-field.v-text-field--outlined
  > .v-input__control
  > .v-input__slot {
  min-height: 48px;
}

::v-deep .v-dialog .v-card-actions {
  background: rgb(13, 71, 71) !important;
  padding: 16px 24px;
  border-top: 1px solid rgba(38, 166, 154, 0.2);
}

::v-deep .v-dialog .v-btn {
  min-width: 90px;
  letter-spacing: 0.5px;
  text-transform: none;
  font-weight: 500;
}

::v-deep .v-dialog .v-btn.v-btn--text {
  padding: 0 16px;
}

::v-deep .v-dialog .v-btn.v-btn--text.teal--text {
  color: #4db6ac !important;
}

::v-deep .v-dialog .v-btn.v-btn--text.teal--text:hover {
  color: #80cbc4 !important;
}

/* Container styles */
::v-deep .v-dialog .v-container {
  padding: 12px 0;
}
</style>
