<template>
    <el-container class="el-wrapper-base-layout">
        <el-header height="80px" class="el-header-base-layout">
            Header
        </el-header>
        <el-container>
            <el-aside class="el-aside-base-layout">
                <menu-aside />
            </el-aside>
            <el-main>
                <Nuxt />
            </el-main>
        </el-container>
        <el-footer class="el-footer-base-layout">Footer</el-footer>
    </el-container>
</template>

<script>
import MenuAside from '@/components/admin/MenuAside'
export default {
  components: { MenuAside }
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
