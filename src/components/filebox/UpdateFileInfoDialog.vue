<template>
  <v-container>
    <v-card color="#26c6da">
      <v-card-title>
        <span class="text-h5">Edit File Info</span>
      </v-card-title>
      <v-card-text v-if="fileInfo">
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="fileInfo.name" label="File Name" required />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-checkbox
              v-model="fileInfo.is_private"
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
          @click="$emit('confirm-clicked', fileInfo)"
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
  name: 'NotesDialog',

  props: {
    fileInfo: Object,
  },

  computed: {
    confirmDisabled() {
      return !this.fileInfo || !this.fileInfo.name || this.fileInfo.name === ''
    },
  },

  mounted() {
    console.log('dialog file info', this.fileInfo)
  },
}
</script>
