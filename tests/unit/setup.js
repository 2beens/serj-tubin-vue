// Global test setup
const originalWarn = console.warn
console.warn = (...args) => {
  if (typeof args[0] === 'string' && args[0].includes('will edit exercise'))
    return
  if (
    typeof args[0] === 'string' &&
    args[0].includes('[Vuetify] Unable to locate target [data-app]')
  )
    return
  originalWarn.apply(console, args)
}

// Vuetify needs a [data-app] mount target for dialogs/detachable components
if (typeof document !== 'undefined' && !document.querySelector('[data-app]')) {
  const app = document.createElement('div')
  app.setAttribute('data-app', 'true')
  document.body.appendChild(app)
}
