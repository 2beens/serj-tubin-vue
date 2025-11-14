# Vue 2 to Vue 3 Migration Plan

## Executive Summary

**Migration Feasibility: ✅ YES, Migration is Possible**

This project can be migrated from Vue 2.7.14 to Vue 3. The codebase is relatively modern (already using Composition API in some places) and doesn't use many deprecated features. The main challenges will be:
1. Vuetify 2 → Vuetify 3 migration (major breaking changes)
2. Vue Router 3 → Vue Router 4
3. Several code patterns that need updating

**Estimated Complexity: Medium**
**Estimated Time: 2-4 days of focused work**

---

## Current State Analysis

### Dependencies to Upgrade

| Package | Current Version | Target Version | Status |
|---------|----------------|----------------|--------|
| `vue` | ^2.7.14 | ^3.4.0+ | ✅ Required |
| `vue-router` | ^3.6.5 | ^4.2.0+ | ✅ Required |
| `vuetify` | ^2.6.15 | ^3.5.0+ | ⚠️ Major breaking changes |
| `vue-chartjs` | ^5.2.0 | ^5.2.0+ | ✅ Check compatibility |
| `vue-cookieconsent-component` | ^1.2.0 | ? | ⚠️ May need alternative |
| `vue-template-compiler` | ^2.7.14 | ❌ Remove | ✅ Not needed in Vue 3 |
| `@vue/cli-service` | ^5.0.8 | ^5.0.8+ | ✅ Should work (or migrate to Vite) |

### Breaking Changes Found in Codebase

#### 1. Global API Changes
- **Location**: `src/main.js`
- **Issue**: Using `new Vue()`, `Vue.use()`, `Vue.mixin()`, `Vue.config`
- **Impact**: HIGH
- **Files Affected**: 
  - `src/main.js` (lines 8, 10, 62-71)

#### 2. Router API Changes
- **Location**: `src/router/index.js`
- **Issue**: Using `Vue.use(VueRouter)`, `new VueRouter()`, async components with `function()`
- **Impact**: MEDIUM
- **Files Affected**:
  - `src/router/index.js` (lines 1-5, 19-87, 91-95)

#### 3. Vuetify Plugin Changes
- **Location**: `src/plugins/vuetify.js`
- **Issue**: Using `Vue.use(Vuetify)`, Vuetify 2 API
- **Impact**: HIGH
- **Files Affected**:
  - `src/plugins/vuetify.js` (lines 1-21)
  - All components using Vuetify components

#### 4. `.sync` Modifier (Replaced by `v-model`)
- **Impact**: MEDIUM
- **Files Affected**:
  - `src/views/UrlShortenerView.vue` (line 60)
  - `src/components/gymstats/ExercisesLog.vue` (lines 132, 152, 170, 188, 204, 220)
  - `src/components/filebox/FileBox.vue` (line 193)

#### 5. `keyCode` Usage (Removed)
- **Impact**: LOW
- **Files Affected**:
  - `src/views/VisitorBoardView.vue` (line 94)
  - `src/components/LoginLogoutButton.vue` (line 105)

#### 6. Lifecycle Hook Renames
- **Impact**: LOW
- **Files Affected**:
  - `src/components/gymstats/ExercisesLog.vue` (line 402: `beforeDestroy` → `beforeUnmount`)
  - `src/components/BlogsList.vue` (line 221: `beforeDestroy` → `beforeUnmount`)

#### 7. Vuetify 2 → Vuetify 3 Component API Changes
- **Impact**: HIGH
- **Issues**:
  - `v-slot:activator="{ on, attrs }"` syntax changed in Vuetify 3
  - Component prop names changed (e.g., `text` → `variant="text"`)
  - Breakpoint API changes (`$vuetify.breakpoint.smAndDown`)
  - Theme API changes
- **Files Affected**: All components using Vuetify (many files)

#### 8. Async Components
- **Location**: `src/router/index.js`
- **Issue**: Using `component: function() { return import(...) }`
- **Impact**: LOW
- **Solution**: Use `defineAsyncComponent()` or keep arrow functions (both work)

