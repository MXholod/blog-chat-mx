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
  }
}
</script>

<style lang="scss">
.el-footer-base-layout{
  padding:0;
  background-color:#225AA4;
 }
</style>
