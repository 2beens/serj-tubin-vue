<template>
  <v-row justify="center">
    <v-dialog v-model="showDialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on"> Add Exercise ➕ </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="text-h5">Add Exercise</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-autocomplete
                  v-model="exercise.muscleGroup"
                  :items="[
                    'biceps 💪',
                    'triceps 💪',
                    'legs 🦵',
                    'shoulders 🤷‍♂️',
                    'chest 🙌',
                    'back 🚶‍♂️',
                    'other 🚀'
                  ]"
                  label="Muscle Group"
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="exercise.exerciseId"
                  label="Exercise ID"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="exercise.kilos" label="Kilos" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="exercise.reps" label="Reps" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="exercise.createdAt"
                  label="Created At"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="exercise.metadataJson"
                  label="Metadata"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" dark large @click="showDialog = false"> Close </v-btn>
          <v-btn color="success" dark large @click="addExercise" :disabled="addDisabled" style="margin-left: 50px;">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="showSnackbar">
      {{ snackbarText }}

      <template #action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="showSnackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </v-row>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AddExercise',
  data: function () {
    return {
      showDialog: false,
      exercise: {
        muscleGroup: '',
        exerciseId: '',
        kilos: '',
        reps: '',
        createdAt: '2023-07-10T18:34:00Z',
        metadataJson: '{"env":"prod","testing":"true"}'
      },
      snackbarText: '',
      showSnackbar: false
    }
  },

  computed: {
    addDisabled() {
      if (!this.exercise.kilos || isNaN(this.exercise.kilos)) {
        return true
      }
      if (!this.exercise.reps || isNaN(this.exercise.reps)) {
        return true
      }

      return (
        !this.exercise.muscleGroup ||
        !this.exercise.exerciseId
      )
    }
  },

  mounted() {
    // get last added exercise from local storage
    const lastAddedExercise = localStorage.getItem('lastAddedExercise')
    if (lastAddedExercise) {
      this.exercise = JSON.parse(lastAddedExercise)
    }
  },

  methods: {
    addExercise() {
      console.log('adding exercise', this.exercise)

      // store added exercise in local storage, and get it from there when adding next time
      localStorage.setItem('lastAddedExercise', JSON.stringify(this.exercise))

      const requestBody = {
        muscleGroup: this.exercise.muscleGroup,
        exerciseId: this.exercise.exerciseId,
        kilos: Number(this.exercise.kilos),
        reps: Number(this.exercise.reps),
        createdAt: this.exercise.createdAt,
        metadataJson: this.exercise.metadataJson
      }

      const vm = this
      axios
        .post(process.env.VUE_APP_API_ENDPOINT + '/gymstats', requestBody, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
            'Content-Type': 'application/json'
          }
        })
        .then(function (response) {
          if (!response.data) {
            vm.snackbarText = 'Received unexpected response from server'
            vm.showSnackbar = true
            console.warn(response)
            return
          }

          vm.snackbarText = `Exercise ${response.data.id} added!`
          vm.showSnackbar = true
          vm.showDialog = false
        })
        .catch(function (error) {
          vm.snackbarText = error
          vm.showSnackbar = true
          console.log(error)
        })
    }
  }
}
</script>