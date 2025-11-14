# Vue 2 to Vue 3 Migration Runbook

**Purpose**: Technical step-by-step guide for AI-assisted migration execution.
**Approach**: Atomic steps that can be committed independently with verification.

---

## Prerequisites

- [ ] Branch `vue3` is created and checked out
- [ ] Current codebase is working (run `yarn serve` to verify)
- [ ] All changes are committed to master/main branch
- [ ] Git status is clean

**Verification Command:**
```bash
git status
git branch
```

---

## Step 1: Update package.json Dependencies

**Objective**: Update all Vue 3 related dependencies in package.json

**Files to Modify:**
- `package.json`

**Changes:**
1. Update `vue`: `^2.7.14` → `^3.4.21`
2. Update `vue-router`: `^3.6.5` → `^4.2.5`
3. Update `vuetify`: `^2.6.15` → `^3.5.13`
4. Remove `vue-template-compiler` from devDependencies
5. Keep `vue-chartjs` at `^5.2.0` (check compatibility later)
6. Keep `vue-cookieconsent-component` at `^1.2.0` (check compatibility later)

**Expected Result:**
```json
"dependencies": {
  "vue": "^3.4.21",
  "vue-router": "^4.2.5",
  "vuetify": "^3.5.13",
  ...
}
"devDependencies": {
  // vue-template-compiler removed
  ...
}
```

**Verification:**
```bash
# Check package.json was updated correctly
grep -A 2 '"vue"' package.json
grep -A 2 '"vue-router"' package.json
grep -A 2 '"vuetify"' package.json
# Verify vue-template-compiler is removed
grep "vue-template-compiler" package.json || echo "✓ Removed"
```

**Commit:**
```bash
git add package.json
git commit -m "chore: update dependencies for Vue 3 migration

- Update vue: ^2.7.14 → ^3.4.21
- Update vue-router: ^3.6.5 → ^4.2.5
- Update vuetify: ^2.6.15 → ^3.5.13
- Remove vue-template-compiler (not needed in Vue 3)"
```

---

## Step 2: Install Updated Dependencies

**Objective**: Install all updated dependencies

**Command:**
```bash
yarn install
```

**Verification:**
```bash
# Check that Vue 3 is installed
yarn list vue | grep vue@3
# Check that vue-router 4 is installed
yarn list vue-router | grep vue-router@4
# Check that Vuetify 3 is installed
yarn list vuetify | grep vuetify@3
```

**Expected Output:**
- Should see vue@3.x.x
- Should see vue-router@4.x.x
- Should see vuetify@3.x.x

**Note**: This step may produce warnings/errors. Document them but continue.

**Commit:**
```bash
git add yarn.lock package.json
git commit -m "chore: install Vue 3 dependencies"
```

---

## Step 3: Update main.js - Global API Migration

**Objective**: Convert Vue 2 global API to Vue 3 createApp API

**Files to Modify:**
- `src/main.js`

**Changes:**
1. Replace `import Vue from 'vue'` with `import { createApp } from 'vue'`
2. Remove `Vue.config.productionTip = false`
3. Replace `Vue.mixin()` with `app.mixin()`
4. Replace `new Vue({...}).$mount('#app')` with `createApp(App).use(...).mount('#app')`
5. Handle `$root.loggedIn` via `app.config.globalProperties.$root`

**Before:**
```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    date2string(aDate) { ... },
    getTimestampString(date) { ... },
    setCookie(name, value, days) { ... },
    getCookie(name) { ... },
    eraseCookie(name) { ... },
  },
})

new Vue({
  router,
  vuetify,
  data: {
    loggedIn: false,
  },
  render: function (h) {
    return h(App)
  },
}).$mount('#app')
```

