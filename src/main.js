// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.config.productionTip = false
import axios from 'axios'
Vue.prototype.$ajax = axios
import qs from 'qs'
Vue.prototype.qs = qs
axios.defaults.withCredentials = true;
Vue.use(ElementUI);
/* eslint-disable no-new */
//路由守卫
router.beforeEach((to, from, next) => {
	let user_infor = localStorage.getItem('user_infor');
	let path = to.path;
	//注册页及找回密码页不需要登录验证
	if(path === '/login') {
		next()
		return
	}
	//路由守卫 获取local 判断用户是否登录 如登录则跳转 如无local  则跳转到登录页
	if(user_infor) {
		//跳转路由改变当前路由的title

		next()
		if(path === '/') {
			next({
				path: '/index'
			})
		} else {
			next()
		}
	} else {
		next({
			path: '/login'
		})
	}
})

new Vue({
	el: '#app',
	router,
	components: {
		App
	},
	template: '<App/>'
})