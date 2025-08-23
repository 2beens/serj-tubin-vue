import { ref, watch } from 'vue'

/**
 * Theme Management Composable
 *
 * Provides reactive theme switching functionality with persistence.
 *
 * Usage:
 * import { useTheme } from '@/composables/useTheme'
 * const { isDark, toggleTheme, setTheme } = useTheme()
 *
 * Features:
 * - Automatic localStorage persistence
 * - Reactive theme state
 * - Vuetify integration
 * - Custom theme colors for light/dark modes
 */

// Theme state - reactive and persistent
const isDark = ref(true) // Default to dark theme to match current design

// Theme configuration
export const themes = {
  light: {
    primary: '#1976D2',
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    'on-background': '#000000',
    'on-surface': '#000000',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-accent': '#000000',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#000000',
    // Custom colors for the app
    'app-background': '#F5F5F5',
    'card-background': '#FFFFFF',
    'sidebar-background': '#FAFAFA',
    'text-primary': '#2F72B5',
    'text-secondary': '#666666',
    'link-color': '#1976D2',
    'link-visited': '#7B1FA2',
    'link-hover': '#388E3C',
    'teal-accent': '#009688',
  },
  dark: {
    primary: '#40A9FF',
    secondary: '#424242',
    accent: '#69C0FF',
    error: '#FF5252',
    info: '#40A9FF',
    success: '#4CAF50',
    warning: '#FB8C00',
    background: '#1A1F2E',
    surface: '#2A3441',
    'on-background': '#FFFFFF',
    'on-surface': '#FFFFFF',
    'on-primary': '#FFFFFF',
    'on-secondary': '#FFFFFF',
    'on-accent': '#FFFFFF',
    'on-error': '#FFFFFF',
    'on-info': '#FFFFFF',
    'on-success': '#FFFFFF',
    'on-warning': '#FFFFFF',
    // Custom colors for the app (brighter azure theme)
    'app-background': '#1A1F2E',
    'card-background': '#2A3441',
    'sidebar-background': '#232936',
    'text-primary': '#87CEEB',
    'text-secondary': '#E6F3FF',
    'link-color': '#40A9FF',
    'link-visited': '#1890FF',
    'link-hover': '#69C0FF',
    'teal-accent': '#40A9FF',
  },
}

// Load theme preference from localStorage
const loadThemePreference = () => {
  try {
    const saved = localStorage.getItem('theme-preference')
    if (saved !== null) {
      isDark.value = saved === 'dark'
    }
  } catch (error) {
    console.warn('Could not load theme preference:', error)
  }
}

// Save theme preference to localStorage
const saveThemePreference = (theme) => {
  try {
    localStorage.setItem('theme-preference', theme)
  } catch (error) {
    console.warn('Could not save theme preference:', error)
  }
}

// Initialize theme from localStorage
loadThemePreference()

// Watch for theme changes and persist them
watch(
  isDark,
  (newValue) => {
    saveThemePreference(newValue ? 'dark' : 'light')
  },
  { immediate: false }
)

export const useTheme = () => {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const setTheme = (theme) => {
    isDark.value = theme === 'dark'
  }

  const getCurrentTheme = () => {
    return isDark.value ? 'dark' : 'light'
  }

  const getThemeColors = () => {
    return themes[getCurrentTheme()]
  }

  return {
    isDark,
    toggleTheme,
    setTheme,
    getCurrentTheme,
    getThemeColors,
    themes,
  }
}

// Export for direct access
export { isDark }
