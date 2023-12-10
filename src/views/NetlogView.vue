<template>
  <v-container>
    <h2>🕸 Personal Netlog 🕸</h2>

    <hr>

    <h4 v-if="!theRoot.loggedIn">
      Can't show you this one, sorry 🤷‍♂️
    </h4>
    <div
      v-else
      class="ma-5"
    >
      <v-row>
        <v-col cols="1" />
        <v-col cols="10">
          <v-card
            class="ma-xs-10"
            color="#26A69A"
            elevation="2"
            rounded
            dark
          >
            <v-card-text>
              <v-form @submit.prevent>
                <v-text-field
                  v-model="filterInput"
                  label="Filter Input"
                  prepend-icon="mdi-cloud-search-outline"
                  clear-icon="mdi-close-circle"
                  filled
                  clearable
                  hint="Separate keywords with comma, without spaces. Use minus in front of the keyword to exclude it."
                  @keyup.enter="filterVisits"
                  @click:append-outer="filterVisits"
                  @click:clear="clearFilterInput"
                />
              </v-form>

              <v-row>
                <v-col class="justify align"
                  cols="12"
                >
                  <!-- SEARCH MODES HERE - SOURCE -->
                  <SourceFilterGroup @source-changed="onSourceFilterChanged" />

                  <!-- SEARCH MODES HERE - FIELD -->
                  <v-btn-toggle
                    v-model="searchField"
                    class="ml-3"
                    rounded
                  >
                    <v-btn><v-icon>mdi-alpha-u-circle</v-icon></v-btn>
                    <v-btn><v-icon>mdi-alpha-t-circle</v-icon></v-btn>
                  </v-btn-toggle>

                  <v-chip class="ml-5">
                    {{ totalVisits }}
                    <v-icon right>
                      mdi-star
                    </v-icon>
                  </v-chip>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="1" />
      </v-row>

      <v-row>
        <v-col>
          <div
            v-for="visit in visits"
            :key="visit.id"
          >
            <div :id="'visit-' + visit.id">
              <v-row class="url-title-row">
                <SourceIcon :source="visit.source" />
                <p class="url-title-p">
                  {{ visit.title }}
                </p>
              </v-row>
              <v-row class="url-endpoint-row">
                <v-col
                  cols="10"
                  class="text-left pa-md-0"
                >
                  <a
                    :href="visit.url"
                    target="_blank"
                  >{{ visit.url }}</a>
                </v-col>
                <v-col
                  cols="2"
                  class="pa-md-0"
                >
                  <p class="visit-timestamp">
                    {{ getTimestampString(new Date(visit.timestamp)) }}
                  </p>
                </v-col>
              </v-row>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- PAGNIATION HERE -->
      <v-row style="margin-bottom: 95px">
        <v-col>
          <div class="text-center">
            <v-pagination
              v-if="visits.length > 0"
              v-model="visitsPage"
              :length="visitsPageLength"
              :total-visible="10"
              @input="onVisitsPageChange"
            />
          </div>
        </v-col>
      </v-row>
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
    SourceIcon
  },
  data: function () {
    return {
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
      searchMode: false
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

      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/netlog/s/${source}/f/${field}/search/${this.filterInput}/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('filter visits - received null response / data')
            return
          }
          if (response.data.visits === null) {
            console.error('filter visits - received null visits', `response.data: ${stringify(response.data)}`)
            vm.visits = []
            vm.totalVisits = 0
            vm.visitsPageLength = 0
            return
          }
          vm.visits = response.data.visits
          vm.totalVisits = response.data.total
          vm.visitsPageLength = Math.ceil(response.data.total / vm.maxVisitsPerPage)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    clearFilterInput() {
      this.searchMode = false
      console.warn('search off')
      this.filterInput = ''
      this.getVisits()
    },
    getVisits() {
      const source = this.getSeachSourceType()
      const field = this.getSearchFieldType()

      const vm = this
      axios
        .get(
          process.env.VUE_APP_API_ENDPOINT +
            `/netlog/s/${source}/f/${field}/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('visits page - received null response / data')
            return
          }
          vm.visits = response.data.visits
          vm.totalVisits = response.data.total
          vm.visitsPageLength = Math.ceil(response.data.total / vm.maxVisitsPerPage)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    onVisitsPageChange() {
      if (this.searchMode) {
        this.filterVisits()
      } else {
        this.getVisits()
      }
    }
  }
}
</script>

<style scoped>
.url-title-row {
  margin: 0;
}
.url-title-p {
  margin: 0;
  color: #26a69a;
}
.url-endpoint-row {
  margin: 0;
  border-bottom: 2px solid #26a69a;
}
</style>
