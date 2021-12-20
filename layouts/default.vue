<template>
  <el-container class="el-wrapper-base-layout">
    <el-header height="80px" class="el-header-base-layout">
      <Navigation />
    </el-header>
    <el-container>
      <side-bar v-if="sidebar" :sidebarBlocks="sidebarBlocks" />
      <el-main>
        <Nuxt />
      </el-main>
    </el-container>
    <el-footer class="el-footer-base-layout">
      <social-buttons />
      <div class="el-footer-base-layout__date">
        All rights reserved. MX &copy; {{ String(new Date().getFullYear()) }}
      </div>
    </el-footer>
  </el-container>
</template>

<script>
import Navigation from './../components/site/Navigation';
import SideBar from './../components/site/sidebar/SideBar';
import SocialButtons from './../components/site/footer/SocialButtons.vue';
export default {
  components: {
    Navigation,
    SideBar,
    SocialButtons
  },
  computed: {
    error () {
      return this.$store.getters['error/error']
    }
  },
  watch: {
    error (val) {
      // $axios - val.response.data.message, val - native JS Error
      val = val.response ? val.response.data.message : val;
      if(val.jwtRefreshed){
        const h = this.$createElement;
        this.$message({
          message: h('p', null, [
            h('span', null, val.jwtRefreshed),
            h('i', { style: 'color: teal' }, ' Continue to use the interface')
          ]),
          duration: 7000
        });
      }else{
        this.$message({
          showClose: true,
          message: val,
          type: 'error'
        })
      }
    }
  },
  data(){
    return {
      sidebar: true,
      sidebarBlocks: {
        searchSettings: null,
        popularPosts: [],
        popularPages: [],
        recentPosts: [],
        recentPages: []
      }
    }
  },
  async fetch() {
    try{
      const result = await this.$axios.$get('/api/sidebar/visibility');
      //'sidebar' isn't NULL
      if(result && !!result.sidebar){
        this.sidebar = true;
        this.sidebarBlocks = result.sidebar;
      }else{
        this.sidebar = false;
        this.sidebarBlocks = {};
      }
    }catch(e){
      //console.log(e);
      this.sidebar = true;
    }
  }
}
</script>

<style lang="scss">
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
  height:auto!important;
  padding:.5em 1em .5em;
  background-color:#225AA4;
  .el-footer-base-layout__date{
    padding:.5em 1em .5em;
    font-size:.9em;
    color:#f6f6f6;
    text-align: center;
  }
}
</style>
