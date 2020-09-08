export const state = () => ({
  user: {}
})

export const mutations = {
  addUser (state, user) {
    state.user = user
  }
}

export const actions = {
  SOCKET_newMessage (ctx, data) {
    console.log('Message recieved ', data)
  }
}
