/**
 * Unit tests for EditExercise.vue – modal receives correct exercise, save/delete.
 */
import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import EditExercise from '@/components/gymstats/EditExercise.vue'

Vue.use(Vuetify)
const localVue = createLocalVue()

const mockExercise = {
  id: 1,
  exerciseId: 'bench_press',
  exerciseName: 'Bench Press',
  muscleGroup: 'chest',
  kilos: 80,
  reps: 8,
  createdAt: '2024-01-15T10:00:00Z',
  metadata: {},
  metadataJson: '{}',
}

function createWrapper(props = {}) {
  const vuetify = new Vuetify()
  return mount(EditExercise, {
    localVue,
    vuetify,
    propsData: {
      value: true,
      exercise: mockExercise,
      ...props,
    },
    mocks: {
      $vuetify: {
        breakpoint: { mdAndUp: true },
        theme: { dark: false },
      },
    },
  })
}

describe('EditExercise', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true,
    })
  })

  it('receives exercise prop and fills form', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.exercise).toEqual(mockExercise)
    expect(wrapper.vm.form.exerciseId).toBe('bench_press')
    expect(wrapper.vm.form.kilos).toBe('80')
    expect(wrapper.vm.form.reps).toBe('8')
    expect(wrapper.vm.form.muscleGroup).toBeDefined()
    expect(wrapper.vm.form.muscleGroup?.id).toBe('chest')
  })

  it('emits save with payload when Save is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    wrapper.vm.form.kilos = '85'
    wrapper.vm.form.reps = '10'
    await wrapper.vm.$nextTick()

    wrapper.vm.onSave()
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('save')).toBeTruthy()
    expect(wrapper.emitted('save').length).toBe(1)
    const payload = wrapper.emitted('save')[0][0]
    expect(payload.id).toBe(1)
    expect(payload.exerciseId).toBe('bench_press')
    expect(payload.kilos).toBe(85)
    expect(payload.reps).toBe(10)
    expect(wrapper.emitted('input')).toBeTruthy()
    expect(wrapper.emitted('input')[0][0]).toBe(false)
  })

  it('emits delete with exercise when Delete is clicked', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    const deleteBtn = wrapper
      .findAll('button')
      .wrappers.find((b) => b.text().includes('Delete'))
    expect(deleteBtn).toBeDefined()
    deleteBtn.trigger('click')
    await wrapper.vm.$nextTick()

    expect(wrapper.emitted('delete')).toBeTruthy()
    expect(wrapper.emitted('delete').length).toBe(1)
    expect(wrapper.emitted('delete')[0][0]).toEqual(mockExercise)
  })

  it('saveDisabled is true when form is invalid', async () => {
    const wrapper = createWrapper()
    await wrapper.vm.$nextTick()

    wrapper.vm.form.kilos = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.saveDisabled).toBe(true)

    wrapper.vm.form.kilos = '80'
    wrapper.vm.form.reps = ''
    await wrapper.vm.$nextTick()
    expect(wrapper.vm.saveDisabled).toBe(true)
  })
})
