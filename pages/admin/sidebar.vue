<template>
    <div>
      <el-tabs type="card" v-model="activeName" @tab-click="handleTabs">
        <el-tab-pane label="Sidebar management of blocks" name="first">
          <p>Here you can control the visibility of the blocks. The blocks represent information on the sidebar.</p>
          <h3>Turn the sidebar on / off (by default its on)</h3>
          <div class="sidibar-visibility-switcher">
            <button v-if="!sidebarLoading"
              class="sidibar-visibility-switcher__btn"
              @click="handleSidebarVisibility">
              <i v-if="sidebarVisibility" class="el-icon-open"></i>
              <i v-else class="el-icon-turn-off"></i>
            </button>
            <button v-else type="button"
              class="sidibar-visibility-switcher__btn-default">
              <i v-if="sidebarVisibility" class="el-icon-open"></i>
              <i v-else class="el-icon-turn-off"></i>
            </button>
            <span v-if="sidebarVisibility"
              class="sidibar-visibility-switcher__on">
              On
            </span>
            <span v-else class="sidibar-visibility-switcher__off">
              Off
            </span>
            <span v-show="sidebarLoading"
              class="el-icon-loading sidibar-visibility-switcher__preloading">
            </span>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Popular posts" name="second">

        </el-tab-pane>
        <el-tab-pane label="Popular pages" name="third">

        </el-tab-pane>
        <el-tab-pane label="Recently created posts" name="fourth">

        </el-tab-pane>
        <el-tab-pane label="Recently created pages" name="fifth">

        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async asyncData(context){
    let jwt = context.store.getters['auth/isUserAuthenticated'].jwtToken;
    //'$isAllowedByRole' is a function from Plugin
    let userData = await context.app.$isAllowedByRole(jwt);
    if(userData.role === 'guest'){
      context.redirect('/cabinet');
    }
    if(userData.role === '' && !userData.sessionEnd){
      if(context.store.getters['auth/isUserAuthenticated'].role !== ''){
        context.store.dispatch('auth/logout');
      }
      context.redirect('/');
    }
    let sidebarVisibility = true;
    try{
      //Get sidebar visibility
      const result = await context.$axios.$get('api/sidebar/visibility');
      if(result){
        //Sidebar visibility has been changed
        sidebarVisibility = result.sidebarVisibility;
      }
    }catch(e){
      console.log(e);
    }
    return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      sidebarVisibility
    };
  },
  layout: 'admin',
  name: 'sidebar',
  computed: mapState('auth', ['user']),
  data(){
    return {
      activeName: 'first',
      sidebarLoading: false
    }
  },
  methods:{
    async handleTabs(tab, event) {},
    handleSidebarVisibility(){
      //Start pre-loading
      this.sidebarLoading = true;
      //Inverting Boolean value and then convert it to Number
      const sidebarState = Number(!this.sidebarVisibility);
      try{
        window.setTimeout(async ()=>{
          const result = await this.$axios.$patch(`api/sidebar/visibility/${sidebarState}`);
          if(result){
            //Sidebar visibility has been changed
            this.sidebarVisibility = result.sidebarVisibility;
          }
          this.sidebarLoading = false;
        },2000);
      }catch(e){
        console.log("Error ",e);
      }
    }
  },
  mounted(){
    //Displaying the modal window to inform user about the end of the session
    if(this.userLogoutRefresh){
      this.$alert('Your session is up!', 'Session state', {
        confirmButtonText: 'Sign in again',
        showClose:false,
        callback: action => {
          this.$store.dispatch('auth/logout');
          this.$router.push('/login?message=unauthenticated');
        }
      });
    }
  }
}
</script>

<style lang="scss">
.sidibar-visibility-switcher{
  .sidibar-visibility-switcher__btn{
    .el-icon-turn-off{
      color:red;
    }
    .el-icon-open{
      color:green;
    }
    padding: 1px 0px!important;
    font-size: 2.3em;
    margin: .2em 0 0 1em;
  }
  .sidibar-visibility-switcher__btn-default{
    padding: 1px 0px!important;
    font-size: 2.3em;
    margin: .2em 0 0 1em;
  }
  .sidibar-visibility-switcher__on{
    color:green;
    top: -6px;
    position: relative;
    left: 10px;
    font-weight: bold;
  }
  .sidibar-visibility-switcher__off{
    color:red;
    top: -6px;
    position: relative;
    left: 10px;
    font-weight: bold;
  }
  .sidibar-visibility-switcher__preloading{
    top: -6px;
    position: relative;
    left: 10px;
    font-weight: bold;
  }
}
</style>
