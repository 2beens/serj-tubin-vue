/**
 * AddExercise type refresh: page load must not fan out a percentages
 * request per muscle group. Percentages load for the open dialog's group.
 */
import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import axios from 'axios'
import AddExercise from '@/components/gymstats/AddExercise.vue'

jest.mock('axios')

Vue.use(Vuetify)
const localVue = createLocalVue()

const types = [
  {
    exerciseId: 'press_dumbell_seated',
    name: 'Press',
    muscleGroup: 'shoulders',
  },
  { exerciseId: 'pull_up', name: 'Pull Up', muscleGroup: 'back' },
]

const percentages = {
  shoulders: {
    press_dumbell_seated: { exerciseName: 'Press', percentage: 40 },
  },
  back: {
    pull_up: { exerciseName: 'Pull Up', percentage: 25 },
  },
}

let store

function urls() {
  return axios.get.mock.calls.map((call) => call[0])
}

function percentageUrls() {
  return urls().filter((url) => url.includes('/percentages'))
}

async function flush() {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0))
  }
}

function createWrapper() {
  const vuetify = new Vuetify()
  return mount(AddExercise, {
    localVue,
    vuetify,
    mocks: {
      $vuetify: {
        breakpoint: { mdAndUp: true, smAndDown: false },
        theme: { dark: false },
      },
      getCookie: () => 'token',
    },
  })
}

describe('AddExercise type refresh', () => {
  beforeEach(() => {
    store = {}
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn((key) =>
          Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null
        ),
        setItem: jest.fn((key, value) => {
          store[key] = value
        }),
        removeItem: jest.fn((key) => {
          delete store[key]
        }),
      },
      writable: true,
    })
    axios.get.mockReset()
    axios.get.mockImplementation((url) => {
      const group = url.match(/group\/([^/]+)\/percentages/)
      if (group) {
        return Promise.resolve({ data: percentages[group[1]] || {} })
      }
      if (url.includes('/gymstats/types')) {
        return Promise.resolve({ data: types })
      }
      return Promise.reject(new Error(`unexpected ${url}`))
    })
  })

  it('loads types on mount and does not request percentages', async () => {
    const wrapper = createWrapper()
    await flush()

    expect(
      urls().filter((url) => url.includes('/gymstats/types'))
    ).toHaveLength(1)
    expect(percentageUrls()).toEqual([])
    expect(wrapper.vm.muscleGroupToExercises.shoulders[0].exerciseId).toBe(
      'press_dumbell_seated'
    )
    expect(wrapper.vm.showSnackbar).toBe(false)
  })

  it('keeps cached types when a silent refresh fails', async () => {
    store.exerciseTypes = JSON.stringify({
      shoulders: [
        {
          exerciseId: 'custom_press',
          name: 'Custom Press',
          muscleGroup: 'shoulders',
        },
      ],
    })
    axios.get.mockRejectedValue(new Error('network down'))
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = createWrapper()
    await flush()
    errorSpy.mockRestore()

    expect(wrapper.vm.muscleGroupToExercises.shoulders[0].exerciseId).toBe(
      'custom_press'
    )
    expect(wrapper.vm.showSnackbar).toBe(false)
    expect(percentageUrls()).toEqual([])
  })

  it('loads percentages for the selected group when the dialog opens', async () => {
    store.lastAddedExercise = JSON.stringify({
      muscleGroup: { id: 'shoulders', name: 'Shoulders' },
      exerciseId: 'press_dumbell_seated',
      kilos: '20',
      reps: '10',
      metadataJson: '{}',
    })
    const wrapper = createWrapper()
    await flush()
    axios.get.mockClear()

    wrapper.vm.showDialog = true
    await flush()

    expect(percentageUrls()).toEqual([
      expect.stringContaining('/gymstats/group/shoulders/percentages'),
    ])
    expect(wrapper.vm.muscleGroupToExercises.shoulders[0].name).toBe(
      'Press (40.00%)'
    )
    expect(wrapper.vm.muscleGroupToExercises.back[0].percentage).toBeUndefined()
  })

  it('fetches a newly selected group once and does not refetch it', async () => {
    store.lastAddedExercise = JSON.stringify({
      muscleGroup: { id: 'shoulders', name: 'Shoulders' },
      exerciseId: 'press_dumbell_seated',
      kilos: '20',
      reps: '10',
      metadataJson: '{}',
    })
    const wrapper = createWrapper()
    await flush()
    wrapper.vm.showDialog = true
    await flush()
    axios.get.mockClear()

    wrapper.vm.exercise.muscleGroup = { id: 'back', name: 'Back' }
    await flush()
    wrapper.vm.exercise.muscleGroup = { id: 'shoulders', name: 'Shoulders' }
    await flush()

    expect(percentageUrls()).toEqual([
      expect.stringContaining('/gymstats/group/back/percentages'),
    ])
    expect(wrapper.vm.muscleGroupToExercises.back[0].name).toBe(
      'Pull Up (25.00%)'
    )
  })
})
