// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'             // 导入vue实例
import App from './App'           // 导入 App 组件
import VueRouter from 'vue-router'// 导入 vue router
import Home from './pages/Home'
import Wave from './pages/Wave'
import Contour from './pages/Contour'
import '../node_modules/jquery/dist/jquery.min.js'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import '../node_modules/bootstrap/dist/js/bootstrap.min.js'


Vue.use(VueRouter)                // 告诉vue使用vue-router路由组件

// 路由表
const routes = [
  {path: '/', component: Home},
  {path: '/wave', component: Wave},
  {path: '/contour', component: Contour},
]        

// 创建路由器实例，并且传入`routes`变量作为路由。
// 还可传别的参数，这里尽量简化
const router = new VueRouter({
  routes,
  mode: 'history'
})

// 实例化Vue实例
new Vue({
  el: '#app',           // 定义Vue绑定的根元素
  template: '<App/>',   // 用<App/>代替根元素
  components: { App },  // 声明App组件，这样上面的<App/>元素就可以生效
  router                // 将上面声明的路由器传递到根Vue实例
}).$mount('#app')       // 将这个实例挂载到id=app的根元素上