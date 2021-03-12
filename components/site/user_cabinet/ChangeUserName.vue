<template>
  <div class="userName">
    <el-divider content-position="left">User Name</el-divider>
    <h3 class="userName__header">Here you can change your user name</h3>
    <el-form :model="userNameValidate" ref="userNameValidate" @submit.native.prevent="submitUserName('userNameValidate')">
      <el-form-item
        label="Change your user name"
        prop="userName"
        :rules="[
          { required: true, message: 'Name is required'},
          { min: 3, max: 15, message: 'Length must be from 3 to 15', trigger: 'blur' }
        ]"
      >
        <el-input type="text" v-model="userNameValidate.userName" autocomplete="off" class="userName__input"></el-input>
      </el-form-item>
      <el-form-item class="userName__buttons">
        <el-button :loading="disabled" :disabled="disabled" type="primary" @click="submitUserName('userNameValidate')">Change user name</el-button>
        <el-button :disabled="disabled" @click="resetUserName('userNameValidate')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data(){
    return {
      userNameValidate:{
        userName: ''
      },
      disabled:false,
      isError: false
    }
  },
  methods: {
    submitUserName(formName){
      this.$refs[formName].validate(async (valid) => {
          if (valid) {
            this.disabled = true;
            try{
              await this.$store.dispatch('auth/updateUserLogin', {
                newLogin: this.userNameValidate.userName
              });
            }catch(e){
              this.isError = true;
            }
            //Succes only if there is no error
            if(!this.isError){
              //this.userNameValidate.userName = '';
              this.resetUserName(formName);
              this.$message({
                showClose: true,
                message: 'Your user name has successfully changed',
                type: 'success'
              });
            }
            //Reset isError to false
            this.isError = false;
            this.disabled = false;
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetUserName(formName){
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
  .userName{
    background-color: #cfe7fb;
  }
  .userName__header{
    text-align: center;
    margin-bottom: .5em;
  }
  .userName__input{
    width:50%;
  }
  .userName__buttons{
    button:first-child{
      margin-left: 26%;
    }
    button{
      padding: 8px;
      font-size: 13px;
    }
  }
</style>
