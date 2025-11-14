<template>
  <v-container class="mb-10">
    <v-row>
      <v-col cols="12">
        <v-card
          v-for="note in notes"
          :key="note.id"
          class="mb-4"
          color="#26c6da"
          elevation="2"
          hover
        >
          <v-card-title class="d-flex align-center">
            <v-icon large left>mdi-note</v-icon>
            <span class="text-h6 font-weight-light">{{ note.title }}</span>
            <v-spacer></v-spacer>
            <span class="text-caption">#{{ note.id }}</span>
          </v-card-title>

          <v-card-text class="mb-0 pb-0">
            <v-textarea
              v-model="note.content"
              auto-grow
              outlined
              dense
              hide-details
              rows="3"
              @change="onContentChanged(note)"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  @click="onUpdateNoteInPlace(note)"
                >
                  <v-icon color="#fadf73">mdi-content-save</v-icon>
                </v-btn>
              </template>
              <span>Quick Save</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn icon v-bind="props" @click="onEditNote(note)">
                  <v-icon color="#2e73d1">mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>Edit</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template #activator="{ props }">
                <v-btn
                  icon
                  v-bind="props"
                  @click="onDeleteNote(note)"
                >
                  <v-icon color="red">mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>Delete</span>
            </v-tooltip>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotesList',
  props: {
    notes: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      contentChanged: {},
    }
  },
  methods: {
    onContentChanged(note) {
      this.contentChanged[note.id] = true
    },
    onUpdateNoteInPlace(note) {
      if (!this.contentChanged[note.id]) return
      this.$emit('update-note-in-place', note)
      this.contentChanged[note.id] = false
    },
    onEditNote: function (note) {
      this.$emit('edit-note', note)
    },
    onDeleteNote: function (note) {
      console.log(`will delete: ${note.id}`)
      this.$emit('delete-note', { id: note.id, title: note.title })
    },
  },
}
</script>
