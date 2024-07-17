import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store/index'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'authen',
    component: () => import('../views/Authen.vue'),
  },
  {
    path: '',
    name: 'toolbar',
    component: () => import('../components/Shared/Toolbar.vue'),
    children: [
      {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue'),
      },
      {
        path: '/store',
        name: 'store',
        component: () => import('../views/Product/Store.vue'),
      },
      {
        path: '/orders',
        name: 'orders',
        component: () => import('../views/Order.vue'),
      },
      {
        path: '/cart',
        name: 'cart',
        component: () => import('../views/Product/Cart.vue'),
      },
      {
        path: '/approval',
        name: 'approval',
        component: () => import('../views/Approval.vue'),
      },
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const auth = store.getters["auth"];
  const user = store.getters["user"];
  if (auth && user) {
    next();
  } else if (to.path !== '/') {
    next('/');
  } else {
    next();
  }
})

export default router
