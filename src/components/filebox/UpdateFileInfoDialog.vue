<template>
  <v-container>
    <v-card color="teal lighten-1">
      <v-card-title>
        <span class="text-h5">Edit File Info</span>
      </v-card-title>
      <v-card-text v-if="localFileInfo">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="localFileInfo.name"
              label="File Name"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-checkbox
              v-model="localFileInfo.is_private"
              class="ma-0"
              hide-details
              label="Is Private?"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          elevation="2"
          fab
          icon
          large
          outlined
          color="green"
          :disabled="confirmDisabled"
          @click="onConfirmClick"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'UpdateFileInfoDialog',

  props: {
    fileInfo: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      localFileInfo: null,
    }
  },

  computed: {
    confirmDisabled() {
      return (
        !this.localFileInfo ||
        !this.localFileInfo.name ||
        this.localFileInfo.name === ''
      )
    },
  },

  watch: {
    fileInfo: {
      immediate: true,
      handler(newVal) {
        // Create a deep copy of the prop to avoid mutation
        this.localFileInfo = newVal ? JSON.parse(JSON.stringify(newVal)) : null
      },
    },
  },

  methods: {
    onConfirmClick() {
      this.$emit('confirm-clicked', this.localFileInfo)
    },
  },
}
</script>
