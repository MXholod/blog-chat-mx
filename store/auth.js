export const state = () => ({
  token: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
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
  }
}

export const getters = {
  isAuthenticated: state => Boolean(state.token)
}
