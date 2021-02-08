<template>
  <v-row>
    <v-col xs="12" md="12" lg="12" class="container-chat__cols">
      <el-container>
        <el-header height="80px" class="el-header-base-layout">
          <Navigation />
        </el-header>
      </el-container>
    </v-col>
  </v-row>
</template>

<script>
import Navigation from './../Navigation';
export default {
  components: {
    Navigation
  }
}
</script>

<style lang="scss">
.el-header-base-layout{
  .el-menu-sport.el-menu--horizontal.el-menu{
    padding:0;
  }
}
.container-chat {
  padding: 0px;
  line-height: 1em;
  .row{
    margin: 0px -12px 0px;
    .container-chat__cols {
      padding: 0px;
      background-color:#225AA4;
      padding-left: 12px;
      padding-right: 12px;
      .user-space-cab-chat__text{
        padding-top: .5rem;
      }
    }
    .el-menu-cab-chat-sport{
      padding-left: 0;
    }
  }
 }
</style>