#### 9. `$root` Usage
- **Location**: Multiple files
- **Issue**: Using `this.$root.loggedIn`
- **Impact**: LOW (still works, but consider `provide/inject`)
- **Files Affected**:
  - `src/App.vue` (line 152)
  - `src/components/LoginLogoutButton.vue` (lines 4, 138, 172, 182)

---

## Migration Strategy

### Phase 1: Preparation & Dependency Updates (Day 1)

#### Step 1.1: Create Migration Branch
```bash
git checkout -b vue3-migration
```

#### Step 1.2: Update Core Dependencies
1. Update `package.json`:
   - `vue`: `^2.7.14` → `^3.4.21`
   - `vue-router`: `^3.6.5` → `^4.2.5`
   - `vuetify`: `^2.6.15` → `^3.5.13`
   - Remove `vue-template-compiler` (not needed in Vue 3)

2. Check/Update:
   - `vue-chartjs`: Verify Vue 3 compatibility (may need `^5.2.0` or newer)
   - `vue-cookieconsent-component`: Check for Vue 3 version or find alternative

3. Install dependencies:
   ```bash
   yarn install
   ```

#### Step 1.3: Update Build Tools (Optional but Recommended)
- Consider migrating from Vue CLI to Vite for better performance
- Or ensure Vue CLI 5.x is fully updated

### Phase 2: Core Application Setup (Day 1-2)

#### Step 2.1: Update `src/main.js`
- Replace `new Vue()` with `createApp()`
- Replace `Vue.use()` with `app.use()`
- Replace `Vue.mixin()` with `app.mixin()`
- Replace `Vue.config.productionTip` with removal (not needed)
- Update render function or use template

#### Step 2.2: Update `src/router/index.js`
- Replace `Vue.use(VueRouter)` with `createRouter()`
- Replace `new VueRouter()` with `createRouter()`
- Update `mode: 'history'` to `history: createWebHistory()`
- Convert async components to use `defineAsyncComponent()` (optional, arrow functions work)

#### Step 2.3: Update `src/plugins/vuetify.js`
- Replace `Vue.use(Vuetify)` with Vuetify 3 setup
- Update Vuetify configuration for v3 API
- Update theme configuration

### Phase 3: Component Updates (Day 2-3)

#### Step 3.1: Fix Breaking Changes (Priority Order)

**High Priority:**
1. Replace `.sync` modifiers with `v-model` (8 instances)
2. Update Vuetify component usage:
   - `v-slot:activator` → Vuetify 3 activator syntax
   - `text` prop → `variant="text"`
   - Update breakpoint usage
   - Update theme access

**Medium Priority:**
3. Replace `keyCode` with `event.key` or `event.code` (2 instances)
4. Rename lifecycle hooks: `beforeDestroy` → `beforeUnmount` (2 instances)

**Low Priority:**
5. Consider refactoring `$root.loggedIn` to `provide/inject` pattern (optional)

#### Step 3.2: Update All Vuetify Components
- Review each component using Vuetify
- Update component props and slots
- Test each component individually

### Phase 4: Testing & Validation (Day 3-4)

#### Step 4.1: Run Linter
```bash
yarn lint
```

#### Step 4.2: Manual Testing Checklist
- [ ] Home page loads
- [ ] Navigation works (desktop & mobile)
- [ ] Login/Logout functionality
- [ ] Theme toggle
- [ ] All routes accessible
- [ ] GymStats features
- [ ] FileBox features
- [ ] Notes features
- [ ] URL Shortener
- [ ] Spotify Tracker
- [ ] Netlog
- [ ] Visitor Board
- [ ] Cookie consent dialog

#### Step 4.3: Run E2E Tests
```bash
yarn test:e2e:run
```

#### Step 4.4: Fix Issues
- Address any runtime errors
- Fix broken components
- Update tests if needed

### Phase 5: Cleanup & Optimization (Day 4)

#### Step 5.1: Remove Deprecated Code
- Remove any Vue 2-specific workarounds
- Clean up unused imports

