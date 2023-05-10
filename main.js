import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import uView from 'uview-ui'
import store from '@/store'
Vue.prototype.$store = store
Vue.use(uView)
Vue.config.productionTip = false;
App.mpType = 'app';
let vuexStore = require("@/store/$u.mixin.js");
Vue.mixin(vuexStore);
const app = new Vue({
	...App
})
import http from '@/common/getApi/request.js'
Vue.prototype.$http = http;
// http接口API集中管理引入部分
import httpApi from '@/common/getApi/api.js'
Vue.use(httpApi, app)
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif
