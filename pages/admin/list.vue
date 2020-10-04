<template>
  <el-table
    :data="posts"
    style="width: 100%">
    <el-table-column
      prop="title"
      label="Post name"
    >
    </el-table-column>
    <el-table-column
      label="Date"
      width="180">
      <template slot-scope="{row: {date}}">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ new Date(date).toLocaleDateString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Amount of views">
      <template slot-scope="{row: {views}}">
        <i class="el-icon-view"></i>
        <span style="margin-left: 10px">{{ views }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Comments">
      <template slot-scope="{row: {comments}}">
        <i class="el-icon-chat-line-square"></i>
        <span style="margin-left: 10px">{{ comments.length }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Actions">
      <template slot-scope="{row}">
        <el-button
          size="mini"
          @click="editPost(row._id)">
          Edit post
        </el-button>
        <el-tooltip class="item" effect="dark" content="Delete post" placement="top">
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
            @click="removePost(row._id)" />
        </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['admin-auth'],
  async asyncData ({ store }) {
    const posts = await store.dispatch('post/adminPosts')
    // It will be merged with 'data' if 'data' is present
    return { posts }
  },
  methods: {
    editPost (id) {
      // console.log('Edit post id ', id)
      this.$router.push(`/admin/post/${id}`)
    },
    // this method is 'async' because of $confirm().then().catch()
    // returns Promise() and that's why we may use 'async' instead of Promise()
    async removePost (id) {
      try {
        // console.log('Remove post id ', id)
        await this.$confirm('Would you like to delete the post?', 'Warning!', {
          confirmButtonText: 'Delete',
          cancelButtontext: 'Canceling',
          type: 'warning'
        })
        // Delete a post from the store
        // await this.store.dispatch('post/deletePost', id)
        // Delete post localy
        this.posts = this.posts.filter(p => p._id !== id)
        this.$message.success('The post has been deleted')
      } catch (e) {

      }
    }
  }
}
</script>
