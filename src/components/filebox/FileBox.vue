<template>
  <v-container class="mb-10">
    <h2>Files Box</h2>

    <v-card
      class="mx-auto"
      max-width="700"
    >
      <v-sheet class="pa-4 primary lighten-2">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="search"
              label="Search Company Directory"
              dark
              flat
              solo-inverted
              hide-details
              clearable
              clear-icon="mdi-close-circle-outline"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row class="mt-2 mb-1">
          <v-col cols="12" class="pa-0 ma-0">
            <v-file-input
              v-model="inputFile"
              show-size
              label="File upload (select the dest folder first)"
            ></v-file-input>
          </v-col>
        </v-row>
        <v-row class="mt-2 mb-1">
          <v-col cols="4" class="pa-0 ma-0">
            <v-checkbox
              class="pa-0 ma-0"
              v-model="caseSensitive"
              dark
              hide-details
              label="Case sensitive"
            ></v-checkbox>
          </v-col>
          <v-col class="pa-0 ma-0" cols="4" />
          <v-col class="pa-0 ma-0" cols="4">
            <v-btn
              fab
              small
              :disabled="!itemSelected"
              @click="onNewFolderClick"
            >
              <v-icon>mdi-folder</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              fab
              small
              :disabled="!itemSelected || !fileSelected"
              @click="onUploadClick"
            >
              <v-icon>mdi-cloud-upload</v-icon>
            </v-btn>
            <v-btn
              class="ml-2"
              fab
              small
              :disabled="!itemSelected"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-sheet>
      <v-card-text>
        <v-treeview
          v-model="tree"
          :open.sync="open"
          :items="items"
          activatable
          item-key="name"
          open-on-click
          return-object
          @update:active="clickOnNode($event)"
          @update:open="openNode"
          :search="search"
          :filter="filter"
        >
          <template v-slot:label="{ item, open }">
            <v-icon style="float: left"  v-if="!item.file">
              {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
            </v-icon>
            <v-icon style="float: left"  v-else>
              {{ files[item.file] }}
            </v-icon>
            <span style="float: left; font-weight: bold">{{ item.name }} [{{ item.file }}]</span>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from 'axios'

export default {
  name: 'FileBox',
  methods: {
    clickOnNode(items) {
      if (items.length === 0) {
        this.selectedItem = null
        return
      }
      this.selectedItem = items[0]
      console.log('item', items[0].name)
    },
    openNode(nodes) {
      if (nodes.length === 0) {
        this.selectedItem = null
        return
      }
      this.selectedItem = nodes[0]
      console.log('opened', nodes[0].name)
    },
    onNewFolderClick() {
      console.log('new folder')
    },
    onUploadClick() {
      const folderId = this.selectedItem.id
      console.log(`uploading ${this.inputFile.name} to folder ${folderId} ${this.selectedItem.name}`)

      let formData = new FormData()
      formData.append("file", this.inputFile, this.inputFile.name)

      axios
        .post(
          process.env.VUE_APP_FILE_BOX_ENDPOINT + `/folder/${folderId}`,
          formData
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('save file - received null response / data')
            return
          }
          console.log('response:')
          console.log(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    },
  },
  data: () => ({
    open: [],
    search: null,
    caseSensitive: false,
    inputFile: null,
    selectedItem: null,
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      'application/pdf': 'mdi-file-pdf',
      'image/png': 'mdi-file-image',
      'image/jpg': 'mdi-file-image',
      'image/jpeg': 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
    },
    tree: [],
    items: [],
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
  mounted () {
    const vm = this
    axios
      .get(process.env.VUE_APP_FILE_BOX_ENDPOINT + '/folder/root')
      .then((response) => {
        if (response === null || response.data === null) {
          console.error('get root - received null response / data')
          return
        }
        vm.items = [response.data]
        console.log(`items:`)
        console.log(vm.items)
      })
      .catch((error) => {
        console.log(error)
      })
  },
}
</script>
