<template>
  <v-icon
    v-if="source === 'chrome'"
    dense
    color="light-green darken-2"
  >
    mdi-google-chrome
  </v-icon>
  <v-icon
    v-else-if="source === 'safari'"
    dense
    color="light-blue darken-2"
  >
    mdi-apple-safari
  </v-icon>
  <v-icon
    v-else-if="source === 'rabota'"
    dense
    color="light-blue darken-3"
  >
    mdi-wrench
  </v-icon>
  <v-icon
    v-else-if="source === 'pc'"
    dense
    color="yellow darken-2"
  >
    mdi-desktop-tower-monitor
  </v-icon>
  <v-icon
    v-else-if="source === 'firefox'"
    dense
    color="orange darken-2"
  >
    mdi-firefox
  </v-icon>
  <v-icon
    v-else
    dense
    color="light-green darken-2"
  >
    mdi-help-circle
  </v-icon>
</template>

<script>
export default {
  name: 'SourceIcon',

  props: {
    source: String
  }

  mounted () {
    switch (this.source) {
      case 'chrome':
      case 'safari':
      case 'rabota':
      case 'pc':
      case 'firefox':
        break;
      default:
        console.warn(`--> unknown netlog source: [${this.source}]`);
    }
  },
}
</script>
