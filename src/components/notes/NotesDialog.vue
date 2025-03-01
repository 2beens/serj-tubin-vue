<template>
  <v-container>
    <v-card color="#26c6da">
      <v-card-title>
        <v-icon large left>
          {{ editMode ? 'mdi-note-edit' : 'mdi-note-plus' }}
        </v-icon>
        <span class="text-h5">{{ editMode ? 'Edit Note' : 'Add Note' }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="selectedNote.title"
              label="Title"
              required
              :rules="[(v) => !!v || 'Title is required']"
              placeholder="Enter note title"
              outlined
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              v-model="selectedNote.content"
              required
              label="Content"
              auto-grow
              outlined
              :rules="[(v) => !!v || 'Content is required']"
              placeholder="Enter note content"
              rows="5"
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="error" text @click="onCancel">Cancel</v-btn>
        <v-btn
          color="success"
          :disabled="confirmDisabled"
          @click="$emit('confirm-clicked', selectedNote)"
        >
          {{ editMode ? 'Save' : 'Add' }}
        </v-btn>
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

  methods: {
    onCancel() {
      this.$emit('cancel-clicked')
    },
  },

  computed: {
    confirmDisabled() {
      return !this.selectedNote.content || this.selectedNote.content === ''
    },
  },
}
</script>
