<template>
  <div class="home-page">
    <h3 style="margin: 40px 0 0;">{{ title }}</h3>

    <h6 id="quote-info">I'm being a smartass by showing some cool stolen quotes here:</h6>
    <div id="quote-section">
      <h3 id="quote-text"></h3>
      <h5 id="quote-author"></h5>
    </div>

    <Blog title="Recent Posts"/>
  </div>
</template>

<script>
import Blog from '@/components/Blog.vue'
import axios from 'axios'

export default {
  name: 'HomePage',
  props: {
    title: String
  },
  components: {
    Blog
  },
  created: function () {
    console.log('home page created')
  },
  mounted: function () {
    document.getElementById('quote-info').style.display = 'none'

    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/quote/random')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('received null response / data')
          return
        }
        const quote = response.data
        document.getElementById('quote-text').innerHTML = quote.text
        document.getElementById('quote-author').innerHTML = quote.author
        document.getElementById('quote-info').style.display = 'block'
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#quote-info {
  margin-top: 75px;
  margin-left: 45px;
  margin-bottom: 2px;
  text-align: left;
}
#quote-section {
  margin-left: 40px;
  margin-right: 40px;
  margin-bottom: 35px;
  padding: 20px;
  border: 2px solid #26A69A;
  border-radius: 5px;
}
#quote-text {
  margin-top: 5px;
  color: rgb(48, 83, 83);
}
#quote-author {
  color: #26A69A;
}

ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #26A69A;
}
</style>