#### Step 5.2: Performance Check
- Verify bundle size
- Check runtime performance
- Optimize if needed

#### Step 5.3: Documentation
- Update README if needed
- Document any breaking changes for future reference

---

## Detailed Code Changes

### 1. `src/main.js` Changes

**Before:**
```javascript
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.mixin({
  methods: { ... }
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

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mixin({
  methods: { ... }
})

// Global state for loggedIn
app.config.globalProperties.$root = {
  loggedIn: false
}

app.mount('#app')
```

### 2. `src/router/index.js` Changes

**Before:**
```javascript
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})
```

**After:**
```javascript
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})
```

### 3. `.sync` to `v-model` Changes

**Before:**
```vue
<v-edit-dialog :return-value.sync="item.exerciseId">
```

**After:**
```vue
<v-edit-dialog v-model:return-value="item.exerciseId">
```

### 4. `keyCode` Changes

**Before:**
```javascript
if (event.keyCode !== 13 || !this.messageInput) {
```

**After:**
```javascript
if (event.key !== 'Enter' || !this.messageInput) {
```

### 5. Lifecycle Hook Changes

**Before:**
```javascript
beforeDestroy() {
  // cleanup
}
```

**After:**
```javascript
beforeUnmount() {
  // cleanup
}
```

### 6. Vuetify 3 Changes

**Activator Slot (Before):**
```vue
<template v-slot:activator="{ on, attrs }">
  <v-btn v-bind="attrs" v-on="on">Click</v-btn>
</template>
```

**Activator Slot (After - Vuetify 3):**
```vue
<template v-slot:activator="{ props }">
  <v-btn v-bind="props">Click</v-btn>
</template>
```

**Button Variant (Before):**
```vue
<v-btn text>Button</v-btn>
```

**Button Variant (After):**
```vue
<v-btn variant="text">Button</v-btn>
```

---

## Risk Assessment

### High Risk Areas
1. **Vuetify Migration**: Most complex part, many components affected
2. **Global State (`$root.loggedIn`)**: May need refactoring to provide/inject
3. **Third-party Components**: `vue-cookieconsent-component` may not have Vue 3 support

### Medium Risk Areas
1. **Chart.js Integration**: Need to verify `vue-chartjs` compatibility
2. **E2E Tests**: May need updates for Vue 3 changes

### Low Risk Areas
1. **Composition API**: Already partially used, should work fine
2. **Router**: Straightforward migration
3. **Most Components**: Standard Vue 3 patterns

---

## Rollback Plan

If migration fails:
1. Keep migration branch for reference
2. Revert to master branch
3. Document issues encountered
4. Consider using Vue 3 compatibility build (`@vue/compat`) for gradual migration

---

## Post-Migration Benefits

1. **Performance**: Vue 3 is faster and has smaller bundle size
2. **Composition API**: Better code organization and reusability
3. **TypeScript**: Better TypeScript support (if you decide to use it)
4. **Future-proof**: Vue 2 EOL was Dec 31, 2023
5. **New Features**: Access to Vue 3 features like Teleport, Fragments, etc.

---

## Questions to Consider

1. **Vue-cookieconsent-component**: Does it support Vue 3? If not, find alternative or fork.
2. **Vue-chartjs**: Verify latest version supports Vue 3.
3. **Vite Migration**: Should we migrate from Vue CLI to Vite during this upgrade?
4. **State Management**: Consider migrating `$root.loggedIn` to Pinia or provide/inject pattern.

---

## Next Steps

Once you approve this plan, we can proceed with:
1. Creating the migration branch
2. Updating dependencies
3. Implementing the changes phase by phase
4. Testing thoroughly
5. Deploying to staging for final validation

---

## References

- [Vue 3 Migration Guide](https://v3-migration.vuejs.org/)
- [Vue 3 Breaking Changes](https://v3-migration.vuejs.org/breaking-changes/)
- [Vuetify 3 Migration Guide](https://v3.vuetifyjs.com/getting-started/migration-guide/)
- [Vue Router 4 Migration Guide](https://router.vuejs.org/guide/migration/)

