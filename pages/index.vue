<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :xs="24" :sm="18" :md="12" :lg="10">
        <blog-post
          v-for="post in 3"
          :key="post" />
      </el-col>
    </el-row>
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
import BlogPost from '@/components/site/Post'
export default {
  components: {
    BlogPost
  },
  head: {
    title: 'Main sport page'
  },
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
