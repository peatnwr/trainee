import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    auth: false,
    user: {},
    carts: [],
  },
  getters: {
    token: (state) => state.token,
    auth: (state) => state.auth,
    user: (state) => state.user,
    carts: (state) => state.carts,
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_AUTH(state, payload) {
      state.auth = payload;
    },
    SET_USER(state, payload) {
      state.user = payload;
    },
    CLEAR_CARTS(state, payload) {
      state.carts = payload;
    },
    SET_CARTS(state, payload) {
      state.carts.push(payload);
    },
    REMOVE_FROM_CARTS(state, payload) {
      state.carts = state.carts.filter(item => !payload.includes(item));
    },
  },
  actions: {
    resetUser({ commit }) {
      commit("SET_TOKEN", null);
      commit("SET_AUTH", false);
      commit("SET_USER", {});
      commit("CLEAR_CARTS", []);
    },
    updateCarts({ commit }, carts) {
      commit('SET_CARTS', carts);
    },
    removeItemCarts({ commit }, item) {
      commit('REMOVE_FROM_CARTS', item)
    },
  },
})
