// TODO 这里state模块的不规范
var session_menu = JSON.parse(sessionStorage.getItem("dynamicTags"))
const dynamic_tags = {
  state: {
    dynamicTags: session_menu ? session_menu : [],  //  导航标签
    nowTopMenu: "",
    cookies: '',                       //  cookies 的值
  },

  mutations: {
    UPDATE_DYNAMIC_TAGS: (state, view) => {
      state.dynamicTags = view
    },
    ADD_DYNAMIC_TAGS: (state, view) => {
      state.dynamicTags.push({
        name: view.name,
        path: view.path,
      })
    },
    ADD_COOKIES: (state, view) => {
      state.cookies = view.cookies
    },
    ADD_TOP_MENU: (state, view) => {
      state.nowTopMenu = view.nowTopMenu
    },
  },
 
  // TODO actions是做async的啊。。。。
  actions: {
    updateDynamicTags({ commit }, view) {
      commit('UPDATE_DYNAMIC_TAGS', view)
    },
    addDynamicTags({ commit }, view) {
      commit('ADD_DYNAMIC_TAGS', view)
    },
    addCookies({ commit }, view) {
      commit('ADD_COOKIES', view)
    },
    addTopMenu({ commit }, view) {
      commit('ADD_TOP_MENU', view)
    },
  }
}

export default dynamic_tags
