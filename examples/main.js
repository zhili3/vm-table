import Vue from 'vue'
import App from './App.vue'
// import xcUi from '../packages'
import xcUi from '../lib/vm-table.umd.js'
import router from './router'
import './style.css'

// 注册组件库
Vue.use(xcUi)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
