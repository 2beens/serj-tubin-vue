<template>
  <v-container>
    <v-row align="center" justify="center" class="mb-4">
      <v-col cols="12" class="text-center">
        <h1 class="text-h4 font-weight-light">
          <v-icon large color="blue">mdi-web</v-icon>
          Personal Netlog
          <v-icon large color="blue">mdi-web</v-icon>
        </h1>
      </v-col>
    </v-row>

    <h4 v-if="!theRoot.loggedIn" class="text-center error--text">
      <v-icon color="error">mdi-lock</v-icon>
      Authentication required to view this content
    </h4>

    <div v-else>
      <v-card class="mb-6" color="blue" dark elevation="3" rounded>
        <v-card-text>
          <v-form @submit.prevent>
            <v-text-field
              v-model="filterInput"
              label="Search visits"
              prepend-icon="mdi-magnify"
              clear-icon="mdi-close-circle"
              filled
              clearable
              hint="Separate keywords with comma (no spaces). Use minus (-) to exclude terms"
              persistent-hint
              @keyup.enter="filterVisits"
              @click:append-outer="filterVisits"
              @click:clear="clearFilterInput"
            />
          </v-form>

          <v-row align="center" class="mt-2">
            <v-col cols="12" sm="auto">
              <SourceFilterGroup @source-changed="onSourceFilterChanged" />
            </v-col>

            <v-col cols="auto">
              <v-btn-toggle v-model="searchField" rounded dense>
                <v-btn small>
                  <v-icon>mdi-link</v-icon>
                  <span class="ml-1">URL</span>
                </v-btn>
                <v-btn small>
                  <v-icon>mdi-text</v-icon>
                  <span class="ml-1">Title</span>
                </v-btn>
              </v-btn-toggle>
            </v-col>

            <v-col cols="auto">
              <v-chip color="blue lighten-4" class="ml-2">
                <v-icon left small>mdi-counter</v-icon>
                {{ totalVisits }} visits
              </v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="mb-6" elevation="2" color="blue lighten-5">
        <v-card-text class="pa-0">
          <v-overlay :value="loading" absolute>
            <v-progress-circular
              indeterminate
              color="blue"
              size="64"
              class="mt-12"
            ></v-progress-circular>
          </v-overlay>
          <div
            v-for="visit in visits"
            :key="visit.id"
            class="visit-item py-2 px-3"
          >
            <v-row no-gutters align="center">
              <v-col cols="auto" class="mr-2">
                <SourceIcon :source="visit.source" />
              </v-col>
              <v-col>
                <div class="title-text">{{ visit.title }}</div>
                <div class="url-text">
                  <a
                    :href="visit.url"
                    target="_blank"
                    class="text-decoration-none"
                  >
                    {{ visit.url }}
                  </a>
                </div>
              </v-col>
              <v-col cols="auto" class="ml-2">
                <v-chip
                  x-small
                  color="blue"
                  text-color="white"
                  class="timestamp-chip"
                >
                  {{ getTimestampString(new Date(visit.timestamp)) }}
                </v-chip>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>

      <v-row justify="center" class="mb-12">
        <v-col cols="12" class="text-center">
          <v-pagination
            v-if="visits.length > 0"
            v-model="visitsPage"
            :length="visitsPageLength"
            :total-visible="10"
            @input="onVisitsPageChange"
          />
        </v-col>
      </v-row>

      <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
        {{ snackText }}
        <template #action="{ attrs }">
          <v-btn v-bind="attrs" color="red" variant="text" @click="snack = false">
            Close
          </v-btn>
          <v-btn
            v-bind="attrs"
            color="primary"
            text
            @click="
              copyLinkToClipboard(lastAddedId)
              snack = false
            "
          >
            Copy
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import SourceFilterGroup from '@/components/netlog/SourceFilterGroup.vue'
import SourceIcon from '@/components/netlog/SourceIcon.vue'
import axios from 'axios'

