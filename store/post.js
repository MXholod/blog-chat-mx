export const actions = {
  async adminPosts ({ commit }) {
    return await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([
          {
            _id: Math.random(),
            title: 'Post 1',
            date: new Date(),
            views: 12,
            comments: [1, 2]
          },
          {
            _id: Math.random(),
            title: 'Post 2',
            date: new Date(),
            views: 34,
            comments: [1, 2, 3, 4, 5]
          }
        ])
      }, 3000)
    })
  },
  async deletePost ({ commit }, id) {
  }
}
