import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/board',
    name: 'Visitor Board',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(
        /* webpackChunkName: "about" */ '../views/VisitorBoardView.vue'
      )
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
  },
  {
    path: '/util',
    name: 'Util',
    component: function () {
      return import('../views/UtilView.vue')
    },
  },
  {
    path: '/netlog',
    name: 'Netlog',
    component: function () {
      return import('../views/NetlogView.vue')
    },
  },
  {
    path: '/gymstats',
    name: 'GymStats',
    component: function () {
      return import('../views/GymStatsView.vue')
    },
  },
  {
    path: '/notes',
    name: 'Notes',
    component: function () {
      return import('../views/NotesView.vue')
    },
  },
  {
    path: '/url-shortener',
    name: 'URL Shortener',
    component: function () {
      return import('../views/UrlShortenerView.vue')
    },
  },
  {
    path: '/spotify',
    name: 'Spotify Tracker',
    component: function () {
      return import('../views/SpotifyTrackerView.vue')
    },
  },
  {
    path: '/sumup',
    name: 'SumUp Experimentation',
    component: function () {
      return import('../views/SumUpView.vue')
    },
  },
  {
    path: '*',
    component: () =>
      import(/* webpackChunkName: '404' */ '../components/404.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
