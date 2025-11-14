<template>
  <v-tooltip bottom>
    <template v-slot:activator="{ props }">
      <v-btn
        icon
        @click="handleToggle"
        v-bind="props"
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

  data() {
    const { isDark, toggleTheme } = useTheme()
    return {
      isDark,
      toggleTheme,
    }
  },

  watch: {
    isDark: {
      handler(newValue) {
        // Update Vuetify theme when isDark changes
        this.updateVuetifyTheme(newValue)
      },
      immediate: true,
    },
  },

  methods: {
    updateVuetifyTheme(dark) {
      if (!this.$vuetify || !this.$vuetify.theme) return

      const themeName = dark ? 'dark' : 'light'

      // Use Vuetify 3 API - theme.change()
      if (typeof this.$vuetify.theme.change === 'function') {
        this.$vuetify.theme.change(themeName)
        return
      }
      // Fallback to theme.global.name
      if (this.$vuetify.theme.global && this.$vuetify.theme.global.name) {
        if (typeof this.$vuetify.theme.global.name === 'object' && 'value' in this.$vuetify.theme.global.name) {
          this.$vuetify.theme.global.name.value = themeName
        } else {
          this.$vuetify.theme.global.name = themeName
        }
        return
      }
      // Fallback to theme.dark
      if (this.$vuetify.theme.dark !== undefined) {
        this.$vuetify.theme.dark = dark
      }
    },

    handleToggle() {
      this.toggleTheme()
      // The watch will handle updating Vuetify theme
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
