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

    <div id="visits-list">
      <div v-for="visit in visits" :key="visit.id">
        <div class="visit" v-bind:id="'visit-' + visit.id">
          <v-row>
            <v-col cols="10" class="text-left pa-md-0">
              <p class="visit-url">{{ visit.url }}</p>
            </v-col>
            <v-col cols="2" class="pa-md-0">
              <p class="visit-timestamp">{{ visit.timestamp }}</p>
            </v-col>
          </v-row>
        </div>
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
      filterInput: '',
      marker: true,
      iconIndex: 0,
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
        this.getRecentVisits()
        return
      }

      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + `/netlog/search/${this.filterInput}`, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all blogs - received null response / data')
            return
          }
          vm.visits = response.data
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
      this.filterInput = ''
      this.getRecentVisits()
    },
    resetIcon () {
      this.iconIndex = 0
    },
    changeIcon () {
      this.iconIndex === this.icons.length - 1
        ? this.iconIndex = 0
        : this.iconIndex++
    },
    getRecentVisits () {
      const vm = this
      axios
        .get(process.env.VUE_APP_API_ENDPOINT + '/netlog/', {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          if (response === null || response.data === null) {
            console.error('all blogs - received null response / data')
            return
          }
          vm.visits = response.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  mounted: function () {
    this.getRecentVisits()
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
#visits-list {
  margin-top: 45px;
  margin-left: 30px;
}
#visits-main {
  margin-bottom: 95px;
}
</style>
