<template>
  <v-timeline align-top dense dark>
    <v-timeline-item v-for="(stats, date) in loadedExerciseStats" :key="date" small>
      <v-card dark class="mx-auto pa-0" max-width="600">
        <v-card-title>{{ date }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col>
              <v-chip color="teal lighten-1" label>
                <v-icon left> mdi-weight-lifter </v-icon>
                Avg. Kilos
              </v-chip>
              <v-chip class="ml-2" color="primary">{{ stats.avgKilos }}</v-chip>
            </v-col>
            <v-col>
              <v-chip color="teal lighten-1" label>
                <v-icon left> mdi-dumbbell </v-icon>
                Avg. Reps
              </v-chip>
              <v-chip class="ml-2" color="primary">{{ stats.avgReps }}</v-chip>
            </v-col>
            <v-col>
              <v-chip color="teal lighten-1" label>
                <v-icon left> mdi-clock-time-four-outline </v-icon>
                Sets
              </v-chip>
              <v-chip class="ml-2" color="primary">{{ stats.sets }}</v-chip>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
export default {
  name: 'ExerciseTimeline',
  props: {
    loadedExerciseStats: {
      type: Object,
      required: true
    }
  }
}
</script>