export const state = () => ({
  posts: []
})

export const actions = {
  async displayAdminPosts ({ commit }) {
    try{
      const result = await this.$axios.get('/api/post/admin/posts');
      //console.log(result.data);
      if(result.data){
        const { message, posts } = result.data;
        return posts;
      }
      return [];
    }catch(e){
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  },
  async createAdminPost ({ commit }, data) {
    const formData = new FormData();
      // formData.append(name, value)
      formData.append('title', data.title);
      formData.append('text', data.text);
      // formData.append(name, blob, fileName)
      formData.append('imagePost', data.image, data.image.name);
    try {
      //Create Post with FormData()
      const result = await this.$axios.$post('/api/post/admin/create', formData);
      if(!result.message){
        throw new Error("Post hasn't created");
      }
    } catch (e) {
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  },
  async editAdminPost ({ commit }, id) {
    try{
      const result = await this.$axios.get(`/api/post/admin/post/${id}`);
      if(result.data){
        return result.data.post;
      }
    }catch(e){
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  },
  async updateAdminPost ({ commit }, data) {
    const formData = new FormData();
    const { id, imageUrl, singleImage, ...rest } = data;//rest - title, text
    //If new Image is uploaded the previous one will be replaced
    if(singleImage){
      formData.append('imagePostToDelete', imageUrl);
      formData.append('singleImage', singleImage);
    }else{//Leave an old Post image without changes
      formData.append('imagePostToDelete', '');
      formData.append('singleImage', '');
    }
    formData.append('postData', JSON.stringify(rest));
    try{
      const result = await this.$axios.put(`/api/post/admin/post/${id}`, formData);
      if(result.data && result.data.postUpdated){
        return result.data.postUpdated;
      }
    }catch(e){
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  },
  async deleteAdminPost ({ commit }, id) {
    try{
      const result = await this.$axios.delete(`/api/post/admin/post/${id}`);
      if(result.data && result.data.postId){
        return result.data.postId;
      }
    }catch(e){
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  },
  //Public actions
  async displayPosts({ commit }){
    try{
      const result = await this.$axios.get('/api/post');
      if(result.data && result.data.posts){
        return result.data.posts;
      }
    }catch(e){
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  }
}
