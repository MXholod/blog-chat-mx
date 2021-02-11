export const state = () => ({
  user: {
    login: '',
    role: '',
    jwtToken: '',
    blogBan: false
  }
})

export const mutations = {
  authUser(state, data){
    state.user = data;
  },
  userLogOut(state){
    state.user = {
      login: '',
      role: '',
      jwtToken: ''
    }
  }
}

export const actions = {
  // Authorize in the system
  async login ({ commit, dispatch }, data) {
    try {
      const result = await this.$axios.$post('/api/auth/user/login', data);
      const { jwtToken, login, role, blogBan } = result.details;
      //
      if(blogBan){
        throw new Error('Enter is forbidden');
      }
      commit('authUser', { jwtToken, login, role, blogBan });
    } catch (e) {
      // Commit mutation
      //console.log('Error ', e.response.data.message);
      commit('error/setError', e, {root: true})
      throw e
    }
  },
  logout ({ commit }) {
    commit('userLogOut');
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
  isUserAuthenticated: (state)=>{ return state.user; }
}
