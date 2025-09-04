import xcTable from './table.vue'

// 为组件添加 install 方法，用于按需引入
xcTable.install = function(Vue) {
  Vue.component(xcTable.name, xcTable)
}
export default xcTable