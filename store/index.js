export const state = () => ({
  user: {},
  messages: []
})

export const mutations = {
  addUser (state, user) {
    state.user = user
  },
  clearData (state) {
    state.user = {}
    state.messages = []
  },
  // It will be called automatically by installed package 'vue-socket.io'
  SOCKET_newMessage (state, message) {
    message.avatar = 'https://cdn.vuetifyjs.com/images/lists/1.jpg'
    message.divider = true
    message.inset = true
    state.messages.push(message)
  }
}

/* export const actions = {
  // It will be called automatically by installed package 'vue-socket.io'
  SOCKET_newMessage (ctx, data) {
    console.log('Message recieved ', data)
  }
} */
