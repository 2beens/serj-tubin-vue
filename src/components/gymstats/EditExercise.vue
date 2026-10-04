<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title class="text-h6">Edit exercise</v-card-title>
      <v-card-text>
        <v-container v-if="exercise">
          <v-row>
            <v-col cols="12" class="ma-0 mt-2 pa-0">
              <v-select
                v-model="form.muscleGroup"
                :items="muscleGroups"
                item-text="name"
                item-value="id"
                label="Muscle Group"
                return-object
                solo
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" class="ma-0 pa-0">
              <v-select
                v-model="form.exerciseId"
                :items="exercisesForSelectedMuscleGroup"
                item-text="name"
                item-value="exerciseId"
                label="Exercise"
                solo
                dense
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" class="ma-0 pa-0">
              <v-text-field
                v-model="form.kilos"
                label="Kilos"
                type="number"
                required
                dense
                solo
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="ma-0 pa-0">
              <v-text-field
                v-model="form.reps"
                label="Reps"
                type="number"
                required
                dense
                solo
              ></v-text-field>
            </v-col>
            <v-col
              cols="12"
              sm="6"
              v-if="$vuetify.breakpoint.mdAndUp"
              class="ma-0 pa-0"
            >
              <v-text-field
                v-model="form.createdAt"
                label="Created At"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" v-if="$vuetify.breakpoint.mdAndUp">
              <v-text-field
                v-model="form.metadataJson"
                label="Metadata"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error" dark @click="$emit('delete', exercise)">
          Delete
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="grey" dark @click="$emit('input', false)">Close</v-btn>
        <v-btn
          color="success"
          dark
          @click="onSave"
          :disabled="saveDisabled"
          class="ml-2"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import GymStatsData from '@/gymstats'

export default {
  name: 'EditExercise',
  props: {
    value: { type: Boolean, default: false },
    exercise: { type: Object, default: null },
  },
  data() {
    return {
      muscleGroups: GymStatsData.muscleGroups,
      muscleGroupToExercises: GymStatsData.muscleGroupToExercises,
      form: {
        muscleGroup: null,
        exerciseId: null,
        kilos: '',
        reps: '',
        createdAt: '',
        metadataJson: '',
      },
    }
  },
  watch: {
    value(open) {
      if (open) {
        this.loadExerciseTypes()
      }
    },
    exercise: {
      immediate: true,
      handler(ex) {
        if (!ex) return
        const mg = this.muscleGroups.find((g) => g.id === ex.muscleGroup)
        this.form = {
          muscleGroup: mg || null,
          exerciseId: ex.exerciseId,
          kilos: String(ex.kilos),
          reps: String(ex.reps),
          createdAt: ex.createdAt || '',
          metadataJson: ex.metadataJson || JSON.stringify(ex.metadata || {}),
        }
      },
    },
  },
  mounted() {
    const stored = localStorage.getItem('exerciseTypes')
    if (stored && stored.length > 0) {
      try {
        this.muscleGroupToExercises = JSON.parse(stored)
      } catch (error) {
        console.error('stored exercise types are not valid JSON', error)
      }
    }
    this.loadExerciseTypes()
  },
  computed: {
    saveDisabled() {
      const kilos = Number(this.form.kilos)
      const reps = Number(this.form.reps)
      return (
        this.form.kilos === '' ||
        this.form.reps === '' ||
        !Number.isInteger(kilos) ||
        kilos < 0 ||
        !Number.isInteger(reps) ||
        reps < 0 ||
        !this.form.muscleGroup ||
        !this.form.exerciseId
      )
    },
    exercisesForSelectedMuscleGroup() {
      if (!this.form.muscleGroup)
        return [{ exerciseId: null, name: 'Select a muscle group first ⛔️' }]
      const exercises =
        this.muscleGroupToExercises[this.form.muscleGroup.id] || []
      if (
        this.form.exerciseId &&
        !exercises.some((item) => item.exerciseId === this.form.exerciseId)
      ) {
        return [
          { exerciseId: this.form.exerciseId, name: this.form.exerciseId },
          ...exercises,
        ]
      }
      if (exercises.length === 0) {
        return [
          {
            exerciseId: null,
            name: `No exercises for: ${this.form.muscleGroup.id} ⛔️`,
          },
        ]
      }
      return exercises
    },
  },
  methods: {
    loadExerciseTypes() {
      if (!this.getCookie('sessionkolacic')) {
        return
      }
      axios
        .get(`${process.env.VUE_APP_API_ENDPOINT}/gymstats/types`, {
          headers: {
            'X-SERJ-TOKEN': this.getCookie('sessionkolacic'),
          },
        })
        .then((response) => {
          if (!response.data) {
            return
          }
          const grouped = {}
          response.data.forEach((exerciseType) => {
            if (!grouped[exerciseType.muscleGroup]) {
              grouped[exerciseType.muscleGroup] = []
            }
            grouped[exerciseType.muscleGroup].push(exerciseType)
          })
          this.muscleGroupToExercises = grouped
        })
        .catch((error) => {
          console.error('error loading exercise types', error)
        })
    },

    onSave() {
      if (!this.exercise) return
      const payload = {
        ...this.exercise,
        muscleGroup: this.form.muscleGroup.id,
        exerciseId: this.form.exerciseId,
        kilos: Number(this.form.kilos),
        reps: Number(this.form.reps),
        createdAt: this.form.createdAt,
        metadataJson: this.form.metadataJson,
      }
      this.$emit('save', payload)
      this.$emit('input', false)
    },
  },
}
</script>
