<template>
    <div class="user-space-auth">
        <el-menu
            router
            :default-active="$route.path"
            class="el-menu-auth-sport"
            mode="horizontal"
            background-color="#225AA4"
            text-color="#fff"
          >
          <el-menu-item index="/login" class="el-menu-sport__item">Sign in</el-menu-item>
          <el-menu-item index="/" class="el-menu-sport__item">Sign up</el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
.user-space-auth{
  width:100%;
}
.el-menu-auth-sport.el-menu--horizontal.el-menu{
  display:flex;
  height:80px;
  .el-menu-item.el-menu-sport__item.is-active{
    border-bottom: 0px !important;
    color:#fff;
  }
  .el-menu-item.el-menu-sport__item{
    text-align: center;
  }
}
</style>
