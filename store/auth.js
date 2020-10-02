export const state = () => ({
  token: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  },
  clearToken (state) {
    state.token = null
  }
}

export const actions = {
  // Authorize in the system
  async login ({ commit, dispatch }, data) {
    const token = await new Promise((resolve) => {
      setTimeout(() => resolve('test-token'), 2000)
    })
    dispatch('setToken', token)
  },
  setToken ({ commit }, token) {
    commit('setToken', token)
  },
  logout ({ commit }) {
    commit('clearToken')
  }
}

export const getters = {
  isAuthenticated: state => Boolean(state.token)
}