**After:**
```javascript
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mixin({
  methods: {
    date2string(aDate) { ... },
    getTimestampString(date) { ... },
    setCookie(name, value, days) { ... },
    getCookie(name) { ... },
    eraseCookie(name) { ... },
  },
})

// Global state for loggedIn (maintains $root.loggedIn compatibility)
app.config.globalProperties.$root = {
  loggedIn: false,
}

app.mount('#app')
```

**Verification:**
```bash
# Check that createApp is imported
grep "createApp" src/main.js
# Check that Vue import is removed
grep "^import Vue" src/main.js || echo "✓ Vue import removed"
# Check that app.mount is used
grep "app.mount" src/main.js
```

**Commit:**
```bash
git add src/main.js
git commit -m "refactor: migrate main.js to Vue 3 createApp API

- Replace Vue global API with createApp
- Update Vue.use() to app.use()
- Update Vue.mixin() to app.mixin()
- Maintain $root.loggedIn via globalProperties"
```

---

## Step 4: Update router/index.js - Vue Router 4 Migration

**Objective**: Convert Vue Router 3 to Vue Router 4 API

**Files to Modify:**
- `src/router/index.js`

**Changes:**
1. Replace `import VueRouter from 'vue-router'` with `import { createRouter, createWebHistory } from 'vue-router'`
2. Remove `Vue.use(VueRouter)`
3. Replace `new VueRouter({ mode: 'history', ... })` with `createRouter({ history: createWebHistory(...), ... })`
4. Keep async component imports as-is (arrow functions work in Vue 3)

**Before:**
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [ ... ]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
```

**After:**
```javascript
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const routes = [ ... ]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

export default router
```

**Verification:**
```bash
# Check that createRouter is imported
grep "createRouter" src/router/index.js
# Check that VueRouter import is removed
grep "VueRouter" src/router/index.js || echo "✓ VueRouter import removed"
# Check that createWebHistory is used
grep "createWebHistory" src/router/index.js
```

**Commit:**
```bash
git add src/router/index.js
git commit -m "refactor: migrate router to Vue Router 4

- Replace VueRouter with createRouter
- Update mode: 'history' to createWebHistory()
- Remove Vue.use(VueRouter)"
```

---

## Step 5: Update plugins/vuetify.js - Vuetify 3 Setup

**Objective**: Convert Vuetify 2 plugin setup to Vuetify 3

**Files to Modify:**
- `src/plugins/vuetify.js`

**Changes:**
1. Replace `import Vuetify from 'vuetify'` with `import { createVuetify } from 'vuetify'`
2. Replace `import 'vuetify/dist/vuetify.min.css'` with Vuetify 3 CSS imports
3. Remove `Vue.use(Vuetify)` and `Vue.use(Bar)`
4. Replace `new Vuetify({...})` with `createVuetify({...})`
5. Update theme configuration for Vuetify 3 API

**Before:**
```javascript
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import { Bar } from 'vue-chartjs'
import { themes } from '@/composables/useTheme'

Vue.use(Vuetify)
Vue.use(Bar)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: themes.light,
      dark: themes.dark,
    },
    options: {
      customProperties: true,
    },
  },
})
```

**After:**
```javascript
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import { Bar } from 'vue-chartjs'
import { themes } from '@/composables/useTheme'

// Note: Bar registration will be handled in main.js if needed

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: themes.light,
      dark: themes.dark,
    },
  },
})
```

**Note**: Vuetify 3 requires explicit component/directive imports or auto-import. We'll use explicit imports for now.

**Verification:**
```bash
# Check that createVuetify is imported
grep "createVuetify" src/plugins/vuetify.js
# Check that Vue import is removed
grep "^import Vue" src/plugins/vuetify.js || echo "✓ Vue import removed"
```

**Commit:**
```bash
git add src/plugins/vuetify.js
git commit -m "refactor: migrate Vuetify plugin to V3

