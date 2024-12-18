<template>
  <v-row>
    <v-col>
      <v-card @click="showDialog = true" class="teal lighten-4">
        <v-img
          src="../../assets/gymstats/plus-sign.jpg"
          height="80"
          class="grey darken-4"
          contain
        ></v-img>
        <v-card-title class="text-h6">Add</v-card-title>
      </v-card>

      <v-dialog v-model="showDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">Add Exercise Type</span>
          </v-card-title>

          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    v-model="exerciseType.exerciseId"
                    label="ID"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    outlined
                    v-model="exerciseType.name"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="exerciseType.muscleGroup"
                    :items="muscleGroups"
                    item-text="name"
                    item-value="id"
                    label="Muscle Group"
                    return-object
                    outlined
                  ></v-select>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-textarea
                    outlined
                    v-model="exerciseType.description"
                    label="Description"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" dark large @click="showDialog = false">
              Cancel
            </v-btn>
            <v-btn
              color="success"
              dark
              large
              :disabled="addDisabled"
              style="margin-left: 50px"
              @click="addExerciseType"
            >
              Add
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="showSnackbar">
        {{ snackbarText }}
        <template #action="{ attrs }">
          <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </v-col>
  </v-row>
</template>

<script scoped>
import axios from 'axios'
import GymStatsData from '@/gymstats'

export default {
  name: 'AddExerciseType',

  data() {
    return {
      muscleGroups: GymStatsData.muscleGroups,
      showDialog: false,
      exerciseType: {
        id: '',
        name: '',
        muscleGroup: '',
        description: '',
      },
      snackbarText: '',
      showSnackbar: false,
    }
  },

  computed: {
    addDisabled() {
      return (
        !this.exerciseType.name ||
        !this.exerciseType.muscleGroup ||
        !this.exerciseType.exerciseId
      )
    },
  },

  methods: {
    addExerciseType() {
      const requestBody = {
        exerciseId: this.exerciseType.exerciseId,
        name: this.exerciseType.name,
        muscleGroup: this.exerciseType.muscleGroup.id,
        description: this.exerciseType.description,
      }

      const vm = this
      axios
        .post(
          `${process.env.VUE_APP_API_ENDPOINT}/gymstats/types`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            },
          }
        )
        .then((response) => {
          console.log(response)
          vm.showDialog = false
          vm.$emit('exerciseTypeAdded', this.exerciseType)
        })
        .catch((error) => {
          console.log(error)
          vm.snackbarText = `${error}, ${error.response.data}`
          vm.showSnackbar = true
        })
    },
  },
}
</script>
