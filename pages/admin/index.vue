<template>
    <div>
      <el-tabs type="card" @tab-click="handleTabs">
        <el-tab-pane label="Admin info">
          <h1>Welcome to the admin page</h1>
          <p class="to-cabinet">Go to the cabinet on the client side
            <br />
            <NuxtLink to="/cabinet" :class="'to-cabinet__btn'">My cabinet</NuxtLink>
          </p>
        </el-tab-pane>
        <el-tab-pane v-if="user.role === 'admin'" label="Site logo">
          <logo :imageLink="logo" :key="reloadLogo" />
        </el-tab-pane>
        <el-tab-pane label="Blog and chat info charts">
          <info-chart-statistics :allStatistics="allStatistics" />
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Logo from './../../components/admin/site_logo/Logo.vue';
import InfoChartStatistics from './../../components/admin/charts/InfoChartStatistics.vue';
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
    let allStatistics = null;
    try{
      const result = await context.$axios.$get('/api/chart_statistics/all_statistics');
      allStatistics = result.allStatistics;
    }catch(e){
      //console.log(e);
    }
    let siteOptions;
    if(userData.role === 'admin'){
      siteOptions = await context.app.$getAllSiteOptions(jwt);
      if(siteOptions){
        return {
          userLogoutRefresh: userData.sessionEnd ? true : false,
          logo: siteOptions?.options?.siteLogo,
          allStatistics
        };
      }
    }else{
      return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      logo: siteOptions,
      allStatistics
    };
    }
  },
  layout: 'admin',
  name: 'admin',
  components: {
    Logo,
    InfoChartStatistics
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

<style lang="scss">
.to-cabinet{
  max-width: 40%;
  margin: 1em 0 0 .5em;
  border: 2px solid lightgray;
  padding: 4px;
  border-radius: 5px;
  background-color: #f6f6f6;
}
.to-cabinet__btn{
  display: inline-block;
  margin-top:1em;
  padding: .5em 1em;
  background-color: #409eff;
  color:#000;
  text-decoration: none;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: .9em;
  font-weight: bold;
  border-radius: 5px;
  &:hover, &:active{
    background-color: darken(#409eff, 10%);
    color:#f6f6f6;
  }
}
</style>
