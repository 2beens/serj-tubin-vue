<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        @click="toggleTheme"
        v-bind="attrs"
        v-on="on"
        :color="isDark ? 'yellow darken-2' : 'blue-grey darken-2'"
        class="theme-toggle-btn"
      >
        <v-icon>
          {{ isDark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}
        </v-icon>
      </v-btn>
    </template>
    <span>{{ isDark ? 'Switch to light theme' : 'Switch to dark theme' }}</span>
  </v-tooltip>
</template>

<script>
import { useTheme } from '@/composables/useTheme'

export default {
  name: 'ThemeToggle',

  setup() {
    const { isDark, toggleTheme } = useTheme()

    return {
      isDark,
      toggleTheme,
    }
  },

  watch: {
    isDark: {
      handler(newValue) {
        // Update Vuetify theme
        this.$vuetify.theme.dark = newValue
      },
      immediate: true,
    },
  },
}
</script>

<style scoped>
.theme-toggle-btn {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-btn:hover {
  transform: scale(1.1);
}

.theme-toggle-btn .v-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.theme-toggle-btn:hover .v-icon {
  transform: rotate(20deg);
}
</style>
