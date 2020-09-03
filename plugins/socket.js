import Vue from 'vue'
import VueSocketIO from 'vue-socket.io'

// Get the store Object in the plugin. Plugin as a function to get an Object
export default function ({ store }) {
  // Register new plugin
  Vue.use(new VueSocketIO({
    debug: false,
    connection: 'http://localhost:3001/',
    vuex: {
      store,
      actionPrefix: 'SOCKET_',
      mutationPrefix: 'SOCKET_'
    }
  }))
}
