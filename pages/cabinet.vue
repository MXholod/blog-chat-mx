<template>
  <div>
    <el-row v-if="role">
      <el-col :span="6">
        <div class="user-cabinet">
          <div class="user-cabinet__login">
            <span>{{ isUserAuthenticated.login }}'s</span> cabinet
          </div>
          <div class="user-cabinet__role">
            <div>
              Your role is: <span>{{ isUserAuthenticated.role }}</span>
            </div>
            <p v-if="role === 'admin' || role === 'moderator'">
              <NuxtLink to="/admin">Go to admin page</NuxtLink>
            </p>
            <p v-else>Welcome guest {{ isUserAuthenticated.login }} to your cabinet</p>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <p>Hello ceneter</p>
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
          <el-radio-button label="top">top</el-radio-button>
          <el-radio-button label="right">right</el-radio-button>
          <el-radio-button label="bottom">bottom</el-radio-button>
          <el-radio-button label="left">left</el-radio-button>
        </el-radio-group>

        <el-tabs :tab-position="tabPosition" style="height: 200px;">
          <el-tab-pane label="User">User</el-tab-pane>
          <el-tab-pane label="Config">Config</el-tab-pane>
          <el-tab-pane label="Role">Role</el-tab-pane>
          <el-tab-pane label="Task">Task</el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="6">
        <p>Hello right</p>
        <p>Result: {{ result }}</p>
        <button @click="testing">Test</button>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="24">
        <p style="textAlign:center">You do not have enough permissions to view the content</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  async asyncData (ctx) {
    try{
      const role = ctx.store.getters['auth/isUserAuthenticated'].role;
      return {
        role
      }
    }catch(e){
      //await ctx.store.dispatch('auth/logout');
      //ctx.redirect('/login?message="You must be registered 2"');
      return {
        role: "Error"
      }
    }
  },
  middleware:['user-auth'],
  layout: 'user-cabinet',
  data() {
    return {
      tabPosition: 'top',
      result: ''
    };
  },
  computed: {
    ...mapGetters('auth',['isUserAuthenticated'])
  },
  async mounted(){
    //if(this.test === "Error"){
      //await this.$store.dispatch('auth/logout');
      //await this.$store.dispatch('error/setError', "You must be registered");
      //this.$nuxt.$router.replace({ path: '/login?message=You must be registered' });
    //}
  },
  methods: {
    async testing(){
      let res = await this.$axios.$get('/api/cabinet/test');
      this.result = res;
    }
  }
}
</script>

<style lang="scss" scoped>
.user-cabinet{
  %login-role{
    padding: 5px;
    border-radius: 5px;
    border: 2px solid #225AA4;
    width:80%;
    font-size: 1em;
    font-family: Verdana, Tahoma, sans-serif;
  }
  .user-cabinet__login{
    @extend %login-role;
    background-color: #b0c9f7;
    span{
      font-size: 1.2em;
      font-weight: bold;
    }
  }
  .user-cabinet__role{
    @extend %login-role;
    width:70%;
    margin: -2px 0 0 5%;
    font-size: .9em;
    background-color: #d0defb;
    div:first-child{
      span{
        font-size: 1em;
        font-weight: bold;
      }
    }
    p{
      a{
        color: #2493f3;
        display: inline-block;
        width: 100%;
        text-align: center;
      }
    }
  }
}
</style>
