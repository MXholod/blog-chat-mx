export const state = () => ({
  comments: []
});

export const actions = {
  async create({ commit }, data){
    try{
      const result = await this.$axios.post('/api/comment', data);
      if(result.data && result.data.comment){
        return result.data.comment;
      }
      throw new Error("The comment hasn't been added");
    }catch(e){
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  }
};
