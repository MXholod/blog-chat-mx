<template>
    <v-app>
        <v-container fluid class="container-chat">
            <v-row>
                <v-col xs="12" md="12" lg="12" class="container-chat__cols">
                    <el-container>
                        <el-header height="80px" class="el-header-base-layout">
                            <Navigation />
                        </el-header>
                    </el-container>
                </v-col>
            </v-row>
            <v-row>
                <v-col xs="12" md="12" lg="12">
                    <v-container>
                        <v-main>
                            <Nuxt />
                        </v-main>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
        <v-footer app :padless="true" color="#225AA4" :height="60">
            <p>Footer</p>
        </v-footer>
    </v-app>
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
 .container-chat {
  padding: 0px;
 }
 .container-chat__cols {
  padding: 0px;
  background-color:#225AA4;
  padding-left: 20px;
  padding-right: 20px;
 }
</style>
