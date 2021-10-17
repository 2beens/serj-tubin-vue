<template>
  <v-container>
    <div v-for="(n, index) in notes" v-bind:key="index">
      <v-card
        class="mb-2"
        color="#26c6da"
      >
        <v-card-title>
          <v-icon large left>mdi-note</v-icon>
          <span class="text-h6 font-weight-light">{{n.title}}</span>
        </v-card-title>

        <v-card-text class="text-h5 font-weight-bold">
          {{n.content}}
        </v-card-text>

        <v-card-actions>
          <v-list-item class="grow">
            <v-row
              align="center"
              justify="end"
            >
              <v-icon class="mr-1">
                mdi-wrench
              </v-icon>
              <v-icon class="mr-1" color="red" @click="onDeleteNote(n.id, n.title)">
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
    notes: Array
  },

  methods: {
    onDeleteNote: function (id, title) {
      console.log(`will delete: ${id}`)
      this.$emit('delete-note', { id: id, title: title })
    }
  }
}
</script>
