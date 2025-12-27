import { ref, computed } from 'vue'

/**
 * Authentication State Management Composable
 * 
 * Provides reactive authentication state that persists across page reloads.
 * The state is derived from the session cookie.
 */
const loggedIn = ref(false)

// Check authentication status from cookie on initialization
const checkAuthFromCookie = () => {
  try {
    const nameEQ = 'sessionkolacic='
    const ca = document.cookie.split(';')
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        const token = c.substring(nameEQ.length, c.length)
        loggedIn.value = Boolean(token && token.length > 0)
        return
      }
    }
    loggedIn.value = false
  } catch (error) {
    console.error('Error checking auth from cookie:', error)
    loggedIn.value = false
  }
}

// Initialize on module load
checkAuthFromCookie()

export const useAuth = () => {
  const setLoggedIn = (value) => {
    loggedIn.value = value
  }

  const checkAuth = () => {
    checkAuthFromCookie()
  }

  return {
    loggedIn: computed(() => loggedIn.value),
    setLoggedIn,
    checkAuth,
  }
}

// Export the ref directly for use in main.js
export { loggedIn }

