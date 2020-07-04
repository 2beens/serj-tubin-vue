<template>
  <div class="util-page">
    <div id="util-info-box">
      <h5>Your User Agent</h5>
      <h4 id="user-agent-value"></h4>
    </div>
    <div id="ip-info">
      <h5>Your IP Info</h5>
      <h4 id="util-info-box">TODO</h4>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Util',
  mounted: function () {
    console.log('util mounted')
    document.getElementById('user-agent-value').innerHTML = navigator.userAgent
  }
}
</script>

<style scoped>
#util-info-box {
    background-color: rgb(32, 185, 134);
    margin-left: 10%;
    margin-right: 10%;
    border-radius: 5px;
}
</style>