- Replace Vuetify with createVuetify
- Update CSS imports to Vuetify 3
- Update theme configuration API
- Remove Vue.use() calls"
```

**Note**: This step may break the app. We'll fix component usage in later steps.

---

## Step 6: Fix Lifecycle Hook Renames

**Objective**: Rename `beforeDestroy` to `beforeUnmount`

**Files to Modify:**
- `src/components/gymstats/ExercisesLog.vue`
- `src/components/BlogsList.vue`

**Changes:**
1. Find `beforeDestroy()` method
2. Rename to `beforeUnmount()`

**Search Pattern:**
```bash
grep -n "beforeDestroy" src/components/gymstats/ExercisesLog.vue
grep -n "beforeDestroy" src/components/BlogsList.vue
```

**Verification:**
```bash
# Verify beforeDestroy is removed
grep "beforeDestroy" src/components/gymstats/ExercisesLog.vue || echo "✓ Fixed"
grep "beforeDestroy" src/components/BlogsList.vue || echo "✓ Fixed"
# Verify beforeUnmount exists
grep "beforeUnmount" src/components/gymstats/ExercisesLog.vue
grep "beforeUnmount" src/components/BlogsList.vue
```

**Commit:**
```bash
git add src/components/gymstats/ExercisesLog.vue src/components/BlogsList.vue
git commit -m "refactor: rename beforeDestroy to beforeUnmount

