<template>
  <div data-app="true" v-if="theRoot.loggedIn" class="ma-5">
    <div class="mr-10 ml-10 mb-3">
      <v-card
        color="#26A69A"
        elevation="2"
        rounded-xl
        class="ma-xs-10"
        dark
      >
        <v-card-text>
          <v-form
            class="pa-mb-2"
            @submit.prevent
          >
            <v-container>
              <v-text-field
                v-model="filterInput"
                prepend-icon="mdi-cloud-search-outline"
                filled
                clear-icon="mdi-close-circle"
                clearable
                label="Filter Input"
                type="text"
                @keyup.enter="filterVisits"
                @click:append-outer="filterVisits"
                @click:clear="clearFilterInput"
              ></v-text-field>
            </v-container>
          </v-form>

          <v-row>
            <v-spacer></v-spacer>

            <!-- SEARCH MODES HERE - SOURCE -->
            <SourceFilterGroup
              v-on:source-changed="onSourceFilterChanged"
            />

            <!-- SEARCH MODES HERE - FIELD -->
            <v-btn-toggle
              v-model="searchField"
              rounded
              color="primary"
              class="ml-2"
            >
              <v-btn>URL</v-btn>
              <v-btn>Title</v-btn>
            </v-btn-toggle>

            <v-chip
              class="ma-2 mr-15"
            >
              {{ this.totalVisits }}
              <v-icon right>mdi-star</v-icon>
            </v-chip>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <div id="visits-list">
      <div v-for="visit in visits" :key="visit.id">
        <div v-bind:id="'visit-' + visit.id">
          <v-row class="url-title-row">
            <SourceIcon :source="visit.source" />
            <p class="url-title-p">{{ visit.title }}</p>
          </v-row>
          <v-row class="url-endpoint-row">
            <v-col cols="10" class="text-left pa-md-0">
              <p>{{ visit.url }}</p>
            </v-col>
            <v-col cols="2" class="pa-md-0">
              <p class="visit-timestamp">{{ getTimestampString(new Date(visit.timestamp)) }}</p>
            </v-col>
          </v-row>
        </div>
      </div>

      <!-- PAGNIATION HERE -->
      <div class="text-center">
        <v-pagination
          @input="onVisitsPageChange"
          v-if="visits.length > 0"
          v-model="visitsPage"
          :length="visitsPageLength"
          :total-visible="10"
        ></v-pagination>
      </div>
    </div>
  </div>
  <h4 v-else>Can't show you this one, sorry 🤷‍♂️</h4>
</template>

<script>
import SourceFilterGroup from '@/components/netlog/SourceFilterGroup.vue'
import SourceIcon from '@/components/netlog/SourceIcon.vue'
import axios from 'axios'

export default {
  name: 'NetlogVisits',
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
      searchSource: 3,
      iconIndex: 0,
      searchMode: false
    }
  },
  methods: {
    onSourceFilterChanged (source) {
      this.searchSource = source
      this.filterVisits()
    },
    getSeachSourceType () {
      if (this.searchSource === 0) {
        return 'chrome'
      } else if (this.searchSource === 1) {
        return 'safari'
      } else if (this.searchSource === 2) {
        return 'pc'
      }
      return 'all'
    },
    getSearchFieldType () {
      if (this.searchField === 0) {
        return 'url'
      }
      return 'title'
    },
    filterVisits () {
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
        .get(process.env.VUE_APP_API_ENDPOINT + `/netlog/s/${source}/f/${field}/search/${this.filterInput}/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('filter visits - received null response / data')
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
    clearFilterInput () {
      this.searchMode = false
      console.warn('search off')
      this.filterInput = ''
      this.getVisits()
    },
    resetIcon () {
      this.iconIndex = 0
    },
    getVisits () {
      const source = this.getSeachSourceType()
      const field = this.getSearchFieldType()

      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + `/netlog/s/${source}/f/${field}/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
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
    onVisitsPageChange (page) {
      if (this.searchMode) {
        this.filterVisits()
      } else {
        this.getVisits()
      }
    }
  },
  mounted: function () {
    this.getVisits()
  }
}
</script>

<style scoped>
#filter-row {
  margin-left: 100px;
  margin-right: 100px;
  margin-bottom: 15px;
  padding-bottom: 0px;
}
#visits-list {
  margin-bottom: 95px;
}
.url-title-row {
  margin: 0px;
}
.url-title-p{
  margin: 0px;
  color: #26A69A;
}
.url-endpoint-row{
  margin: 0px;
  border-bottom: 2px solid #26A69A;
}
</style>
