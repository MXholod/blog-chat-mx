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
  login ({ commit, dispatch }, data) {
    try {
      const { token } = this.$axios.$post('/api/auth/admin/login', data)
      console.log('Token ', token)
      /* eslint-disable */
      dispatch('setToken', token)
    } catch (e) {
      // Commit mutation
      commit('error/setError', e, {root: true})
      throw e
    }
  },
  setToken ({ commit }, token) {
    commit('setToken', token)
  },
  logout ({ commit }) {
    commit('clearToken')
  },
  async userCreation ({ commit }, data) {
    // Request 
    try {
      console.log('User created', data)
    } catch (e) {

    }
  }
}

export const getters = {
  isAuthenticated: state => Boolean(state.token)
}
