<template>
  <el-container class="el-wrapper-base-layout">
    <el-header height="80px" class="el-header-base-layout">
      <Navigation />
    </el-header>
    <el-container>
      <el-main>
        <Nuxt />
      </el-main>
    </el-container>
    <el-footer class="el-footer-base-layout">Footer</el-footer>
  </el-container>
</template>

<script>
import Navigation from './../components/site/Navigation'
export default {
  components: {
    Navigation
  }
}
</script>

<style lang="scss">
.el-wrapper-base-layout{
  height: 100vh;
}
.el-header-base-layout{
  padding:0;
}
.el-footer-base-layout{
  padding:0;
  background-color:#225AA4;
}
</style>
