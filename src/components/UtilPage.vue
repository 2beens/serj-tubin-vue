<template>
  <div class="util-page">
    <h1>This is a util page.</h1>
    <h4>Will contain various things like weather, user agent analyzer, etc.</h4>

    <div id="user-agent-info">
      <h5>Your User Agent</h5>
      <h4 id="user-agent-value"></h4>
    </div>

    <div>
      <p>TODO: add a board, where everyone can leave soem message</p>
      <p>Use some persistent storage for that (redis, postgres, or maybe something else...)</p>
      <p>Explain it: some nice hackers can screw up my site, and maybe I learn something from that</p>
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
#user-agent-info {
    background-color: rgb(32, 185, 134);
    margin-left: 10%;
    margin-right: 10%;
    border-radius: 5px;
}
</style>
