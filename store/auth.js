export const state = () => ({
  token: null,
  testDataUser: null
})

export const mutations = {
  setToken (state, token) {
    state.token = token
  },
  clearToken (state) {
    state.token = null
  },
  testSetDataUser (state, dataUser) {
    state.testDataUser = dataUser
  }
}

export const actions = {
  // Authorize in the system
  login ({ commit, dispatch }, data) {
    try {
      // const { token } = this.$axios.$post('/api/auth/admin/login', data)
      const token = 'token-test'
      commit('testSetDataUser', data)
      // console.log('Token ', token)
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
      await this.$axios.$post('/api/auth/admin/create', data)
      // console.log('User created', data)
    } catch (e) {
      // Commit mutation, 'e' - axios is an object error
      commit('error/setError', e, {root: true})
      throw e
    }
  }
}

export const getters = {
  isAuthenticated: state => Boolean(state.token)
}
