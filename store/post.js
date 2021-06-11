const posts = [
  /*{
    _id: 'id-1',
    title: 'Post 1',
    date: new Date(),
    views: 12,
    comments: [1, 2]
  },
  {
    _id: 'id-2',
    title: 'Post 2',
    date: new Date(),
    views: 34,
    comments: [1, 2, 3, 4, 5]
  }*/
]

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
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve('Post updated')
        // console.log('Data ', data.id, ' ', data.text)
      }, 3000)
    })
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
  async deleteAdminPost ({ commit }, id) {
  }
}