export default {
  name: 'NetlogView',
  components: {
    SourceFilterGroup,
    SourceIcon,
  },
  data: function () {
    return {
      loading: false,
      theRoot: this.$root,
      visits: [],
      totalVisits: 0,
      visitsPage: 1,
      maxVisitsPerPage: 250,
      visitsPageLength: 0,
      filterInput: '',
      searchField: 0,
      searchSource: 5,
      iconIndex: 0,
      searchMode: false,
      snack: false,
      snackColor: '',
      snackText: '',
      lastAddedId: null,
    }
  },
  mounted: function () {
    this.getVisits()
  },
  methods: {
    onSourceFilterChanged(source) {
      this.searchSource = source
      this.filterVisits()
    },
    getSeachSourceType() {
      if (this.searchSource === 0) {
        return 'chrome'
      } else if (this.searchSource === 1) {
        return 'safari'
      } else if (this.searchSource === 2) {
        return 'pc'
      } else if (this.searchSource === 3) {
        return 'firefox'
      } else if (this.searchSource === 4) {
        return 'rabota'
      }

      return 'all'
    },
    getSearchFieldType() {
      if (this.searchField === 0) {
        return 'url'
      }
      return 'title'
    },
    filterVisits() {
      if (!this.filterInput || this.filterInput.length === 0) {
        this.getVisits()
        return
      }

      if (!this.searchMode) {
        console.warn('search on')
        this.visitsPage = 1
        this.searchMode = true
      }

      const source = this.getSeachSourceType()
      const field = this.getSearchFieldType()

      this.loading = true
      const vm = this
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT +
            `/netlog/s/${source}/f/${field}/search/${this.filterInput}/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('filter visits - received null response / data')
            return
          }
          if (response.data.visits === null) {
            console.error(
              'filter visits - received null visits',
              `response.data: ${JSON.stringify(response.data)}`
            )
            vm.visits = []
            vm.totalVisits = 0
            vm.visitsPageLength = 0
            return
          }
          vm.visits = response.data.visits
          vm.totalVisits = response.data.total
          vm.visitsPageLength = Math.ceil(
            response.data.total / vm.maxVisitsPerPage
          )
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {
          vm.loading = false
        })
    },
    clearFilterInput() {
      this.searchMode = false
      console.warn('search off')
      this.filterInput = ''
      this.getVisits()
    },
    getVisits() {
      this.loading = true
      const source = this.getSeachSourceType()
      const field = this.getSearchFieldType()

      const vm = this
      axios
        .get(
          import.meta.env.VITE_API_ENDPOINT +
            `/netlog/s/${source}/f/${field}/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          if (!response?.data?.visits) {
            console.error('visits page - received null response / data')
            vm.visits = []
            vm.totalVisits = 0
            vm.visitsPageLength = 0
            return
          }
          vm.visits = response.data.visits
          vm.totalVisits = response.data.total
          vm.visitsPageLength = Math.ceil(
            response.data.total / vm.maxVisitsPerPage
          )
        })
        .catch((error) => {
          console.error('Error fetching visits:', error)
          vm.visits = []
          vm.totalVisits = 0
          vm.visitsPageLength = 0
        })
        .finally(() => {
          vm.loading = false
        })
    },
    onVisitsPageChange() {
      if (this.searchMode) {
        this.filterVisits()
      } else {
        this.getVisits()
      }
    },
    async copyLinkToClipboard(id) {
      try {
        const linkUrl = `${window.location.origin}/l/${id}`
        await navigator.clipboard.writeText(linkUrl)
        this.snackText = `Copied to clipboard: ${linkUrl}`
        this.snackColor = 'success'
      } catch (err) {
        console.error('Failed to copy:', err)
        this.snackText = 'Failed to copy link'
        this.snackColor = 'error'
      }
      this.snack = true
    },
  },
}
</script>

<style scoped>
.visit-item {
  border-bottom: 1px solid rgba(0, 150, 136, 0.2);
  transition: all 0.2s ease;
}

.visit-item:hover {
  background-color: rgba(0, 122, 204, 0.1);
}

.title-text {
  color: #00796b;
  font-weight: 500;
  font-size: 0.95em;
  line-height: 1.2;
  margin-bottom: 2px;
}

.url-text {
  color: #607d8b;
  font-size: 0.85em;
  word-break: break-all;
  line-height: 1.2;
}

.url-text a {
  color: inherit;
  transition: color 0.2s ease;
}

.url-text a:hover {
  color: #00796b;
}

.timestamp-chip {
  font-size: 0.75em;
}

.v-skeleton-loader {
  background-color: transparent !important;
}

.v-skeleton-loader >>> .v-skeleton-loader__list-item-avatar {
  background: rgba(0, 122, 204, 0.1);
}

.v-skeleton-loader >>> .v-skeleton-loader__list-item-three-line {
  background: rgba(0, 122, 204, 0.1);
}
</style>
