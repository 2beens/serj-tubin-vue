<template>
  <v-container class="mb-10">
    <h2>Files Box</h2>

    <v-card
      class="mx-auto"
      max-width="500"
    >
      <v-sheet class="pa-4 primary lighten-2">
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
        <v-checkbox
          v-model="caseSensitive"
          dark
          hide-details
          label="Case sensitive search"
        ></v-checkbox>
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
            <span style="float: left; font-weight: bold">{{ item.name }}</span>
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
        return
      }
      console.log('item', items[0].name)
    },
    openNode(nodes) {
      if (nodes.length === 0) {
        return
      }
      console.log('opened', nodes[0].name)
    },
  },
  data: () => ({
    open: [],
    search: null,
    caseSensitive: false,
    files: {
      html: 'mdi-language-html5',
      js: 'mdi-nodejs',
      json: 'mdi-code-json',
      md: 'mdi-language-markdown',
      pdf: 'mdi-file-pdf',
      png: 'mdi-file-image',
      txt: 'mdi-file-document-outline',
      xls: 'mdi-file-excel',
    },
    tree: [],
    items: [
      {
        name: 'public',
        children: [
          {
            name: 'static',
            children: [
              {
                name: 'logo.png',
                file: 'png',
              },
              {
                name: 'babel.config.js',
                file: 'js',
              },
              {
                name: 'package.json',
                file: 'json',
              },
            ],
          },
          {
            name: 'favicon.ico',
            file: 'png',
          },
          {
            name: 'index.html',
            file: 'html',
          },
        ],
      },
      {
        name: '.gitignore',
        file: 'txt',
      },
    ],
  }),
  computed: {
    filter () {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined
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
