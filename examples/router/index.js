import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// import Home from '../pages/home.vue';
// import baseTable from '../pages/baseTable.vue';
import proTable from '../pages/proTable.vue';
// import changeTitle from '../pages/changeTitle.vue';

const routes = [
  {
      path: '/',
      redirect: '/proTable'
  },
  // {
  //     name: 'ranking',
  //     path: '/ranking',
  //     component: ranking
  // },
  // {
  //     name: 'home',
  //     path: '/home',
  //     component: Home
  // },
  // {
  //     name: 'baseTable',
  //     path: '/baseTable',
  //     component: baseTable
  // },
  {
      name: 'proTable',
      path: '/proTable',
      component: proTable
  },
  // {
  //     name: 'changeTitle',
  //     path: '/changeTitle',
  //     component: changeTitle
  // },
]


const router = new VueRouter({
  mode:'history',
  routes,
})


export default router
