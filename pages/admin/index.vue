<template>
    <div>
      <h1>Welcome to admin page</h1>
      <NuxtLink to="/">Home</NuxtLink>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  async asyncData(context){
    let jwt = context.store.getters['auth/isUserAuthenticated'].jwtToken;
    let userData = await context.app.$isAllowedByRole(jwt);

    if(userData.role === 'guest'){
      context.redirect('/cabinet');
    }
    if(userData.role === ''){
      if(context.store.getters['auth/isUserAuthenticated'].role !== ''){
        context.store.dispatch('auth/logout');
      }
      context.redirect('/');
    }
    return { jwt };
  },
  layout: 'admin',
  name: 'admin',
  //computed: mapState('auth', ['testDataUser'])
}
</script>
