<template>
  <div class="util-page">
    <div class="util-info-box">
      <h5>Your User Agent</h5>
      <h4 id="user-agent-value"></h4>
    </div>
    <div id="ip-info">
      <h5>Your IP Info</h5>
      <h4 class="util-info-box" id="ip-addr-value">👀</h4>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Util',
  mounted: function () {
    console.log('util mounted')
    document.getElementById('user-agent-value').innerHTML = navigator.userAgent

    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/myip')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('received null response / data messages')
          return
        }
        document.getElementById('ip-addr-value').innerHTML = response.data
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
.util-info-box {
    background-color: rgb(32, 185, 134);
    margin-left: 10%;
    margin-right: 10%;
    border-radius: 5px;
}
</style>
