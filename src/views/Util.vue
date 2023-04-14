<template>
  <v-container class="mt-5">
    <div class="util-info-box">
      <h5 class="util-info-box-title">Your User Agent</h5>
      <h4 id="user-agent-value"></h4>
    </div>
    <div class="util-info-box">
      <h5 class="util-info-box-title">Your IP Info</h5>
      <h4 id="ip-addr-value">👀</h4>
    </div>
    <div class="util-info-box" v-if="theRoot.loggedIn">
      <h5 class="util-info-box-title">n8n</h5>
      <button id="n8n-link" style="margin-bottom: 10px" class="btn btn-success" @click="openN8NInNewTab">
        Open >> n8n.serj-tubin.com
      </button>
    </div>

    <file-box />
  </v-container>
</template>

<script>
import axios from 'axios'
import FileBox from '@/components/filebox/FileBox.vue'

export default {
  name: 'Util',
  data: function () {
    return {
      theRoot: this.$root
    }
  },
  components: {
    FileBox
  },
  mounted: function () {
    document.getElementById('user-agent-value').innerHTML = navigator.userAgent

    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/myip')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('received null response / data messages')
          return
        }
        document.getElementById('ip-addr-value').innerHTML = response.data
      })
      .catch((error) => {
        console.log(error)
      })
  },
  methods: {
    openN8NInNewTab() {
      window.open('https://n8n.serj-tubin.com', '_blank').focus()
    }
  }
}
</script>

<style scoped>
.util-info-box-title {
  color: black;
}
.util-info-box {
  background-color: #26a69a;
  margin-left: 10%;
  margin-right: 10%;
  border-radius: 5px;
}
</style>
