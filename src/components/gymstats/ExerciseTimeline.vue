<template>
  <div class="background-black">
    <v-card
      v-for="(stats, date) in loadedExerciseStats"
      :key="date"
      class="mx-auto my-2 pa-2"
      max-width="600"
    >
      <v-card-title class="ma-0">{{ date }}</v-card-title>
      <v-card-text>
        <v-row no-gutters>
          <v-col>
            <v-chip color="green lighten-1" label>
              <v-icon left>mdi-weight-lifter</v-icon>
              Avg. Kilos
            </v-chip>
            <v-chip class="ml-2 value-chip" color="primary" outlined>
              {{ stats.avgKilos }}
            </v-chip>
          </v-col>
          <v-col>
            <v-chip color="blue lighten-1" label>
              <v-icon left>mdi-dumbbell</v-icon>
              Avg. Reps
            </v-chip>
            <v-chip class="ml-2 value-chip" color="primary" outlined>
              {{ stats.avgReps }}
            </v-chip>
          </v-col>
          <v-col>
            <v-chip color="orange lighten-1" label>
              <v-icon left>mdi-clock-time-four-outline</v-icon>
              Sets
            </v-chip>
            <v-chip class="ml-2 value-chip" color="primary" outlined>
              {{ stats.sets }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'ExerciseTimeline',
  props: {
    loadedExerciseStats: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.background-black {
  background-color: black;
}

.v-card {
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  font-weight: bold;
  font-size: 0.9em;
}

.v-chip {
  font-size: 0.8em;
}

.value-chip {
  font-size: 1em;
  font-weight: bold;
}
</style>
