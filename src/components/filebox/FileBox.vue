<template>
  <v-container
    v-if="$root.loggedIn"
    id="files-box-container"
    class="mb-10"
    :class="$vuetify.theme.dark ? 'theme--dark' : 'theme--light'"
  >
    <h2>Files Box</h2>

    <v-card class="mx-auto" max-width="700" :dark="$vuetify.theme.dark">
      <v-sheet
        class="pa-4"
        :class="$vuetify.theme.dark ? 'blue darken-3' : 'blue lighten-4'"
      >
        <v-row class="ma-2 mt-0">
          <v-col cols="12" class="pa-0 ma-0">
            <v-file-input
              v-model="inputFiles"
              multiple
              show-size
              label="File upload (select the dest folder first)"
            />
          </v-col>
          <v-progress-linear
            v-show="uploadingFile"
            color="blue"
            :value="uploadPercentage"
          />
        </v-row>

        <v-row class="ma-2">
          <v-col cols="1">
            <v-btn
              class="ma-0"
              small
              :disabled="noItemsSelected"
              @click="deselectAll"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
          <v-col v-if="noItemsSelected" cols="1">
            <br />
          </v-col>
          <v-col v-else-if="oneItemSelected" cols="10" class="ma-0">
            <span
              v-if="oneFileSelected"
              :style="
                $vuetify.theme.dark
                  ? 'color: white; float: left; font-weight: bold'
                  : 'color: #003d82; float: left; font-weight: bold'
              "
            >
              {{ selectedItems[0].name }}
            </span>
            <span
              v-else
              :style="
                $vuetify.theme.dark
                  ? 'color: white; float: left; font-weight: bold'
                  : 'color: #003d82; float: left; font-weight: bold'
              "
            >
              <v-icon style="float: left; color: blue">mdi-folder</v-icon>
              {{ selectedItems[0].name }} [{{
                selectedItems[0].children
                  ? selectedItems[0].children.length
                  : 0
              }}]
            </span>
          </v-col>
          <v-col
            v-else
            cols="3"
            class="ma-0"
            style="color: white; float: left; font-weight: bold"
          >
            {{ selectedItems.length }} selected items
          </v-col>
        </v-row>

        <v-row class="ma-2">
          <v-col cols="4" class="pa-0 ma-0">
            <v-checkbox
              v-model="caseSensitive"
              class="ma-0"
              dark
              hide-details
              label="Case sensitive"
            />
          </v-col>
          <v-col class="pa-0 ma-0" cols="2" />
          <v-col class="pa-0 ma-0" cols="6">
            <v-btn
              fab
              small
              :disabled="!oneFolderSelected && !noItemsSelected"
              @click="onNewFolderClick"
            >
              <v-icon>mdi-folder</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              fab
              small
              color="#5665d0"
              :disabled="!filesForUploadSelected"
              @click="onUploadClick"
            >
              <v-icon>mdi-cloud-upload</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              fab
              small
              color="#d51e00"
              :disabled="noItemsSelected"
              @click="onDownloadClick"
            >
              <v-icon>mdi-cloud-download</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              fab
              small
              :disabled="noItemsSelected"
              @click="onDeleteClick"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              color="primary"
              fab
              small
              :disabled="!oneFileSelected"
              @click="onGetLinkClick"
            >
              <v-icon>mdi-link</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              color="success"
              fab
              small
              :disabled="!oneFileSelected"
              @click="onViewFile"
            >
              <v-icon>mdi-file-find</v-icon>
            </v-btn>
            <v-dialog
              v-model="showDialog"
              persistent
              max-width="800px"
              @keydown.esc="showDialog = false"
            >
              <template #activator="{ on, attrs }">
                <v-btn
                  color="yellow"
                  large
                  icon
                  v-bind="attrs"
                  :disabled="!oneFileSelected"
                  v-on="on"
                >
                  <v-icon dark>mdi-wrench</v-icon>
                </v-btn>
              </template>
              <update-file-info-dialog
                :file-info="selectedItems[0]"
                @confirm-clicked="onUpdateFileConfirmClicked($event)"
              />
            </v-dialog>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="search"
              label="Search ..."
              dark
              flat
              solo-inverted
              hide-details
              clearable
              clear-icon="mdi-close-circle-outline"
            />
          </v-col>
        </v-row>
      </v-sheet>
      <v-card-text>
        <v-treeview
          v-model:active="selectedItems"
          :items="items"
          activatable
          multiple-active
          hoverable
          item-key="id"
          return-object
          :search="search"
          :filter="filter"
        >
          <template #label="{ item, open }">
            <v-icon
              v-if="item.is_file && item.is_private"
              style="float: left; color: #930007"
            >
              mdi-lock
            </v-icon>
            <v-icon v-if="!item.file" style="float: left; color: #3147c0">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon v-else style="float: left; color: #3150f9">
              {{ fileTypes[item.file] }}
            </v-icon>
            <v-hover v-slot="{ hover }">
              <div :id="`file-${item.id}`" style="cursor: pointer">
                <span
                  v-if="item.is_file"
                  style="float: left; font-weight: bold"
                >
                  {{ item.name }}
                </span>
                <span v-else style="float: left; font-weight: bold">
                  {{ item.name }} [{{
                    item.children ? item.children.length : 0
                  }}]
                </span>
                <v-icon v-if="hover">mdi-file</v-icon>
              </div>
            </v-hover>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>

    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn
          :color="snackbarColor"
          text
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import UpdateFileInfoDialog from './UpdateFileInfoDialog.vue'
import axios from 'axios'

