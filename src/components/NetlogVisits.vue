<template>
  <div id="visits-main" data-app="true" v-if="theRoot.loggedIn">
    <div id="filter-row">
      <v-card
        id="filter-row-card"
        elevation="2"
        rounded-xl
        class="ma-xs-10"
      >
        <v-form
          class="pa-md-2"
          @submit.prevent
        >
          <v-container>
            <v-row>
              <v-col cols="12" class="pa-md-0">
                <v-text-field
                  v-model="filterInput"
                  :append-icon="marker ? 'mdi-map-marker' : 'mdi-map-marker-off'"
                  :append-outer-icon="filterInput ? 'mdi-send' : 'mdi-microphone'"
                  :prepend-icon="icon"
                  filled
                  clear-icon="mdi-close-circle"
                  clearable
                  label="Filter Input"
                  type="text"
                  @keyup.enter="filterVisits"
                  @click:append="toggleMarker"
                  @click:append-outer="filterVisits"
                  @click:prepend="changeIcon"
                  @click:clear="clearFilterInput"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card>
    </div>

    <v-row class="url-title-row">
      <v-col cols="10" class="text-left pa-md-0">
      </v-col>
      <v-col cols="2" class="pa-md-0">
        <v-chip
          class="ma-2"
          color="blue"
          text-color="white"
        >
          {{ this.totalVisits }}
          <v-icon right>
            mdi-star
          </v-icon>
        </v-chip>
      </v-col>
    </v-row>

    <div id="visits-list">
      <div v-for="visit in visits" :key="visit.id">
        <div v-bind:id="'visit-' + visit.id">
          <v-row class="url-title-row">
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
import axios from 'axios'

export default {
  name: 'NetlogVisits',
  data: function () {
    return {
      theRoot: this.$root,
      visits: [],
      totalVisits: 0,
      visitsPage: 1,
      maxVisitsPerPage: 250,
      visitsPageLength: 0,
      filterInput: '',
      marker: true,
      iconIndex: 0,
      searchMode: false,
      icons: [
        'mdi-emoticon',
        'mdi-emoticon-cool',
        'mdi-emoticon-dead',
        'mdi-emoticon-excited',
        'mdi-emoticon-happy',
        'mdi-emoticon-neutral',
        'mdi-emoticon-sad',
        'mdi-emoticon-tongue'
      ]
    }
  },
  computed: {
    icon () {
      return this.icons[this.iconIndex]
    }
  },
  methods: {
    filterVisits () {
      if (this.filterInput.length === 0) {
        this.getVisits()
        return
      }

      if (!this.searchMode) {
        console.warn('search on')
        this.visitsPage = 1
        this.searchMode = true
      }

      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + `/netlog/search/${this.filterInput}/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`, {
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
    toggleMarker () {
      // TODO:
      // list of material design emoticons/icons:
      // https://materialdesignicons.com/icon/emoticon
      this.marker = !this.marker
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
    changeIcon () {
      this.iconIndex === this.icons.length - 1
        ? this.iconIndex = 0
        : this.iconIndex++
    },
    getVisits () {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + `/netlog/page/${vm.visitsPage}/size/${vm.maxVisitsPerPage}`, {
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
#filter-row-card {
  background-color: #26A69A;
}
#visits-main {
  margin-top: 45px;
  margin-left: 12px;
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
