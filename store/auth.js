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
  },
  setActiveToken(state, activeToken){
    state.user.jwtToken = activeToken;
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
      //Only client side rendering
      //this.$axios.setToken(jwtToken, 'Bearer');
      commit('authUser', { jwtToken, login, role, blogBan });
    } catch (e) {
      // Commit mutation
      //console.log('Error ', e.response.data.message);
      commit('error/setError', e, {root: true})
      throw e
    }
  },
  logout ({ commit }) {
    //Only client side rendering
    //this.$axios.setToken(false);
    commit('userLogOut');
  },
  async refreshToken({ commit }){
    //An Active token has gotten and Refresh token has regenerated
    const res = await this.$axios.$post('/api/auth/user/refresh');
    if(res){
      commit('setActiveToken', res.details.jwtToken);
    }else{
      //Refresh is expired
      commit('error/setError','You should sign in',{root: true});
    }
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
