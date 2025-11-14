<template>
  <v-row>
    <v-col v-if="exerciseTypeLoaded">
      <v-row>
        <v-col cols="4">
          <v-text-field
            outlined
            v-model="exerciseType.exerciseId"
            label="ID"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-text-field
            outlined
            v-model="exerciseType.name"
            label="Name"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="4">
          <v-select
            outlined
            v-model="exerciseType.muscleGroup"
            :items="muscleGroups"
            item-text="name"
            item-value="id"
            label="Muscle Group"
            return-object
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-textarea
            outlined
            v-model="exerciseType.description"
            label="Description"
          ></v-textarea>
        </v-col>
        <v-col cols="6">
          <v-row>
            <v-col>
              <v-btn color="primary" @click="updateExerciseType">Update</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-btn color="error" @click="deleteExerciseType">Delete</v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="4"></v-col>
      </v-row>

      <v-row class="ma-0">
        <v-col class="ma-0 pa-0" cols="6">
          <h5>Images</h5>
        </v-col>
        <!-- add images button bellow: -->
        <v-col class="ma-0 pa-0 d-flex justify-end" cols="6">
          <v-btn color="primary" @click="showAddImageDialog = true">
            Add Image
          </v-btn>
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
            <v-col
              v-for="image in exerciseType.images"
              :key="image.id"
              cols="12"
              sm="6"
              style="position: relative"
            >
              <v-img
                :src="getImageUrl(image.id)"
                max-width="350px"
                contain
                style="border-radius: 5px"
              ></v-img>
              <v-icon
                class="delete-icon"
                style="position: absolute; top: 5%; left: 5%"
                color="red"
                @click="deleteImage(image.id)"
              >
                mdi-delete
              </v-icon>
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
                  <v-file-input
                    v-model="image"
                    label="Image"
                    accept="image/*"
                  ></v-file-input>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="showAddImageDialog = false">
              Close
            </v-btn>
            <v-btn color="success" @click="uploadImage">Upload</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-col>
    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}
      <template #action="{ attrs }">
        <v-btn
          color="pink"
          variant="text"
          v-bind="attrs"
          @click="showSnackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
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
      required: true,
    },
    exerciseId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      muscleGroups: GymStatsData.muscleGroups,
      exerciseTypeLoaded: false,
      exerciseType: null,
      showAddImageDialog: false,
      image: null, // for image upload dialog
      showSnackbar: false,
      snackbarText: '',
    }
  },

  watch: {
    muscleGroup() {
      this.refresh()
    },
    exerciseId() {
      this.refresh()
    },
  },

  mounted() {
    this.refresh()
  },

  methods: {
    refresh() {
      const vm = this
      axios
        .get(`${import.meta.env.VITE_API_ENDPOINT}/gymstats/types`, {
          params: {
            muscleGroup: this.muscleGroup,
            exerciseId: this.exerciseId,
          },
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (!response.data || response.data.length === 0) {
            console.error(
              `no exercise type found for ${this.muscleGroup}/${this.exerciseId}`
            )
            vm.showSnackbar = true
            vm.snackbarText = `Unexpected response, no exercise type found for ${this.muscleGroup}/${this.exerciseId}`
            return
          }
          vm.exerciseType = response.data[0]
          vm.exerciseTypeLoaded = true
        })
        .catch((error) => {
          console.error(
            `error loading exercise type ${this.muscleGroup}/${this.exerciseId}`,
            error
          )
          vm.showSnackbar = true
          vm.snackbarText = `${error}: ${error.response.data}`
        })
    },

    getImageUrl(imageId) {
      return `${import.meta.env.VITE_API_ENDPOINT}/gymstats/image/${imageId}`
    },

    uploadImage() {
      const formData = new FormData()
      formData.append('image', this.image)

      const vm = this
      axios
        .post(
          `${import.meta.env.VITE_API_ENDPOINT}/gymstats/types/${
            this.exerciseType.exerciseId
          }/mg/${this.muscleGroup}/image`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          console.log('image uploaded', response)
          vm.showAddImageDialog = false
          vm.refresh()
          vm.image = null
        })
        .catch((error) => {
          console.error('error uploading image', error)
          vm.showSnackbar = true
          vm.snackbarText = `${error}: ${error.response.data}`
        })
    },

    deleteImage(imageId) {
      // show a simple confirmation dialog
      if (!confirm(`Are you sure you want to delete image ${imageId}?`)) {
        return
      }
      const vm = this
      axios
        .delete(
          `${import.meta.env.VITE_API_ENDPOINT}/gymstats/image/${imageId}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          console.log('image deleted', response)
          vm.refresh()
        })
        .catch((error) => {
          console.error('error deleting image', error)
          vm.showSnackbar = true
          vm.snackbarText = `${error}: ${error.response.data}`
        })
    },

    updateExerciseType() {
      const requestBody = {
        exerciseId: this.exerciseType.exerciseId,
        name: this.exerciseType.name,
        muscleGroup: this.exerciseType.muscleGroup,
        description: this.exerciseType.description,
      }

      const vm = this
      axios
        .put(
          `${import.meta.env.VITE_API_ENDPOINT}/gymstats/types`,
          requestBody,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
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
    },

    deleteExerciseType() {
      // show a simple confirmation dialog
      if (!confirm('Are you sure you want to delete this exercise type?')) {
        return
      }
      const vm = this
      axios
        .delete(
          `${import.meta.env.VITE_API_ENDPOINT}/gymstats/types/${
            this.exerciseType.exerciseId
          }/mg/${this.exerciseType.muscleGroup}`,
          {
            headers: {
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          console.log('exercise type deleted', response)
          vm.$emit('exerciseTypeDeleted', this.exerciseType)
        })
        .catch((error) => {
          console.error('error deleting exercise type', error)
          vm.showSnackbar = true
          vm.snackbarText = `${error}: ${error.response.data}`
        })
    },
  },
}
</script>
