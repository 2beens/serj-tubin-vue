/**
 * Unit tests for GymStatsView.vue – bottom nav and theme (mobile/small screens).
 */
import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import GymStatsView from '@/views/GymStatsView.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

function createWrapper() {
  const vuetify = new Vuetify()
  return mount(GymStatsView, {
    localVue,
    vuetify,
    stubs: {
      ExercisesLog: true,
      ExerciseStats: true,
      ExercisesList: true,
    },
  })
}

describe('GymStatsView', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => 'log'),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  it('renders bottom navigation with Log, Stats, List tabs', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('.v-bottom-navigation').exists()).toBe(true)
    expect(wrapper.text()).toMatch(/Log/)
    expect(wrapper.text()).toMatch(/Stats/)
    expect(wrapper.text()).toMatch(/List/)
  })

  it('bottom nav is present and theme is bound via $vuetify', async () => {
    const vuetify = new Vuetify()
    const wrapper = mount(GymStatsView, {
      localVue,
      vuetify,
      stubs: { ExercisesLog: true, ExerciseStats: true, ExercisesList: true },
    })
    const bottomNav = wrapper.find('.v-bottom-navigation')
    expect(bottomNav.exists()).toBe(true)
    expect(wrapper.vm.$vuetify.theme).toBeDefined()
    wrapper.vm.$vuetify.theme.dark = true
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.$vuetify.theme.dark).toBe(true)
  })
})
