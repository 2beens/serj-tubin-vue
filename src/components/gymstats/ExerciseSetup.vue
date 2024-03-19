<template>
  <v-row>
    <v-col v-if="exerciseTypeLoaded">
      <v-row>
        <v-col cols="4">
          <v-text-field outlined v-model="exerciseType.id" label="ID" required></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field outlined v-model="exerciseType.name" label="Name" required></v-text-field>
        </v-col>

        <v-col cols="4">
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
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-textarea outlined v-model="exerciseType.description" label="Description"></v-textarea>
        </v-col>

        <!-- update button -->
        <v-col cols="6">
          <v-btn color="primary" @click="updateExerciseType">Update</v-btn>
        </v-col>
      </v-row>

      <v-row class="ma-0">
        <v-col class="ma-0 pa-0" cols="6">
          <h5>Images</h5>
        </v-col>
        <!-- add images button bellow: -->
        <v-col class="ma-0 pa-0 d-flex justify-end" cols="6">
          <v-btn color="primary" @click="showAddImageDialog = true">Add Image</v-btn>
        </v-col>
      </v-row>
      <v-row class="ma-0">
        <v-col class="ma-0 pa-0" cols="12">
          <v-divider></v-divider>
        </v-col>
      </v-row>

      <!-- now iterate over the exerciseType.images, where each image is an object that contains "id" -->
      <!-- which can be used to form a URL of an image: /gymstats/image/<id> -->
      <v-row>
        <v-col cols="12">
          <v-row>
            <v-col v-for="image in exerciseType.images" :key="image.id" cols="12" sm="6">
              <v-img :src="getImageUrl(image.id)" contain></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <v-dialog v-model="showAddImageDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Image</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-file-input v-model="image" label="Image" accept="image/*"></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="showAddImageDialog = false">Close</v-btn>
            <v-btn color="success" @click="uploadImage">Upload</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

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
      showAddImageDialog: false,
      image: null,
      showSnackbar: false,
      snackbarText: ''
    }
  },

  watch: {
    muscleGroup() {
      this.refresh()
    },
    exerciseId() {
      this.refresh()
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
    },

    getImageUrl(imageId) {
      return `${process.env.VUE_APP_API_ENDPOINT}/gymstats/image/${imageId}`
    },

    uploadImage() {
      const formData = new FormData()
      formData.append('image', this.image)

      const vm = this
      axios
        .post(
          `${process.env.VUE_APP_API_ENDPOINT}/gymstats/types/${this.exerciseType.id}/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
            }
          }
        )
        .then((response) => {
          console.log('image uploaded', response)
          vm.showAddImageDialog = false
          vm.refresh()
        })
        .catch((error) => {
          console.error('error uploading image', error)
          vm.showSnackbar = true
          vm.snackbarText = `${error}: ${error.response.data}`
        })
    },

    updateExerciseType() {
      const vm = this
      axios
        .put(`${process.env.VUE_APP_API_ENDPOINT}/gymstats/types`, this.exerciseType, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic')
          }
        })
        .then((response) => {
          console.log('exercise type updated', response)
          vm.showSnackbar = true
          vm.snackbarText = 'Exercise type updated'
        })
        .catch((error) => {
          console.error('error updating exercise type', error)
          vm.showSnackbar = true
          vm.snackbarText = `${error}: ${error.response.data}`
        })
    }
  }
}
</script>
