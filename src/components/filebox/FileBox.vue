<template>
  <v-container class="mb-10" v-if="this.$root.loggedIn">
    <h2>Files Box</h2>

    <v-card
      class="mx-auto"
      max-width="700"
    >
      <v-sheet class="pa-4 teal darken-3">
        <v-row class="ma-2 mt-0">
          <v-col cols="12" class="pa-0 ma-0">
            <v-file-input
              v-model="inputFile"
              show-size
              label="File upload (select the dest folder first)"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row class="ma-2">
          <v-col cols="4" class="pa-0 ma-0">
            <v-checkbox
              class="ma-0"
              v-model="caseSensitive"
              dark
              hide-details
              label="Case sensitive"
            ></v-checkbox>
          </v-col>
          <v-col class="pa-0 ma-0" cols="3" />
          <v-col class="pa-0 ma-0" cols="5">
            <v-btn
              fab
              small
              :disabled="itemSelected && this.selectedItem.is_file"
              @click="onNewFolderClick"
            >
              <v-icon>mdi-folder</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              fab
              small
              :disabled="!fileSelected"
              @click="onUploadClick"
            >
              <v-icon>mdi-cloud-upload</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              fab
              small
              :disabled="!itemSelected"
              @click="onDeleteClick"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              color="primary"
              fab
              small
              :disabled="!itemSelected || !this.selectedItem.is_file"
              @click="onGetLinkClick"
            >
              <v-icon>mdi-link</v-icon>
            </v-btn>
            <v-dialog
              @keydown.esc="showDialog = false"
              v-model="showDialog"
              persistent
              max-width="800px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  color="yellow"
                  large
                  icon
                  v-bind="attrs"
                  v-on="on"
                  :disabled="!itemSelected || !selectedItem.is_file"
                >
                  <v-icon dark>
                    mdi-wrench
                  </v-icon>
                </v-btn>
              </template>
              <update-file-info-dialog
                :fileInfo="selectedItem"
                v-on:confirm-clicked="onUpdateFileConfirmClicked($event)"
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
            ></v-text-field>
          </v-col>
        </v-row>
      </v-sheet>
      <v-card-text>
        <v-treeview
          v-model="tree"
          :open.sync="open"
          :items="items"
          activatable
          active-class="primary--text"
          item-key="id"
          return-object
          @update:active="clickOnNode($event)"
          @update:open="openNode"
          :search="search"
          :filter="filter"
        >
          <template v-slot:label="{ item, open }">
            <v-icon style="float: left; color: #930007;" v-if="item.is_file && item.is_private">mdi-lock</v-icon>
            <v-icon style="float: left; color: #3147c0;"  v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon style="float: left; color: #3150f9;"  v-else>
              {{ fileTypes[item.file] }}
            </v-icon>
            <v-hover v-slot:default="{ hover }">
              <div style="cursor: pointer;">
                <span v-if="item.is_file" style="float: left; font-weight: bold">{{ item.name }}</span>
                <span v-else style="float: left; font-weight: bold">{{ item.name }} [{{ item.children ? item.children.length : 0 }}]</span>
                <v-icon v-if="hover">mdi-file</v-icon>
              </div>
            </v-hover>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import UpdateFileInfoDialog from './UpdateFileInfoDialog.vue'
import axios from 'axios'
const qs = require('querystring')

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
  mounted () {
    this.refreshFilesTree()
  },

  components: {
    UpdateFileInfoDialog,
  },

  data: () => ({
    open: [],
    selectedItem: null,
    tree: [],
    items: [],
    search: null,
    caseSensitive: false,
    inputFile: null,
    fileTypes: fileTypes,
    showDialog: false,
  }),

  computed: {
    filter () {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
    },
    itemSelected () {
      return this.selectedItem !== null
    },
    fileSelected () {
      return this.inputFile !== null
    },
  },

  methods: {
    clickOnNode(items) {
      if (items.length === 0) {
        this.selectedItem = null
        return
      }
      this.selectedItem = items[0]
    },
    openNode(nodes) {
      if (nodes.length === 0) {
        this.selectedItem = null
        return
      }
      this.selectedItem = nodes[0]
    },
    onGetLinkClick() {
      const id = this.selectedItem.id
      const isFile = this.selectedItem.is_file
      if (!isFile) {
        console.error(id, 'not a file')
        return
      }
      const folderId = this.selectedItem.parent_id
      const fileUrl = process.env.VUE_APP_FILE_BOX_ENDPOINT + `/link/${folderId}/c/${id}`
      navigator.clipboard.writeText(fileUrl)
    },
    onUpdateFileConfirmClicked (fileInfo) {
      this.showDialog = false

      const requestBody = {
        name: fileInfo.name,
        is_private: fileInfo.is_private
      }

      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + `/f/${fileInfo.parent_id}/c/${fileInfo.id}`,
          qs.stringify(requestBody), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('update file info - received null response / data')
            return
          }
          this.refreshFilesTree()
        })
        .catch((error) => {
          if (error && error.response && error.response.data) {
            console.error(error.response.data)
          } else {
            console.error(error)
          }
        })
    },
    onNewFolderClick() {
      if (this.selectedItem && this.selectedItem.is_file) {
        return;
      }

      var folderName = prompt('New folder name', '')
      if (folderName === null) {
        console.error('folder name empty')
        return
      }

      let folderId = 0
      if (this.selectedItem) {
        folderId = this.selectedItem.id
      }
      const requestBody = {
        name: folderName,
      }

      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + `/f/${folderId}/new`,
          qs.stringify(requestBody), {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('create new folder - received null response / data')
            return
          }
          this.refreshFilesTree()
        })
        .catch((error) => {
          if (error && error.response && error.response.data) {
            console.error(error.response.data)
          } else {
            console.error(error)
          }
        })
    },
    onUploadClick() {
      let folderId, folderName
      if (!this.selectedItem) {
        folderId = 0
        folderName = 'root'
      } else {
        folderId = this.selectedItem.id
        folderName = this.inputFile.name
      }
      console.log(`uploading ${this.inputFile.name} to folder ${folderId} ${folderName}`)

      let formData = new FormData()
      formData.append("file", this.inputFile, this.inputFile.name)

      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + `/f/${folderId}`,
          formData, {
            headers: {
              'Access-Control-Allow-Origin': '*',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('save file - received null response / data')
            return
          }
          this.refreshFilesTree()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onDeleteClick() {
      const id = this.selectedItem.id
      const isFile = this.selectedItem.is_file
      if (!confirm(`Are you sure you want to remove ${isFile ? 'file' : 'folder'} [${id}]?`)) {
        return
      }

      let path
      if (isFile) {
        path = `/f/${this.selectedItem.parent_id}/c/${id}`
      } else {
        path = `/f/${id}`
      }

      axios
        .delete(process.env.VUE_APP_FILE_BOX_ENDPOINT + path, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('save file - received null response / data')
            return
          }
          console.log('response:')
          console.log(response.data)
          this.refreshFilesTree()
        })
        .catch((error) => {
          if (error && error.response && error.response.data) {
            console.error(error.response.data)
          } else {
            console.error(error)
          }
        })
    },
    refreshFilesTree() {
      const vm = this
      axios
        .get(process.env.VUE_APP_FILE_BOX_ENDPOINT + '/f/root', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('get root - received null response / data')
            return
          }
          // get root folder content - children
          vm.items = response.data.children
          vm.inputFile = null
          vm.selectedItem = null
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>