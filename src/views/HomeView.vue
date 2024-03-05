<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <h2>Work in constant progress 👨🏼‍💻🛠</h2>
            <img id="my-image" alt="serj-tubin" src="../assets/ja-2022-dec.jpg" />
            <h3 style="margin: 40px 0 0">A personal tech sandbox</h3>
            <h5>* not fully adapted to small screens yet 🤷‍♂️</h5>
          </v-col>
        </v-row>

        <SideBar />

        <v-row id="quote-info">
          <h6>Random quotes here:</h6>
        </v-row>
        <v-row>
          <v-col id="quote-section">
            <h3 id="quote-text">
              {{ quote.text }}
            </h3>
            <h5 id="quote-author">
              {{ quote.author }}
            </h5>
          </v-col>
        </v-row>

        <BlogsList title="Recent Posts" />
      </v-col>
    </v-row>
  </v-container>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<script scoped>
// @ is an alias to /src
import SideBar from '@/components/SideBar.vue'
import BlogsList from '@/components/BlogsList.vue'
import axios from 'axios'

export default {
  name: 'HomeView',
  components: {
    SideBar,
    BlogsList
  },
  data: function () {
    return {
      quote: {}
    }
  },
  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/quote/random')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('received null response / data')
          return
        }
        vm.quote = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
#my-image {
  border-radius: 50%;
  max-width: 20%;
  height: auto;
}

#my-image:hover {
  box-shadow: 0 0 8px 2px rgba(0, 140, 186, 0.5);
}

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
  border: 2px solid #26a69a;
  border-radius: 5px;
}

#quote-text {
  margin-top: 5px;
  color: rgb(51, 118, 118);
}

#quote-author {
  color: #26a69a;
}
</style>
