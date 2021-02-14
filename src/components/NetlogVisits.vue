<template>
  <v-container>
  <div v-if="theRoot.loggedIn" class="ma-5">
    <div class="mr-10 ml-10 mb-3">
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
              @keyup.enter="filterVisits"
              @click:append-outer="filterVisits"
              @click:clear="clearFilterInput"
              hint="Separate keywords with comma, without spaces. Use minus in front of the keyword to exclude it."
            ></v-text-field>
          </v-form>

          <v-row>
            <v-col cols="12" justify="end" align="end">
              <!-- <div class="float-lg-right"> -->
                <!-- SEARCH MODES HERE - SOURCE -->
                <SourceFilterGroup
                  v-on:source-changed="onSourceFilterChanged"
                />

                <!-- SEARCH MODES HERE - FIELD -->
                <v-btn-toggle
                  class="ml-3"
                  v-model="searchField"
                  rounded
                >
                  <v-btn><v-icon>mdi-alpha-u-circle</v-icon></v-btn>
                  <v-btn><v-icon>mdi-alpha-t-circle</v-icon></v-btn>
                </v-btn-toggle>

                <v-chip class="ml-5">
                  {{ this.totalVisits }}
                  <v-icon right>mdi-star</v-icon>
                </v-chip>
              <!-- </div> -->
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <div style="margin-bottom: 95px;">
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
  </v-container>
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
