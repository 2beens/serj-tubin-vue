<template>
  <v-container>
    <h2>💪 GymStats 💪</h2>

    <div v-if="currentTab === 'stats'">
      <ExerciseStats />
    </div>

    <div v-if="currentTab === 'log'">
      <ExercisesLog />
    </div>

    <div v-if="currentTab === 'list'">
      <ExercisesList />
    </div>

    <v-bottom-navigation v-model="currentTab" dark shift fixed background-color="black">
      <v-btn value="log">
        <span>Log</span>
        <v-icon color="teal lighten-1">mdi-timeline-text</v-icon>
      </v-btn>

      <v-btn value="stats">
        <span>Stats</span>
        <v-icon color="teal lighten-1">mdi-chart-bar</v-icon>
      </v-btn>

      <v-btn value="list">
        <span>List</span>
        <v-icon color="teal lighten-1">mdi-format-list-bulleted</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-container>
</template>

<style scoped>
h1,
h2,
h3,
h4,
h5 {
  color: #26c6da;
}
</style>

<script scoped>
import ExercisesList from '@/components/gymstats/ExercisesList.vue'
import ExercisesLog from '@/components/gymstats/ExercisesLog.vue'
import ExerciseStats from '@/components/gymstats/ExerciseStats.vue'

export default {
  name: 'GymStatsView',
  components: {
    ExercisesList,
    ExercisesLog,
    ExerciseStats
  },

  data() {
    return {
      currentTab: 'log'
    }
  }
}
</script>
