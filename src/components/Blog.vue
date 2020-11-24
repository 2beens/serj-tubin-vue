<template>
  <div id="blog">
    <h3>{{ title }}</h3>
    <div id="blogs-list">
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Blog',
  mounted: function () {
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/blog/all')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('all blogs - received null response / data')
          return
        }
        const blogsList = document.getElementById('blogs-list')
        const blogs = response.data
        blogs.forEach((b) => {
          blogsList.insertAdjacentHTML('beforeend', `
            <div id="blog-${b.id}">
              <h4>${b.title}</h4>
              <p>${b.content}</p>
            </div>
          `)
        })
      })
      .catch((error) => {
        console.log(error)
      })
  },
  props: {
    title: String
  }
}
</script>
