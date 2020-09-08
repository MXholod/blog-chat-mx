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
