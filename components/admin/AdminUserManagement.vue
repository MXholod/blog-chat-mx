<template>
  <el-tabs type="card" @tab-click="handleClick">
    <el-tab-pane label="List of users">List of users</el-tab-pane>
    <el-tab-pane label="Create user">
      <h3>Create user</h3>
      <admin-user-create />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AdminUserCreate from './admin_user_management/AdminUserCreate'
export default {
  props: {
    isAdmin: Boolean
  },
  components: { AdminUserCreate },
  data () {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick (tab, event) {
      console.log(tab, event)
    }
  }
  /* mounted () { // This method is only called on the client side
    // Get query parameter 'message'
    const { message } = this.$route.query
    if (message === 'unauthenticated') {
      // Call element-ui method 'error'
      this.$message({
        showClose: true,
        message: 'You must first login',
        type: 'error'
      })
    }
  } */
}
</script>

<style lang="scss" scoped>
</style>
