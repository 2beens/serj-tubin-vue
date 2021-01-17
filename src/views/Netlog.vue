<template>
  <div class="netlog-main">
    <h2>🕸 Personal Netlog 🕸</h2>
    <hr/>
    <NetlogVisits />
  </div>
</template>

<script>
import NetlogVisits from '@/components/NetlogVisits.vue'

export default {
  name: 'Netlog',
  components: {
    NetlogVisits
  }
}
</script>
