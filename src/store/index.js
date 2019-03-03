import Vue from 'vue'
import Vuex from 'vuex';
import dynamic_tags from './modules/dynamic_tags'
import getters from './getters'
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    dynamic_tags
  },
  getters
});
export default store
