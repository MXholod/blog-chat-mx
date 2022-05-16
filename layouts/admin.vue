<template>
    <el-container class="admin el-wrapper-base-layout">
        <el-header height="80px" class="el-header-base-layout">
            Header
        </el-header>
        <el-container class="el-aside-main-base-layout">
            <input type="checkbox" id="sandwich" />
            <label for="sandwich">
              <i>
                <span></span>
                <span></span>
              </i>
              <i>
                <span></span>
                <span></span>
                <span></span>
              </i>
            </label>
            <el-aside class="el-aside-base-layout">
                <menu-aside />
            </el-aside>
            <el-main class="el-main-base-layout">
                <Nuxt />
            </el-main>
        </el-container>
        <el-footer class="el-footer-base-layout">Footer</el-footer>
    </el-container>
</template>

<script>
import MenuAside from '@/components/admin/MenuAside'
export default {
  components: { MenuAside },
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
  }
}
</script>

<style lang="scss" scoped>
.el-wrapper-base-layout{
  height: 100vh;
}
.el-header-base-layout{
  padding:0;
  background-color:#225AA4;
}
.el-aside-base-layout{
    width: 250px !important;
    background-color:#77AAED;
}
.el-footer-base-layout{
  padding:0;
  background-color:#225AA4;
}
</style>
