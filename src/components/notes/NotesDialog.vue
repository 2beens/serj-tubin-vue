<template>
  <v-container>
    <v-card color="#26c6da">
      <v-card-title>
        <span v-if="editMode" class="headline">Edit Note</span>
        <span v-else class="headline">Add Note</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              label="Title"
              required
              v-model="selectedNote.title"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              required
              name="input-7-1"
              filled
              label="Content"
              auto-grow
              value=""
              v-model="selectedNote.content"
            ></v-textarea>
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
          @click="$emit('confirm-clicked', selectedNote)"
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
      return !this.selectedNote.content || this.selectedNote.content === ''
    }
  },

  props: {
    editMode: Boolean,
    selectedNote: Object,
    editedNote: Object
  }
}
</script>
