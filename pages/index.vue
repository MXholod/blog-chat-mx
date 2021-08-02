<template>
  <el-row type="flex" justify="center">
    <el-col :xs="24" :sm="18" :md="12" :lg="10" :xl="24">
      <blog-post v-for="post in posts" :key="post._id" :post="post" />
    </el-col>
  </el-row>
</template>
<script>
import { mapMutations } from 'vuex';
import BlogPost from '@/components/site/Post'
export default {
  async asyncData({ store, $http }){
    const posts = await store.dispatch('post/displayPosts');
    return { posts };
  },
  components: {
    BlogPost
  },
  head: {
    title: 'Main sport page'
  },
  methods:{
    ...mapMutations('chat',{
      userClearChatDataMethod: 'clearData'
    })
  },
  mounted(){
    const { message } = this.$route.query;
    //If log out keeping in the chat
    if(message === 'loggedOut'){
      this.$message.warning({
        message: 'The user has logged out of the chat and personal account',
        duration: 4000
      });
      //Clear chat state
      this.userClearChatDataMethod();
    }
    //Just site log out
    if(message === 'unauthenticated'){
      this.$message.warning({
        message: 'The user has logged out of the personal account',
        duration: 4000
      });
    }
  }
}
</script>

<style scoped>

</style>
