<template>
  <v-container>
    <h2>📝 Notes 📝</h2>

    <v-dialog
      v-model="showDialog"
      persistent
      max-width="800px"
      @keydown.esc="onAbortEditNote"
    >
      <template #activator="{ on, attrs }">
        <v-btn
          color="teal lighten-1"
          large
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <notes-dialog
        :edit-mode="editMode"
        :selected-note="selectedNote"
        :edited-note="editedNote"
        @confirm-clicked="onConfirmClicked($event)"
      />
    </v-dialog>

    <notes-list
      :notes="notes"
      @delete-note="deleteNote($event.id, $event.title)"
      @edit-note="onOpenEditNoteDialog($event)"
      @update-note-in-place="onUpdateNote($event)"
    />

    <div id="snackbar-div">
      <v-snackbar v-model="showSnackbar">
        {{ snackbarText }}

        <template #action="{ attrs }">
          <v-btn
            color="pink"
            text
            v-bind="attrs"
            @click="showSnackbar = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import NotesDialog from '../components/notes/NotesDialog.vue'
import NotesList from '../components/notes/NotesList.vue'
import axios from 'axios'

export default {
  name: 'NotesView',

  components: {
    NotesDialog,
    NotesList
  },

  data: function () {
    return {
      notes: [],
      selectedNote: {},
      editedNote: {},
      editMode: false,
      showDialog: false,
      snackbarText: '',
      showSnackbar: false
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
  },

  methods: {
    onConfirmClicked(note) {
      if (this.editMode) {
        this.onUpdateNote(note)
      } else {
        this.addNote()
      }
    },
    onAbortEditNote() {
      if (this.editMode) {
        this.selectedNote.title = this.editedNote.title
        this.selectedNote.content = this.editedNote.content
        this.selectedNote = {}
      }
      this.editMode = false
      this.editedNote = {}
      this.showDialog = false
    },
    onOpenEditNoteDialog: function (note) {
      this.editMode = true
      this.showDialog = true
      this.editedNote = Object.assign({}, note)
      this.selectedNote = note
    },
    onUpdateNote(note) {
      if (note.content === undefined || note.content === '') {
        console.error('emtpy content')
        return
      }

      const requestBody = {
        id: note.id,
        title: note.title,
        content: note.content
      }

      const vm = this
      axios
        .put(process.env.VUE_APP_API_ENDPOINT + '/notes', requestBody, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then(function (response) {
          if (response.data === null || !response.data.startsWith('updated:')) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          const noteId = response.data.split(':')[1]
          vm.snackbarText = `Note ${noteId} ${requestBody.title} updated!`
          vm.showSnackbar = true
          vm.selectedNote = {}
        })
        .catch(function (error) {
          vm.snackbarText = error
          vm.showSnackbar = true
          console.log(error)
        })
        .finally(() => {
          this.editMode = false
          this.showDialog = false
        })
    },
    deleteNote(id, title) {
      if (!confirm(`Are you sure you want to remove note [${id}] [${title}]?`)) {
        return
      }

      const vm = this
      axios
        .delete(process.env.VUE_APP_API_ENDPOINT + `/notes/${id}`, {
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

          let removedNoteIndex = -1
          let i
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
    addNote() {
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
        .post(process.env.VUE_APP_API_ENDPOINT + '/notes', requestBody, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
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
  }
}
</script>
