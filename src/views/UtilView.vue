<template>
  <v-container
    class="mt-5"
    :class="$vuetify.theme.dark ? 'theme--dark' : 'theme--light'"
  >
    <div class="util-info-box">
      <h5 class="util-info-box-title">Your User Agent</h5>
      <h4 id="user-agent-value" class="util-info-value" />
    </div>
    <div class="util-info-box">
      <h5 class="util-info-box-title">Your IP Info</h5>
      <h4 id="ip-addr-value" class="util-info-value">👀</h4>
    </div>
    <div v-if="theRoot.loggedIn" class="util-info-box">
      <h5 class="util-info-box-title">n8n</h5>
      <v-btn
        id="n8n-link"
        color="success"
        class="mb-3"
        @click="openN8NInNewTab"
      >
        Open >> n8n.serj-tubin.com
      </v-btn>
    </div>

    <file-box />
  </v-container>
</template>

<script>
import axios from 'axios'
import FileBox from '@/components/filebox/FileBox.vue'

export default {
  name: 'UtilView',
  components: {
    FileBox,
  },
  data: function () {
    return {
      theRoot: this.$root,
    }
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
      window.open('https://n8n.serj-tubin.com', 'n8n serj', 'noopener').focus()
    },
  },
}
</script>

<style scoped>
.util-info-box {
  margin: 20px 10%;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Dark theme styles */
.theme--dark .util-info-box {
  background-color: #26a69a;
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.theme--dark .util-info-box-title {
  color: #000000;
  font-weight: 600;
  margin-bottom: 12px;
}

.theme--dark .util-info-value {
  color: #ffffff;
  word-break: break-all;
  line-height: 1.4;
}

/* Light theme styles */
.theme--light .util-info-box {
  background-color: #e0f2f1;
  border-color: rgba(38, 166, 154, 0.3);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.theme--light .util-info-box-title {
  color: #00695c;
  font-weight: 600;
  margin-bottom: 12px;
}

.theme--light .util-info-value {
  color: #004d40;
  word-break: break-all;
  line-height: 1.4;
}

/* Hover effects */
.util-info-box:hover {
  transform: translateY(-2px);
}

.theme--dark .util-info-box:hover {
  background-color: #2bbbad;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
}

.theme--light .util-info-box:hover {
  background-color: #b2dfdb;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

/* Button styling */
#n8n-link {
  margin-top: 8px;
}
</style>
