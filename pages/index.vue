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
  async asyncData ({ $http }) {
    const test = await $http.$get('/api/test')
    return {
      test
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
