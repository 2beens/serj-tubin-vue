<template>
  <div id="util-page">
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
#util-page {
  margin-top: 20px;
}

.util-info-box {
    background-color: #26A69A;
    margin-left: 10%;
    margin-right: 10%;
    border-radius: 5px;
}
</style>