- Update lifecycle hooks for Vue 3 compatibility"
```

---

## Step 7: Replace keyCode Usage

**Objective**: Replace `event.keyCode` with `event.key`

**Files to Modify:**
- `src/views/VisitorBoardView.vue` (line ~94)
- `src/components/LoginLogoutButton.vue` (line ~105)

**Changes:**
1. Replace `event.keyCode !== 13` with `event.key !== 'Enter'`
2. Replace `e.keyCode === 13` with `e.key === 'Enter'`

**Before:**
```javascript
if (event.keyCode !== 13 || !this.messageInput) {
```

**After:**
```javascript
if (event.key !== 'Enter' || !this.messageInput) {
```

**Verification:**
```bash
# Verify keyCode is removed
grep "keyCode" src/views/VisitorBoardView.vue || echo "✓ Fixed"
grep "keyCode" src/components/LoginLogoutButton.vue || echo "✓ Fixed"
# Verify event.key is used
grep "event.key" src/views/VisitorBoardView.vue
grep "e.key" src/components/LoginLogoutButton.vue
```

**Commit:**
```bash
git add src/views/VisitorBoardView.vue src/components/LoginLogoutButton.vue
git commit -m "refactor: replace keyCode with event.key

- Replace keyCode !== 13 with key !== 'Enter'
- Update for Vue 3 compatibility"
```

---

## Step 8: Replace .sync Modifiers with v-model

**Objective**: Convert all `.sync` modifiers to `v-model` syntax

**Files to Modify:**
- `src/views/UrlShortenerView.vue` (line ~60)
- `src/components/gymstats/ExercisesLog.vue` (lines ~132, 152, 170, 188, 204, 220)
- `src/components/filebox/FileBox.vue` (line ~193)

**Changes:**
1. Find all `:prop-name.sync="value"`
2. Replace with `v-model:prop-name="value"`

**Before:**
```vue
<v-edit-dialog :return-value.sync="item.exerciseId">
```

**After:**
```vue
<v-edit-dialog v-model:return-value="item.exerciseId">
```

**Search Pattern:**
```bash
grep -n "\.sync" src/views/UrlShortenerView.vue
grep -n "\.sync" src/components/gymstats/ExercisesLog.vue
grep -n "\.sync" src/components/filebox/FileBox.vue
```

**Verification:**
```bash
# Verify .sync is removed
grep "\.sync" src/views/UrlShortenerView.vue || echo "✓ Fixed"
grep "\.sync" src/components/gymstats/ExercisesLog.vue || echo "✓ Fixed"
grep "\.sync" src/components/filebox/FileBox.vue || echo "✓ Fixed"
# Verify v-model: is used
grep "v-model:" src/views/UrlShortenerView.vue
grep "v-model:" src/components/gymstats/ExercisesLog.vue
grep "v-model:" src/components/filebox/FileBox.vue
```

**Commit:**
```bash
git add src/views/UrlShortenerView.vue src/components/gymstats/ExercisesLog.vue src/components/filebox/FileBox.vue
git commit -m "refactor: replace .sync modifiers with v-model

- Convert :prop.sync to v-model:prop syntax
- Update for Vue 3 compatibility"
```

---

## Step 9: Update Vuetify Component Props - Button Variant

**Objective**: Update `text` prop to `variant="text"` on v-btn components

**Files to Search:**
- All `.vue` files using `<v-btn text>`

**Changes:**
1. Find all `<v-btn text>` or `<v-btn :text="...">`
2. Replace with `<v-btn variant="text">` or `<v-btn :variant="...">`

**Before:**
```vue
<v-btn text>Button</v-btn>
```

**After:**
```vue
<v-btn variant="text">Button</v-btn>
```

**Search Pattern:**
```bash
grep -r "v-btn.*text" src/ --include="*.vue" | grep -v "variant"
```

**Files Likely Affected:**
- `src/App.vue`
- Multiple component files

**Verification:**
```bash
# Check for remaining text props (should be minimal or none)
grep -r 'v-btn.*\stext[^=]' src/ --include="*.vue" | grep -v "variant" || echo "✓ All updated"
```

**Commit:**
```bash
git add -A
git commit -m "refactor: update v-btn text prop to variant

- Replace text prop with variant='text' for Vuetify 3"
```

---

## Step 10: Update Vuetify Activator Slots

**Objective**: Update activator slot syntax from Vuetify 2 to Vuetify 3

**Files to Modify:**
- `src/components/ThemeToggle.vue`
- `src/components/LoginLogoutButton.vue`
- Any other components using `v-slot:activator="{ on, attrs }"`

**Changes:**
1. Find `v-slot:activator="{ on, attrs }"`
2. Replace with `v-slot:activator="{ props }"`
3. Replace `v-bind="attrs" v-on="on"` with `v-bind="props"`

**Before:**
```vue
<template v-slot:activator="{ on, attrs }">
  <v-btn v-bind="attrs" v-on="on">Click</v-btn>
</template>
```

**After:**
```vue
<template v-slot:activator="{ props }">
  <v-btn v-bind="props">Click</v-btn>
</template>
```

**Search Pattern:**
```bash
grep -r "activator.*on.*attrs" src/ --include="*.vue"
```

**Verification:**
```bash
# Verify old syntax is removed
grep -r 'activator.*on.*attrs' src/ --include="*.vue" || echo "✓ All updated"
# Verify new syntax exists
grep -r 'activator.*props' src/ --include="*.vue"
```

**Commit:**
```bash
git add -A
git commit -m "refactor: update Vuetify activator slots to v3 syntax

- Replace { on, attrs } with { props }
- Update v-bind/v-on to v-bind='props'"
```

---

## Step 11: Update Vuetify Breakpoint Usage

**Objective**: Update breakpoint API usage for Vuetify 3

**Files to Modify:**
- `src/App.vue` (uses `$vuetify.breakpoint.smAndDown`)

**Changes:**
1. Check if `smAndDown` still works (it should in Vuetify 3)
2. If not, replace with `display.smAndDown` or use composable

**Note**: Vuetify 3 maintains similar breakpoint API, but verify usage.

**Search Pattern:**
```bash
grep -r "\$vuetify.breakpoint" src/ --include="*.vue"
```

**Verification:**
```bash
# Check breakpoint usage
grep -r "\$vuetify.breakpoint" src/ --include="*.vue"
```

**Commit (if changes needed):**
```bash
git add -A
git commit -m "refactor: update Vuetify breakpoint API for v3"
```

---

## Step 12: Fix vue-chartjs Registration

**Objective**: Ensure vue-chartjs Bar component is properly registered

**Files to Modify:**
- `src/plugins/vuetify.js` (remove Bar registration if present)
- `src/main.js` (add Bar registration if needed)

**Changes:**
1. Check if Bar needs to be registered globally
2. If yes, add to main.js: `app.component('Bar', Bar)`

**Note**: vue-chartjs v5 should work with Vue 3, but may need component registration.

**Verification:**
```bash
# Check if Bar is used anywhere
grep -r "<Bar" src/ --include="*.vue"
```

**Commit (if changes needed):**
```bash
git add src/main.js
git commit -m "fix: register vue-chartjs Bar component for Vue 3"
```

---

## Step 13: Test Basic Application Startup

**Objective**: Verify the application can start without errors

**Command:**
```bash
yarn serve
```

**Expected Result:**
- Application should start (may have runtime errors, but should compile)
- Check browser console for errors
- Document any errors found

**Verification Checklist:**
- [ ] Application compiles without build errors
- [ ] Application starts on http://localhost:8080
- [ ] No critical console errors (warnings are OK)
- [ ] Home page renders (even if broken)

**Note**: If application doesn't start, document errors and continue to fix in next steps.

**No commit needed** - this is a verification step.

---

## Step 14: Fix Vuetify Component Issues (Iterative)

**Objective**: Fix Vuetify 3 component compatibility issues one by one

**Approach**: For each error found in Step 13, fix individually.

**Common Issues to Fix:**
1. Component prop name changes
2. Slot syntax changes
3. Event name changes
4. CSS class changes

**Process:**
1. Identify error from console/logs
2. Find the component causing the error
3. Check Vuetify 3 migration guide for that component
4. Fix the issue
5. Test
6. Commit

**Example Commit:**
```bash
git add src/components/SomeComponent.vue
git commit -m "fix: update SomeComponent for Vuetify 3

- Update prop names
- Fix slot syntax"
```

**Repeat this step until all Vuetify errors are resolved.**

---

## Step 15: Fix vue-cookieconsent-component

**Objective**: Ensure cookie consent component works with Vue 3

**Files to Modify:**
- `src/App.vue` (uses CookieConsent component)

**Options:**
1. Check if vue-cookieconsent-component has Vue 3 support
2. If not, find alternative or create custom component
3. Update component usage

**Search:**
```bash
npm view vue-cookieconsent-component versions --json
# Check latest version supports Vue 3
```

**If replacement needed:**
- Consider: `vue-cookieconsent` or custom implementation

**Verification:**
```bash
# Test cookie consent appears and works
# Check browser console for errors
```

**Commit:**
```bash
git add -A
git commit -m "fix: update cookie consent for Vue 3 compatibility"
```

---

## Step 16: Run Linter and Fix Issues

**Objective**: Fix all linting errors

**Command:**
```bash
yarn lint
```

**Process:**
1. Run linter
2. Fix each error
3. Re-run until clean

**Verification:**
```bash
yarn lint
# Should exit with code 0
```

**Commit:**
```bash
git add -A
git commit -m "style: fix linting errors for Vue 3"
```

---

## Step 17: Manual Testing - Core Features

**Objective**: Manually test all core features

**Testing Checklist:**
- [ ] Home page loads
- [ ] Navigation works (desktop)
- [ ] Navigation works (mobile/drawer)
- [ ] Login functionality
- [ ] Logout functionality
- [ ] Theme toggle
- [ ] All routes are accessible
- [ ] No console errors

**Document Issues:**
- Create list of any broken features
- Prioritize fixes

**No commit** - document findings.

---

## Step 18: Fix Remaining Issues (Iterative)

**Objective**: Fix all issues found in Step 17

**Process:**
1. For each broken feature:
   - Identify the issue
   - Fix the code
   - Test the fix
   - Commit

**Example Commits:**
```bash
git add src/components/SomeComponent.vue
git commit -m "fix: resolve SomeFeature issue

- Fix specific problem
- Update for Vue 3 compatibility"
```

**Repeat until all features work.**

---

## Step 19: Run E2E Tests

**Objective**: Verify E2E tests pass

**Command:**
```bash
yarn test:e2e:run
```

**Process:**
1. Run tests
2. Fix any failing tests
3. Update test code if needed (Cypress selectors, etc.)

**Verification:**
```bash
yarn test:e2e:run
# All tests should pass
```

**Commit:**
```bash
git add cypress/
git commit -m "test: update E2E tests for Vue 3

- Fix selectors if needed
- Update test expectations"
```

---

## Step 20: Final Verification

**Objective**: Complete final checks before considering migration complete

**Checklist:**
- [ ] Application builds: `yarn build`
- [ ] Application serves: `yarn serve`
- [ ] All routes work
- [ ] All features work
- [ ] No console errors
- [ ] E2E tests pass
- [ ] Linter passes
- [ ] No TypeScript errors (if applicable)

**Command:**
```bash
yarn build
yarn serve
yarn lint
yarn test:e2e:run
```

**Final Commit (if any remaining fixes):**
```bash
git add -A
git commit -m "chore: final Vue 3 migration fixes

- Address remaining issues
- Complete migration"
```

---

## Step 21: Update Documentation

**Objective**: Update project documentation

**Files to Update:**
- `README.md` (if it mentions Vue version)
- Any other docs

**Commit:**
```bash
git add README.md
git commit -m "docs: update documentation for Vue 3"
```

---

## Migration Complete Checklist

- [ ] All steps completed
- [ ] Application works in development
- [ ] Application builds for production
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Ready for merge

---

## Rollback Instructions

If migration needs to be rolled back:

```bash
# Return to master branch
git checkout master

# Or if you want to keep the migration branch for reference
git checkout master
# Migration branch remains as vue3
```

---

## Notes for AI Execution

1. **Execute steps sequentially** - Don't skip steps
2. **Verify each step** - Run verification commands before committing
3. **Commit frequently** - Each step should have its own commit
4. **Document errors** - If a step fails, document the error before proceeding
5. **Test incrementally** - Test after major changes
6. **Ask for help** - If stuck on a step, document the issue and ask

---

## Common Issues and Solutions

### Issue: Application won't start after Step 5
**Solution**: Vuetify 3 requires different setup. Check Step 5 was done correctly.

### Issue: Components not rendering
**Solution**: Check Vuetify component imports in vuetify.js plugin.

### Issue: Router not working
**Solution**: Verify Step 4 was completed correctly, check BASE_URL.

### Issue: $root.loggedIn not accessible
**Solution**: Verify Step 3 globalProperties setup.

---

## Progress Tracking

Use this to track which steps are complete:

- [x] Step 1: Update package.json ✅ COMPLETED
- [x] Step 2: Install dependencies ✅ COMPLETED
- [x] Step 3: Update main.js ✅ COMPLETED
- [x] Step 4: Update router ✅ COMPLETED
- [ ] Step 5: Update Vuetify plugin
- [ ] Step 6: Fix lifecycle hooks
- [ ] Step 7: Replace keyCode
- [ ] Step 8: Replace .sync
- [ ] Step 9: Update button variants
- [ ] Step 10: Update activator slots
- [ ] Step 11: Update breakpoints
- [ ] Step 12: Fix vue-chartjs
- [ ] Step 13: Test startup
- [ ] Step 14: Fix Vuetify issues
- [ ] Step 15: Fix cookie consent
- [ ] Step 16: Run linter
- [ ] Step 17: Manual testing
- [ ] Step 18: Fix remaining issues
- [ ] Step 19: Run E2E tests
- [ ] Step 20: Final verification
- [ ] Step 21: Update docs

---

**End of Runbook**

