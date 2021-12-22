<template>
  <div>
    <h1 class="email-verification-header">Verification email page</h1>
    <div v-if="isToken" class="token-present">
      <h3>Your email address has been verified correctly, you can now 'Sign in'</h3>
      <br />
      <NuxtLink to="/login">Go to the 'Sign in' page</NuxtLink>
    </div>
    <div v-else class="token-absent">
      <h3>{{ message }}</h3>
      <p>
        Invalid email verification process, you can 'Sign up' again or 'Sign in'
        <br />
        <NuxtLink to="/register">Go to the 'Sign up' page</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({query, $axios}) {
    let params = Object.assign({}, query);
    const isToken = !!params.token;
    try{
      if(isToken){
        const response = await $axios.$post('/api/user/verification',{ token: params.token })
        return { message: response.message, isToken };
      }else{
        return { message: 'Token is absent', isToken };
      }
    }catch(e){
      return { message: e.message, isToken: false };
    }
  },
  head: {
    title: 'Verification email page'
  },
  data(){
    return {
      //token: ''
    }
  },
  name: 'verification-email',
  //the Vue mouted hook only run on client, when you want to get the params on server, you can use the asyncData method:
  mounted(){
    //this.token = this.$route.query.token
    this.$message({
      showClose: true,
      message: this.message,
      type: 'info'
    });
  }
}
</script>

<style lang="scss" scoped>
  .email-verification-header{
    text-align: center;
  }
  %token-block{
    width:50%;
    border-radius: 20px;
    padding: 10px 20px;
    margin: 5% auto 0%;
    border: 5px solid #216aca;
    background-color: #78aef5;
    h3{
      text-align: center;
    }
  }
  .token-present{
    @extend %token-block;
    a{
        color: #f6f6f6;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: .8em;
        margin-left: 70%;
      }
  }
  .token-absent{
    @extend %token-block;
    p{
      a{
        color: #f6f6f6;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        font-size: .8em;
        margin-left: 70%;
      }
    }
  }
</style>
