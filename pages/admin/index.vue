<template>
    <div>
      <NuxtLink to="/">Home</NuxtLink>
      <el-tabs type="card" @tab-click="handleTabs">
        <el-tab-pane label="Admin info">
          <h1>Welcome to the admin page</h1>
        </el-tab-pane>
        <el-tab-pane v-if="user.role === 'admin'" label="Site logo">
          <logo :imageLink="logo" :key="reloadLogo" />
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Logo from './../../components/admin/site_logo/Logo.vue';
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
    let siteOptions;
    if(userData.role === 'admin'){
      siteOptions = await context.app.$getAllSiteOptions(jwt);
      if(siteOptions){
        return {
          userLogoutRefresh: userData.sessionEnd ? true : false,
          logo: siteOptions?.options?.siteLogo
        };
      }
    }else{
      return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      logo: siteOptions
    };
    }
  },
  layout: 'admin',
  name: 'admin',
  components: {
    Logo
  },
  computed: mapState('auth', ['user']),
  data(){
    return {
      activeName: 'first' ,
      logo:'',
      reloadLogo: 0
    }
  },
  methods:{
    async handleTabs(tab, event) {}
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
