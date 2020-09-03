<template>
  <div>
    <v-app dark>
      <v-layout column justify-center align-center>
        <v-flex xs12 sm8 md6>
          <v-btn @click="message" color="info">
            Message
          </v-btn>
        </v-flex>
      </v-layout>
    </v-app>
    {{ test }}
    <hr>
    <el-button type="success">
      Success
    </el-button>
    <hr>
    <v-app dark>
      <div>
        <v-btn color="success">Success</v-btn>
        <v-btn color="error">Error</v-btn>
        <v-btn color="warning">Warning</v-btn>
        <v-btn color="info">Info</v-btn>
      </div>
    </v-app>
  </div>
</template>
<script>
export default {
  sockets: {
    connect () {
      console.log('socket connected')
    },
    customEmit (data) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  async asyncData ({ $http }) {
    const test = await $http.$get('/api/test')
    return {
      test
    }
  },
  methods: {
    message () {
      // console.log('Ok')
      this.$socket.emit('createMessage', { text: 'From client' })
    }
  }
}
</script>

<style scoped>

</style>
