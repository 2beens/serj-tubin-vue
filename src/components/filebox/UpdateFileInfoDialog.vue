<template>
  <v-container>
    <v-card color="#26c6da">
      <v-card-title>
        <span class="headline">Edit File Info</span>
      </v-card-title>
      <v-card-text v-if="fileInfo">
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="File Name"
              required
              v-model="fileInfo.name"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-checkbox
              class="ma-0"
              v-model="fileInfo.is_private"
              hide-details
              label="Is Private?"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          elevation="2"
          fab
          icon
          large
          outlined
          color="green"
          @click="$emit('confirm-clicked', fileInfo)"
          :disabled="confirmDisabled"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'NotesDialog',

  computed: {
    confirmDisabled () {
      return !this.fileInfo || !this.fileInfo.name || this.fileInfo.name === ''
    }
  },

  mounted () {
    console.log('dialog file info', this.fileInfo)
  },

  props: {
    fileInfo: Object,
  }
}
</script>
