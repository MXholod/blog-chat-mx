<template>
    <el-menu
        active-text-color="#225AA4"
        router
        :default-active="$route.path"
        class="admin-menu"
    >
        <el-menu-item index="/admin">
            <i class="el-icon-notebook-2"></i>
            <span>Admin page</span>
        </el-menu-item>
        <el-menu-item index="/admin/pages">
            <i class="el-icon-document-copy"></i>
            <span>Page management</span>
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
      <el-submenu index="/admin/chat" class="admin-chat">
        <template slot="title">
          <i class="el-icon-s-grid"></i>
          <span class="admin-chat__header">Chat management</span>
        </template>
        <el-menu-item-group class="admin-chat__title"  title="Chat rooms">
          <el-menu-item index="/admin/chat/rooms">List of rooms</el-menu-item>
          <el-menu-item index="/admin/chat/room">Creating a chat room</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group class="admin-chat__title" title="Admin messages">
          <el-menu-item index="/admin/chat/messages">Message management</el-menu-item>
          <el-menu-item index="/admin/chat/message">System message to chat</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.admin-menu{
  .el-menu-item.is-active{
    font-weight: bold;
    font-size: 1em;
  }
}
.admin-chat{
  $color: #225aa4;
  background-color: $color;
  border-bottom:2px solid lighten($color, $amount: 10%);
  .el-submenu__title:hover{
    background-color: lighten($color, $amount: 10%);
  }
  .admin-chat__header{
    color:#f6f6f6;
  }
  .admin-chat__title{
    background-color: #b4d4f5;
    .el-menu-item-group__title{
      color: $color;
      margin-left:-5%;
      font-size: .9em;
      font-weight: bold;
    }
  }
}
</style>
