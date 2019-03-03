/**
 * 整个项目的入口，包括
 * 使用ui框架，            element-ui
 * 封装项目的ajax             axios
 * 项目 vuex               vuex
 * 操作cookie的js          js-cookie
 * 自己封装的导航类
 * 自己写的 util            Util
 * 自己封装的 全局组件
 * 项目字典                 Dictionary
 *
 */
import Vue from 'vue'
import App from './App'
import store from './store';
import router from './router'
import Cookies from 'js-cookie';
import axios from 'axios';
import Vuex from 'vuex';
import qs from 'qs';

import Element from 'element-ui';
import './styles/element-variables.scss'
// import './styles/element-ui.scss'

// import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.scss';  // global css
import './../src/assets/css/common.css';
import { Loading } from 'element-ui';
import './assets/js/dateFormat.js';
import { Util } from './assets/js/util.js';
import { City } from './assets/js/city.js';
import { Print } from './assets/js/Print.js';
import { baseURL } from './assets/js/uri.js';
import { TopMenn } from './assets/js/common.js';

import lodash from 'lodash'
import VueClipboard from 'vue-clipboard2';
/**
 * 自己封装的组件
 * */

import Echarts from '@/components/chartMap/charts.vue'
import Search from "@/components/Search/index.vue"
import myTable from '@/components/Table/myTable.vue'
import md5 from 'js-md5';
import MutipleTree from '@/components/Tree/MultipleTree'

// 引入ueditor富文本

Vue.config.productionTip = false
Vue.use(Element);
Vue.use(Vuex);
Vue.use(VueClipboard);
Vue.use(lodash);
Vue.prototype.$ajax = axios;
Vue.prototype.$Cookies = Cookies;
Vue.prototype.$Util = Util;
Vue.prototype.$City = City;
Vue.prototype.$Print = Print;
Vue.prototype.$md5 = md5;
Vue.prototype.$baseURL = baseURL;
import * as Regs from '@/assets/js/formReg';
Vue.prototype.$Regs = Regs;
import * as filters from '@/assets/js/filters';
Object.keys(filters).forEach((key) => Vue.filter(key, filters[key]));

Vue.config.keyCodes = {
  enter: 13,
  f1: 112,
  "media-play-pause": 179,
}

let instence = axios.create({
  baseURL: baseURL,
  // timeout: 5000
});
let loading = {};
Vue.prototype.$http = instence;

/**
 * 创建全局拦截器，
 */

instence.interceptors.request.use((config) => {
  if (config[0]) {
    loading = Loading.service({ fullscreen: true, text: '拼命加载中....' })
  }
  //让每个请求携带loginToken
  let token = Cookies.get("token");
  config.headers['optDevice'] = 'PC'
  if (token) {
    config.headers['loginToken'] = token
  }
  return config;
}, function (error) {
  return Promise.reject(error);
});
instence.interceptors.response.use(function (res) {
  if (res.status === 200) {
    if (res.data.code === 300) {
      Cookies.set('loginToken', '');
      Cookies.set('storehouseId', '');
      // 清除缓存
      sessionStorage.clear();
      router.push({ path: "/login" }, () => {
        Cookies.set("code", 300);
        window.location.reload()
      });
    } else {
      Cookies.remove("code");
    }
    if (typeof loading.close == "function") {
      loading.close();
    }
  }
  return res;
}, function (error) {
  return Promise.reject(error);
});
/**
 * 写全局方法ajax方法
 * */
Vue.prototype.$ajaxPost = function (url, data, config, loading) {
  let token = this.$Cookies.get("token");
  if (data instanceof FormData) {
    return this.$http.post(url, data, config);
  }
  return this.$http.post(url, qs.stringify(data), config);
};
Vue.prototype.$ajaxGet = function (url, config, loading) {
  let token = this.$Cookies.get("token");
  let str = '?user_id=' + user_id + '&token=' + token;
  return this.$http.get(url + str, config);
};

/**
 * 自己封装的 全局组件
 * */
Vue.component("Echarts", Echarts)
Vue.component("my-table", myTable);
Vue.component("Search", Search);
Vue.component("MutipleTree", MutipleTree);
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el,{value}) {
    if(value) {
      el.firstElementChild.focus()
    }
  }
})

/**
 * 使用vuex
 * */
var session_menu = JSON.parse(sessionStorage.getItem("dynamicTags"))

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
