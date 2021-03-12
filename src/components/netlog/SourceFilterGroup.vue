<template>
  <v-btn-toggle
    v-model="searchSource"
    rounded
    @change="sourceChanged"
  >
    <v-btn>
      <v-icon>mdi-google-chrome</v-icon>
    </v-btn>
    <v-btn>
      <v-icon>mdi-apple-safari</v-icon>
    </v-btn>
    <v-btn>
      <v-icon>mdi-desktop-tower-monitor</v-icon>
    </v-btn>
    <v-btn>
      <v-icon>mdi-all-inclusive</v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'SearchFilterGroup',
  data: function () {
    return {
      searchSource: 3
    }
  },
  methods: {
    sourceChanged () {
      this.$emit('source-changed', this.searchSource)
    }
  }
}
</script>
