<template>
  <el-row type="flex" justify="center">
    <el-col :xs="24" :sm="18" :md="12" :lg="10" :xl="24">
      <blog-post v-for="post in posts" :key="post._id" :post="post" />
    </el-col>
  </el-row>
</template>
<script>
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
  }
}
</script>

<style scoped>

</style>
