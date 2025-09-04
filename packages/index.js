import xcTable from './table/table.vue'

// 把组件保存到一个数组中,可有多个
const components = [
  xcTable
]

// 定义 install 方法，接收 Vue 作为参数。如果使用 use 注册插件，那么所有的组件都会被注册
const install = function (Vue) {
  if (install.installed) return
  install.installed = true
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  // 导出的对象必须具备一个 install 方法，才能被 Vue.use() 方法安装
  install,
  // 组件列表
  ...components
}