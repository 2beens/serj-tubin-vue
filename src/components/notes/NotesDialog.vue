<template>
  <v-container>
    <v-card color="#26c6da">
      <v-card-title>
        <span v-if="editMode" class="text-h5">Edit Note</span>
        <span v-else class="text-h5">Add Note</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="selectedNote.title" label="Title" required />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="selectedNote.content"
              required
              name="input-7-1"
              filled
              label="Content"
              auto-grow
              value=""
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
          @click="$emit('confirm-clicked', selectedNote)"
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
    editMode: Boolean,
    selectedNote: Object,
    editedNote: Object,
  },

  computed: {
    confirmDisabled() {
      return !this.selectedNote.content || this.selectedNote.content === ''
    },
  },
}
</script>
