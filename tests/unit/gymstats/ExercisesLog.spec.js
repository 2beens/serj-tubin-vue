/**
 * Unit tests for ExercisesLog.vue – mobile/small-screen behavior.
 * - List view when showTable is false (no table, no multi-select).
 * - Long-press opens edit modal and suppresses follow-up context menu.
 * - Theme binding for list (optional).
 */
import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import ExercisesLog from '@/components/gymstats/ExercisesLog.vue'
import axios from 'axios'

Vue.use(Vuetify)
const localVue = createLocalVue()

jest.mock('axios')

const mockExercises = [
  {
    id: 1,
    exerciseId: 'bench_press',
    exerciseName: 'Bench Press',
    muscleGroup: 'chest',
    kilos: 80,
    reps: 8,
    createdAt: '2024-01-15T10:00:00Z',
    metadata: {},
    metadataJson: '{}',
    isTesting: 'no',
  },
  {
    id: 2,
    exerciseId: 'squat',
    exerciseName: 'Squat',
    muscleGroup: 'legs',
    kilos: 100,
    reps: 5,
    createdAt: '2024-01-14T09:00:00Z',
    metadata: {},
    metadataJson: '{}',
    isTesting: 'no',
  },
]

function createWrapper(options = {}) {
  const vuetify = new Vuetify()
  return mount(ExercisesLog, {
    localVue,
    vuetify,
    mocks: {
      $vuetify: {
        breakpoint: { smAndDown: true, mdAndUp: false },
        theme: { dark: false },
      },
      $root: { loggedIn: true },
      getCookie: () => 'fake-session-token',
    },
    stubs: {
      AddExercise: true,
    },
    ...options,
  })
}

describe('ExercisesLog (mobile/small screens)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    axios.get.mockResolvedValue({
      data: { exercises: mockExercises, total: 2 },
    })
    // localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  describe('list view when showTable is false', () => {
    it('renders list (v-list) and does not use multi-select (no v-list-item-group)', async () => {
      const wrapper = createWrapper()
      await wrapper.vm.$nextTick()
      wrapper.setData({
        showTable: false,
        loadingData: false,
        stats: mockExercises,
        paginationLen: 1,
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.find('table').exists()).toBe(false)
      expect(wrapper.find('.v-data-table').exists()).toBe(false)
      const list = wrapper.find('.v-list')
      expect(list.exists()).toBe(true)
      expect(wrapper.find('.v-list-item-group').exists()).toBe(false)
      const items = wrapper.findAll('.v-list-item')
      expect(items.length).toBeGreaterThanOrEqual(2)
    })

    it('list shows exercise names and theme class follows theme.dark', async () => {
      const wrapper = createWrapper()
      wrapper.setData({
        showTable: false,
        loadingData: false,
        stats: mockExercises,
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.text()).toMatch(/Bench Press/)
      expect(wrapper.text()).toMatch(/Squat/)
      const listContainer = wrapper.find('.exercises-log-list')
      expect(listContainer.exists()).toBe(true)
      expect(listContainer.classes()).toContain('theme--light')
    })

    it('list uses dark theme class when $vuetify.theme.dark is true', async () => {
      const vuetify = new Vuetify()
      const wrapper = mount(ExercisesLog, {
        localVue,
        vuetify,
        mocks: {
          $root: { loggedIn: true },
          getCookie: () => 'fake-session-token',
        },
        stubs: { AddExercise: true },
      })
      wrapper.setData({
        showTable: false,
        loadingData: false,
        stats: mockExercises,
      })
      wrapper.vm.$vuetify.theme.dark = true
      await wrapper.vm.$nextTick()

      const listContainer = wrapper.find('.exercises-log-list')
      expect(listContainer.exists()).toBe(true)
      expect(listContainer.classes()).toContain('theme--dark')
    })
  })

  describe('long-press opens edit modal', () => {
    it('long-press (touchstart then 500ms then touchend) opens edit modal with correct exercise', async () => {
      jest.useFakeTimers()
      const wrapper = createWrapper()
      wrapper.setData({
        showTable: false,
        loadingData: false,
        stats: mockExercises,
      })
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.editDialogVisible).toBe(false)
      expect(wrapper.vm.exerciseToEdit).toBeNull()

      const firstItem = wrapper.findAll('.v-list-item').at(0)
      firstItem.trigger('touchstart', { touches: [{}] })
      jest.advanceTimersByTime(500)
      firstItem.trigger('touchend')

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.editDialogVisible).toBe(true)
      expect(wrapper.vm.exerciseToEdit).not.toBeNull()
      expect(wrapper.vm.exerciseToEdit.id).toBe(1)
      expect(wrapper.vm.exerciseToEdit.exerciseName).toBe('Bench Press')

      jest.useRealTimers()
    })

    it('touchend after long-press calls preventDefault to suppress follow-up context menu', async () => {
      jest.useFakeTimers()
      const wrapper = createWrapper()
      wrapper.setData({
        showTable: false,
        loadingData: false,
        stats: mockExercises,
      })
      await wrapper.vm.$nextTick()

      const firstItem = wrapper.findAll('.v-list-item').at(0)
      firstItem.trigger('touchstart', { touches: [{}] })
      jest.advanceTimersByTime(500)

      const preventDefault = jest.fn()
      const stopPropagation = jest.fn()
      wrapper.vm.onListTouchEnd({ preventDefault, stopPropagation })
      expect(preventDefault).toHaveBeenCalled()
      expect(stopPropagation).toHaveBeenCalled()

      jest.useRealTimers()
    })

    it('short touch (touchend before 500ms) does not open edit modal', async () => {
      jest.useFakeTimers()
      const wrapper = createWrapper()
      wrapper.setData({
        showTable: false,
        loadingData: false,
        stats: mockExercises,
      })
      await wrapper.vm.$nextTick()

      const firstItem = wrapper.findAll('.v-list-item').at(0)
      firstItem.trigger('touchstart', { touches: [{}] })
      jest.advanceTimersByTime(200)
      firstItem.trigger('touchend')
      await wrapper.vm.$nextTick()

      expect(wrapper.vm.editDialogVisible).toBe(false)
      expect(wrapper.vm.exerciseToEdit).toBeNull()

      jest.useRealTimers()
    })
  })

  describe('Edit modal integration', () => {
    it('EditExercise component receives correct exercise when modal is open', async () => {
      const wrapper = createWrapper()
      wrapper.setData({
        showTable: false,
        loadingData: false,
        stats: mockExercises,
        editDialogVisible: true,
        exerciseToEdit: mockExercises[0],
      })
      await wrapper.vm.$nextTick()

      const editExercise = wrapper.findComponent({ name: 'EditExercise' })
      expect(editExercise.exists()).toBe(true)
      expect(editExercise.props('exercise')).toEqual(mockExercises[0])
      expect(editExercise.props('value')).toBe(true)
    })
  })
})
