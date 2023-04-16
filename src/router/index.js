import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/board',
    name: 'Visitor Board',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/VisitorBoardView.vue')
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  },
  {
    path: '/util',
    name: 'Util',
    component: function () {
      return import('../views/UtilView.vue')
    }
  },
  {
    path: '/netlog',
    name: 'Netlog',
    component: function () {
      return import('../views/NetlogView.vue')
    }
  },
  {
    path: '/notes',
    name: 'Notes',
    component: function () {
      return import('../views/NotesView.vue')
    }
  },
  {
    path: '/url-shortener',
    name: 'URL Shortener',
    component: function () {
      return import('../views/UrlShortenerView.vue')
    }
  },
  {
    path: '/sumup',
    name: 'SumUp Experimentation',
    component: function () {
      return import('../views/SumUpView.vue')
    }
  },
  {
    path: '*',
    component: () =>
      import(/* webpackChunkName: '404' */ '../components/404.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
