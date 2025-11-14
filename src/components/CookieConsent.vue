<template>
  <div class="cookie-consent">
    <slot name="message">
      <div class="cookie-consent-message">
        This site uses cookies to analyze website traffic and optimize your
        website experience.
      </div>
    </slot>
    <slot name="button" :acceptCookies="acceptCookies">
      <button class="cookie-consent-button" @click="acceptCookies">
        Accept
      </button>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'CookieConsent',
  methods: {
    acceptCookies() {
      // Set cookie for 1 year
      const date = new Date()
      date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000)
      const expires = '; expires=' + date.toUTCString()
      document.cookie = 'cookieconsent_status=allow' + expires + '; path=/'

      // Emit event for parent component
      this.$emit('accept')

      // Reload page to apply cookie consent
      window.location.reload()
    },
  },
}
</script>

<style scoped>
.cookie-consent {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cookie-consent-message {
  color: white;
}

.cookie-consent-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: 1px solid #ffffff3d;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: black;
  color: white;
}

.cookie-consent-button:hover {
  background-color: #111;
  transform: translateY(-1px);
}
</style>
