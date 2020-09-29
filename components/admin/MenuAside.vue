<template>
    <el-menu
        active-text-color="#225AA4"
        router
        :default-active="$route.path"
        class="admin-chat"
    >
        <el-menu-item index="/admin">
            <i class="el-icon-notebook-2"></i>
            <span>Admin page</span>
        </el-menu-item>
        <el-menu-item index="/admin/create">
            <i class="el-icon-edit-outline"></i>
            <span>Create post</span>
        </el-menu-item>
        <el-menu-item index="/admin/list">
            <i class="el-icon-tickets"></i>
            <span>List of posts</span>
        </el-menu-item>
        <el-menu-item index="/admin/user">
            <i class="el-icon-user"></i>
            <span>Users</span>
        </el-menu-item>
        <el-menu-item index="/admin/logout">
            <i class="el-icon-circle-close"></i>
            <span>Exit</span>
        </el-menu-item>
      <el-submenu index="/admin/chat">
        <template slot="title">
          <i class="el-icon-s-grid"></i>
          <span>Chat management</span>
        </template>
        <el-menu-item-group class="admin-chat__title"  title="Chat rooms">
          <el-menu-item index="/admin/chat/rooms">List of rooms</el-menu-item>
          <el-menu-item index="/admin/chat/room">Room management</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group class="admin-chat__title" title="Chat users">
          <el-menu-item index="/admin/chat/users">Usres in the chat</el-menu-item>
          <el-menu-item index="/admin/chat/user">User management</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group class="admin-chat__title" title="Admin messages">
          <el-menu-item index="/admin/chat/messages">Message management</el-menu-item>
          <el-menu-item index="/admin/chat/message">Admin message</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.admin-chat{
  .el-menu-item.is-active{
    font-weight: bold;
    font-size: 1em;
  }
}
.admin-chat__title{
  .el-menu-item-group__title{
    color: #225AA4;
    margin-left:10%;
    font-size: .9em;
    font-weight: bold;
  }
}
</style>
