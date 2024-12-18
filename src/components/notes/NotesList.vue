<template>
  <v-container class="mb-10">
    <div v-for="(n, index) in notes" :key="index">
      <v-card class="mb-2" color="#26c6da">
        <v-card-title>
          <v-icon large left>mdi-note</v-icon>
          <span class="text-h6 font-weight-light">
            {{ n.id }}: {{ n.title }}
          </span>
        </v-card-title>

        <v-card-text class="mb-0 pb-0">
          <v-textarea v-model="n.content" name="input-7-1" filled auto-grow />
        </v-card-text>

        <v-card-actions class="mt-0 pt-0">
          <v-list-item class="grow">
            <v-row align="center" justify="end">
              <v-icon
                class="mr-1"
                color="#fadf73"
                @click="onUpdateNoteInPlace(n)"
              >
                mdi-wrench
              </v-icon>
              <v-icon class="mr-1" color="#2e73d1" @click="onEditNote(n)">
                mdi-toolbox
              </v-icon>
              <v-icon class="mr-1" color="red" @click="onDeleteNote(n)">
                mdi-delete
              </v-icon>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'NotesList',

  props: {
    notes: Array,
  },

  methods: {
    onUpdateNoteInPlace: function (note) {
      console.warn(note.content)
      this.$emit('update-note-in-place', note)
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
