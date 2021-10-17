<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span v-if="editMode" class="headline">Edit Note</span>
        <span v-else class="headline">Add Note</span>
      </v-card-title>
      <v-card-text>
        <v-container>
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
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="$emit('abort-edit')"
        >
          🚫
        </v-btn>
        <v-btn
          v-if="editMode"
          @click="$emit('update-note')"
        >
          📝
        </v-btn>
        <v-btn
          v-else
          @click="$emit('add-note')"
        >
          📩
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
    editedNote: Object
  },

  mounted: function () {
    console.warn(this.note)
  },

  methods: {
    // TODO
  }
}
</script>
