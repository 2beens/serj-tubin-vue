<template>
  <v-container>
    <h2>📝 Notes 📝</h2>
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="600px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="teal lighten-1"
          dark
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
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
            @click="onAbortEditNote"
          >
            🚫
          </v-btn>
          <v-btn
            v-if="editMode"
            @click="onUpdateNote"
          >
            📝
          </v-btn>
          <v-btn
            v-else
            @click="onAddNote"
          >
            📩
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <notes-list
      :notes="this.notes"
      v-on:delete-note="deleteNote($event.id, $event.title)"
    />
  </v-container>
</template>

<script>
import NotesList from '../components/NotesList.vue'
import axios from 'axios'
const qs = require('querystring')

export default {
  name: 'Notes',

  components: {
    NotesList
  },

  data: function () {
    return {
      notes: [],
      selectedNote: {},
      editedNote: {},
      editMode: false,
      showDialog: false
    }
  },

  methods: {
    onAbortEditNote () {
      this.selectedNote.title = this.editedNote.title
      this.selectedNote.content = this.editedNote.content
      this.editedNote = {}
      this.showDialog = false
    },
    onOpenEditNoteDialog: function (note) {
      this.editMode = true
      this.showDialog = true
      this.editedNote = Object.assign({}, note)
      this.selectedNote = note
    },
    updateNote () {

    },
    deleteNote (id, title) {
      if (!confirm(`Are you sure you want to remove note [${id}] [${title}]?`)) {
        return
      }

      const vm = this
      axios
        .delete(
          process.env.VUE_APP_API_ENDPOINT + `/notes/${id}`, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('delete blog - received null response / data')
            return
          }
          if (!response.data.startsWith('deleted:')) {
            console.error('delete blog - invalid response received: ' + response.data)
            return
          }

          var removedNoteIndex = -1
          var i
          for (i = 0; i < vm.notes.length; i++) {
            if (vm.notes[i].id === id) {
              removedNoteIndex = i
              break
            }
          }

          if (removedNoteIndex >= 0) {
            vm.notes.splice(removedNoteIndex, 1)
            vm.snackbarText = `Note ${title} removed!`
          } else {
            console.error('failed to find deleted note')
            vm.snackbarText = `Note ${title} not removed :(`
          }

          vm.showSnackbar = true
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onAddNote () {
      this.editMode = false

      if (this.selectedNote.content === undefined || this.selectedNote.content === '') {
        console.error('emtpy content')
        return
      }

      const requestBody = {
        title: this.selectedNote.title,
        content: this.selectedNote.content
      }

      const vm = this
      axios
        .post(
          process.env.VUE_APP_API_ENDPOINT + '/notes',
          qs.stringify(requestBody), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('added:')) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          const noteId = response.data.split(':')[1]
          vm.notes.unshift({
            id: noteId,
            title: requestBody.title,
            content: requestBody.content,
            created_at: vm.date2string(Date.now())
          })

          vm.snackbarText = `Note ${requestBody.title} added!`
          vm.showSnackbar = true
          vm.selectedNote = {}
        })
        .catch(function (error) {
          vm.snackbarText = error
          vm.showSnackbar = true
          console.log(error)
        })
        .finally(() => {
          vm.showDialog = false
        })
    }
  },

  mounted: function () {
    const vm = this
    axios
      .get(process.env.VUE_APP_API_ENDPOINT + '/notes', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
        }
      })
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('all notes - received null response / data')
          return
        }
        vm.notes = response.data.notes
        console.log(`received ${vm.notes.length} notes`)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
