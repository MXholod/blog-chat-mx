const posts = [
  {
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
  }
]

export const actions = {
  async displayAdminPosts ({ commit }) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(posts)
      }, 3000)
    })
  },
  async editAdminPost ({ commit }, id) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(posts.find(p => p._id === id))
      }, 3000)
    })
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
    try {
      const formD = new FormData()
      // formData.append(name, value)
      formD.append('title', data.title)
      formD.append('text', data.text)
      // formData.append(name, blob, fileName)
      formD.append('image', data.image, data.image.name)
      //
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Data ', data.title, ' ', data.text)
          resolve(data.title)
        }, 3000)
      })
    } catch (e) {
      commit('error/setError', e, { root: true })
      // Block 'catch' will be called in create.vue file
      throw e
    }
  },
  async deleteAdminPost ({ commit }, id) {
  }
}
