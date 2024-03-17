<template>
  <v-row>
    <v-col>
      <h2>{{ muscleGroup }}: {{ exerciseId }}</h2>
    </v-col>
  </v-row>
</template>

<script scoped>
import axios from 'axios'

export default {
  name: 'ExerciseSetup',
  props: {
    muscleGroup: {
      type: String,
      required: true
    },
    exerciseId: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      exerciseType: null
    }
  },

  mounted() {
    this.refresh()
  },

  methods: {
    refresh() {
      const vm = this
      axios
        .get(`${process.env.VUE_APP_API_ENDPOINT}/gymstats/types`, {
          params: {
            muscleGroup: this.muscleGroup,
            id: this.exerciseId
          },
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          console.log('get exercise resp', response.data)
          vm.exerciseType = response.data
        })
    }
  }
}
</script>
