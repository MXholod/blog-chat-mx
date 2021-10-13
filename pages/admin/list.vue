<template>
  <el-table
    :data="posts"
    style="width: 100%">
    <el-table-column
      prop="title"
      label="Post name"
      min-width="150"
    >
    </el-table-column>
    <el-table-column
      label="User name"
      min-width="100"
      align="center">
      <template slot-scope="{row: {user}}">
        <span style="margin-left: 5px">{{ user.name }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="User role"
      min-width="100"
      align="center">
      <template slot-scope="{row: {user}}">
        <span style="margin-left: 5px">{{ user.role }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="Date"
      min-width="130"
      align="center">
      <template slot-scope="{row: {date}}">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ new Date(date).toLocaleDateString() }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Amount of views" min-width="140" align="center">
      <template slot-scope="{row: {views}}">
        <i class="el-icon-view"></i>
        <span style="margin-left: 10px">{{ views }}</span>
      </template>
    </el-table-column>
    <el-table-column label="Comments" min-width="140" align="center">
      <template slot-scope="{row: {comments}}">
        <i class="el-icon-chat-line-square"></i>
        <span style="margin-left: 10px">{{ comments.length }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="role === 'admin'"
      label="Actions"
      width="160"
      align="center">
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
  async asyncData (context) {
    let jwt = context.store.getters['auth/isUserAuthenticated'].jwtToken;
    //'$isAllowedByRole' is a function from Plugin
    let userData = await context.app.$isAllowedByRole(jwt);
    if(userData.role === 'guest'){
      context.redirect('/cabinet');
    }
    if(userData.role === '' && !userData.sessionEnd){
      if(context.store.getters['auth/isUserAuthenticated'].role !== ''){
        context.store.dispatch('auth/logout');
      }
      context.redirect('/');
    }
    let posts = [];
    //If we have role: 'admin' or 'moderator'
    if(userData.role && !userData.sessionEnd){
      posts = await context.store.dispatch('post/displayAdminPosts')
    }
    // It will be merged with 'data' if 'data' is present
    return {
      posts,
      userLogoutRefresh: userData.sessionEnd ? true : false,
      role: userData.role
    }
  },
  methods: {
    editPost (id) {
      // console.log('Edit post id ', id)
      this.$router.push(`/admin/post/${id}`)
    },
    // This method is 'async' because of $confirm().then().catch()
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
        const postDeletedId = await this.$store.dispatch('post/deleteAdminPost', id);
        if(postDeletedId){
          //Leave in 'posts' all posts except deleted once
          this.posts = this.posts.filter( post => post._id !== postDeletedId);
          this.$message.success('The post has been deleted');
        }else{
          throw new Error("Something went wrong");
        }
      } catch (e) {
        this.$message({
          showClose: true,
          message: e.message,
          type: 'error'
        });
      }
    }
  },
  mounted(){
    //Displaying the modal window to inform user about the end of the session
    if(this.userLogoutRefresh){
      this.$alert('Your session is up!', 'Session state', {
        confirmButtonText: 'Sign in again',
        showClose:false,
        callback: action => {
          this.$store.dispatch('auth/logout');
          this.$router.push('/login?message=unauthenticated');
        }
      });
    }
  }
}
</script>
