<template>
  <div class="user-page">
    <admin-user-management v-if="showUsers" />
  </div>
</template>

<script>
import AdminUserManagement from '@/components/admin/AdminUserManagement'
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
    let showUsers = false;
    //If we have role: 'admin' or 'moderator'
    if(userData.role && !userData.sessionEnd){
      showUsers = true;
    }
    return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      showUsers
    };
  },
  layout: 'admin',
  components: { AdminUserManagement },
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
