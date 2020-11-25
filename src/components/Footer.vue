<template>
  <footer id="s-footer" class="fixed-bottom">
    <div class="row">
      <div class="col-sm-1">Srđan Tubin</div>
      <div class="col-sm-1">
        <a href="https://github.com/2beens" class="fa fa-github"></a>
      </div>
      <div class="col-sm-2">
        <a href="https://www.facebook.com/srdjantubin" class="fa fa-facebook"></a>
      </div>
      <div class="col-sm-1" id="version-info">[]</div>
    </div>
  </footer>
</template>

<script>
import axios from 'axios'

export default {
  name: 'Footer',
  mounted: function () {
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/version')
      .then(response => {
        if (response === null || response.data === null) {
          console.error('get version info: received null response / data')
          return
        }
        document.getElementById('version-info').innerHTML = '[' + response.data.trim() + ']'
      })
      .catch(error => {
        console.log(error)
      })
  }
}
</script>

<style scoped>
#s-footer {
  background-color: cadetblue;
  padding-top: 5px;
  padding-bottom: 5px;
}
</style>
