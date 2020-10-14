<template>
  <el-container class="el-wrapper-base-layout">
    <el-header height="80px" class="el-header-base-layout">
      <Navigation />
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
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

<style>
html {
  font-family:
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}
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
