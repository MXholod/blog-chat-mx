<template>
    <div>
        <el-container>
            <el-header height="80px" class="el-header-base-layout">
                <Navigation />
            </el-header>
        </el-container>
        <v-app>
            <v-main>
                <v-container fluid>
                    <Nuxt />
                </v-container>
            </v-main>
        </v-app>
        <el-container>
            <el-footer class="el-footer-base-layout">Footer</el-footer>
        </el-container>
    </div>
</template>

<script>
import Navigation from './../../components/site/Navigation'
export default {
  components: {
    Navigation
  }
}
</script>

<style lang="scss">
.el-footer-base-layout{
  padding:0;
  background-color:#225AA4;
 }
</style>
