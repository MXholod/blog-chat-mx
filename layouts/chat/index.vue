<template>
    <v-app>
        <v-container fluid class="container-chat">
          <header-chat></header-chat>
          <v-row>
            <v-col xs="12" md="12" lg="12">
              <v-container>
                <Nuxt />
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
import HeaderChat from './../../components/site/chat/Header-Chat';
export default {
  components: {
    HeaderChat
  }
}
</script>

<style lang="scss">
.el-footer-base-layout{
  padding:0;
  background-color:#225AA4;
 }
</style>
