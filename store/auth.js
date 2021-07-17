export const state = () => ({
  user: {
    login: '',
    role: '',
    jwtToken: '',
    blogBan: false,
    chatBan: false
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
      jwtToken: '',
      blogBan: false,
      chatBan: false
    }
  },
  setActiveToken(state, activeToken){
    state.user.jwtToken = activeToken;
  },
  updateUserLogin(state,login){
    state.user.login = login;
  },
  updateUserJwtToken(state,jwtToken){
    state.user.jwtToken = jwtToken;
  },
  updateChatBan(state, stateBan){
    state.user.chatBan = stateBan;
  }
}

export const actions = {
  // Authorize in the system
  async login ({ commit, dispatch }, data) {
    try {
      const result = await this.$axios.$post('/api/auth/user/login', data);
      if(result && result.details){
        const { jwtToken, login, role, blogBan } = result.details;
        //
        if(blogBan){
          throw new Error('Enter is forbidden');
        }
        //Only client side rendering
        //this.$axios.setToken(jwtToken, 'Bearer');
        commit('authUser', { jwtToken, login, role, blogBan });
      }else{//If not 'result.details'
        throw new Error(result.msg);
      }
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
  /*
  // Call it from Nuxt plugin
  async refreshToken({ commit }){
    //An Active token has gotten and Refresh token has regenerated
    const res = await this.$axios.$post('/api/auth/user/refresh');
    if(res){
      commit('setActiveToken', res.details.jwtToken);
    }else{
      //Refresh is expired
      commit('error/setError','You should sign in',{root: true});
    }
  },*/
  async updateUserLogin({ commit }, data){
    try{
      //Update user name (Login)
      const response = await this.$axios.put('/api/cabinet/user-name',data);
      //Checking out the axios response
      if((response.status === 200) && response.data.userName){
        commit('updateUserLogin',response.data.userName);
      }else{
        throw new Error('Your login has not changed');
      }
    }catch(e){
      // Commit mutation, 'e' - axios is an object error
      commit('error/setError', e, {root: true});
      throw e;
    }
  }
}

export const getters = {
  isUserAuthenticated: (state)=>{ return state.user; }
}
