<template>
  <div class="room-creation">
    <h1>Creating a chat room</h1>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="room-creation__form">
      <el-form-item label="Room name" prop="name">
        <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Room description" prop="description">
        <el-input type="textarea" v-model="ruleForm.description" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" :disabled="loading"
          type="primary" @click="submitForm('ruleForm')">
          Submit
        </el-button>
        <el-button :disabled="loading"
          @click="resetForm('ruleForm')">
          Reset
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
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
    return {
      userLogoutRefresh: userData.sessionEnd ? true : false
    };
  },
  layout: 'admin',
  data(){
    return {
      loading: false,
      ruleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please input a room name', trigger: 'blur' }
        ],
        description: [
          { required: true, message: 'Please input a description of the room', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate(async (valid) => {
        if(valid){
          this.loading = true;
          const formData = {
            name: this.ruleForm.name,
            description: this.ruleForm.description
          };
          try{
              const result = await this.$axios.post('/api/chat_room/create',formData);
              if(result.data && result.data.room){
                this.ruleForm.name = '';
                this.ruleForm.description = '';
                this.$message({
                  showClose: true,
                  message: 'The form data has sent!',
                  type: 'success'
                });
              }
          }catch(e){
            this.$message({
              showClose: true,
              message: e.message,
              type: 'error'
            });
          }finally{
            this.loading = false;
          }
        }else{
          this.$message({
            showClose: true,
            message: 'The form is invalid!',
            type: 'warning'
          });
        }
      });
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
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
.room-creation__form{
  margin-top:1em;
  width: 600px;
  .el-form-item.el-form-item--feedback:nth-child(2){
    label[for='description']{
      width: 155px!important;
    }
    .el-form-item__content{
      margin-left: 175px!important;
    }
  }
}
</style>