const fileTypes = {
  'application/pdf': 'mdi-file-pdf',
  'image/png': 'mdi-file-image',
  'image/jpg': 'mdi-file-image',
  'image/jpeg': 'mdi-file-image',
  html: 'mdi-language-html5',
  js: 'mdi-nodejs',
  json: 'mdi-code-json',
  md: 'mdi-language-markdown',
  txt: 'mdi-file-document-outline',
  xls: 'mdi-file-excel',
}

export default {
  name: 'FileBox',

  components: {
    UpdateFileInfoDialog,
  },

  data: () => ({
    open: [],
    items: [],
    selectedItems: [],
    search: null,
    caseSensitive: false,
    uploadPercentage: 0,
    uploadingFile: false,
    inputFiles: null,
    fileTypes: fileTypes,
    showDialog: false,
    snackbarText: '',
    showSnackbar: false,
    snackbarColor: 'green',
  }),

  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    },
    someItemsSelected() {
      return this.selectedItems && this.selectedItems.length > 0
    },
    noItemsSelected() {
      return !this.selectedItems || this.selectedItems.length === 0
    },
    oneItemSelected() {
      return this.selectedItems && this.selectedItems.length === 1
    },
    oneFolderSelected() {
      return (
        this.selectedItems &&
        this.selectedItems.length === 1 &&
        !this.selectedItems[0].is_file
      )
    },
    oneFileSelected() {
      return (
        this.selectedItems &&
        this.selectedItems.length === 1 &&
        this.selectedItems[0].is_file
      )
    },
    filesForUploadSelected() {
      return this.inputFiles !== null
    },
  },

  mounted() {
    this.refreshFilesTreeAndDeselectItems()

    // deselect all files/folders on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectedItems = []
      }
    })
  },

  methods: {
    deselectAll() {
      this.selectedItems = []
    },
    onGetLinkClick() {
      const item = this.selectedItems[0]
      const id = item.id
      const isFile = item.is_file
      if (!isFile) {
        console.error(id, 'not a file')
        return
      }
      const fileUrl = process.env.VUE_APP_FILE_BOX_ENDPOINT + `/link/${id}`
      navigator.clipboard.writeText(fileUrl)
      this.show(`File link [${fileUrl}] copied!`)
    },
    onViewFile() {
      const item = this.selectedItems[0]
      const id = item.id
      const isFile = item.is_file
      if (!isFile) {
        console.error(id, 'not a file')
        return
      }
      const fileUrl = process.env.VUE_APP_FILE_BOX_ENDPOINT + `/link/${id}`
      // TODO: in order to open private links, i need to store cookie in local storage,
      // and later get it from there, in a page for the selected file
      window.open(fileUrl, 'file', 'noopener')
    },
    onUpdateFileConfirmClicked(fileInfo) {
      this.showDialog = false

      const requestBody = {
        name: fileInfo.name,
        is_private: fileInfo.is_private,
      }

      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + `/f/update/${fileInfo.id}`,
          requestBody,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('update file info - received null response / data')
            return
          }
          this.show('Updated!')
          this.refreshFilesTree(false)
        })
        .catch((error) => {
          if (error && error.response && error.response.data) {
            console.error(error.response.data)
          } else {
            console.error(error)
          }
          this.showErr(`Update failed, check the console!`)
        })
    },
    onDownloadClick() {
      if (this.selectedItems.length === 0) {
        return
      }

      const item = this.selectedItems[0]

      let path
      let downloadName
      if (item.is_file) {
        path = `/f/download/file/${item.id}`
        downloadName = `${item.name}`
      } else {
        path = `/f/download/folder/${item.id}`
        downloadName = `${item.name}.tar.gz`
      }

      axios
        .get(process.env.VUE_APP_FILE_BOX_ENDPOINT + path, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
          responseType: 'blob',
        })
        .then((response) => {
          const downloadUrl = window.URL.createObjectURL(
            new Blob([response.data])
          )
          const link = document.createElement('a')
          link.href = downloadUrl
          link.setAttribute('download', downloadName)
          document.body.appendChild(link)
          link.click()
          link.remove()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    onNewFolderClick() {
      if (this.selectedItems.length > 0 && this.selectedItems[0].is_file) {
        return
      }

      let folderName = prompt('New folder name', '')
      if (folderName === null) {
        console.error('folder name empty')
        return
      }

      let folderId = 0
      if (this.selectedItems.length > 0) {
        folderId = this.selectedItems[0].id
      }
      const requestBody = {
        name: folderName,
      }

      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + `/f/${folderId}/new`,
          requestBody,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('create new folder - received null response / data')
            return
          }
          this.show(`Folder ${folderName} created!`)
          this.refreshFilesTree(false)
        })
        .catch((error) => {
          if (error && error.response && error.response.data) {
            console.error(error.response.data)
          } else {
            console.error(error)
          }
          this.showErr(`Create new folder failed, check the console!`)
        })
    },
    onUploadClick() {
      let folderId, folderName
      if (this.selectedItems.length === 0) {
        folderId = 0
        folderName = 'root'
      } else {
        folderId = this.selectedItems[0].id
        folderName = this.selectedItems[0].name
      }
      console.log(
        `uploading ${this.inputFiles.length} files to folder ${folderId} ${folderName}`
      )

      let formData = new FormData()
      for (let i = 0; i < this.inputFiles.length; i++) {
        formData.append('files', this.inputFiles[i], this.inputFiles[i].name)
      }

      this.uploadingFile = true
      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + `/f/upload/${folderId}`,
          formData,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
            onUploadProgress: function (progressEvent) {
              const percentage = Math.round(
                (progressEvent.loaded / progressEvent.total) * 100
              )
              this.uploadPercentage = parseInt(percentage)
            }.bind(this),
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('save files - received null response / data')
            return
          }
          this.show(`Files uploaded!`)
          this.uploadingFile = false

          try {
            const filesIds = response.data.split(':')[1]
            console.log('files added', filesIds)
          } catch (e) {
            /*nop*/
          }

          this.refreshFilesTree(false)
        })
        .catch((error) => {
          console.log(error)
          this.showErr(`Upload failed, check the console!`)
          this.uploadingFile = false
        })
    },
    onDeleteClick() {
      if (this.selectedItems.length === 0) {
        return
      }

      if (
        !confirm(
          `Are you sure you want to remove ${this.selectedItems.length} items?`
        )
      ) {
        return
      }

      const selectedIds = []
      for (let i = 0; i < this.selectedItems.length; i++) {
        selectedIds.push(this.selectedItems[i].id)
      }

      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + '/f/del',
          { ids: selectedIds.join(',') },
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('save file - received null response / data')
            return
          }
          console.log('delete items response', response.data)

          if (!response.data.startsWith('deleted:')) {
            this.showErr('Invalid response received')
            this.refreshFilesTreeAndDeselectItems()
            return
          }

          const deletedCount = response.data.split(':')[1]
          this.show(`${deletedCount}/${selectedIds.length} items deleted!`)

          this.refreshFilesTreeAndDeselectItems()
        })
        .catch((error) => {
          if (error && error.response && error.response.data) {
            console.error(error.response.data)
          } else {
            console.error(error)
          }
          this.showErr(`Delete failed, check the console!`)
        })
    },
    refreshFilesTreeAndDeselectItems() {
      this.refreshFilesTree(true)
    },
    refreshFilesTree(deselectItems) {
      const vm = this
      axios
        .get(process.env.VUE_APP_FILE_BOX_ENDPOINT + '/f/root', {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('get root - received null response / data')
            return
          }
          // get root folder content - children
          vm.items = response.data.children
          vm.inputFiles = null
          if (deselectItems) {
            vm.selectedItems = []
          }
        })
        .catch((error) => {
          console.log(error)
        })
    },
    show(message) {
      this.snackbarText = message
      this.snackbarColor = 'green'
      this.showSnackbar = true
    },
    showErr(message) {
      this.snackbarText = message
      this.snackbarColor = 'red'
      this.showSnackbar = true
    },
  },
}
</script>
