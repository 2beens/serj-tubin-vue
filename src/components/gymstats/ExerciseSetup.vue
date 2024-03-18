<template>
  <v-row>
    <v-col v-if="exerciseTypeLoaded">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field outlined v-model="exerciseType.id" label="ID" required></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-text-field outlined v-model="exerciseType.name" label="Name" required></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <v-select
            outlined
            v-model="exerciseType.muscleGroup"
            :items="muscleGroups"
            item-text="text"
            item-value="id"
            label="Muscle Group"
            return-object
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6">
          <v-textarea outlined v-model="exerciseType.description" label="Description"></v-textarea>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <!-- now iterate over the exerciseType.images, where each image is an object that contains "id" -->
      <!-- which can be used to form a URL of an image: /gymstats/image/<id> -->
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col v-for="image in exerciseType.images" :key="image.id" cols="12" sm="6">
              <v-img :src="`${process.env.VUE_APP_API_ENDPOINT}/gymstats/image/${image.id}`" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-snackbar v-model="showSnackbar">
        {{ snackbarText }}
        <template #action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script scoped>
import axios from 'axios'
import GymStatsData from '@/gymstats'

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
      muscleGroups: GymStatsData.muscleGroups,
      exerciseTypeLoaded: false,
      exerciseType: null,
      showSnackbar: false,
      snackbarText: ''
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
          vm.exerciseType = response.data[0]
          vm.exerciseTypeLoaded = true
        })
        .catch((error) => {
          console.error('error loading exercise type', error)
          vm.showSnackbar = true
          vm.snackbarText = `${error}: ${error.response.data}`
        })
    }
  }
}
</script>
