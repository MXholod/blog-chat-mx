<template>
  <div class="userName">
    <el-divider content-position="left">User Name</el-divider>
    <h3 class="userName__header">Here you can change your user name</h3>
    <el-form :model="userNameValidate" ref="userNameValidate">
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
        <el-button type="primary" @click="submitUserName('userNameValidate')">Change user name</el-button>
        <el-button @click="resetUserName('userNameValidate')">Reset</el-button>
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
      }
    }
  },
  methods: {
    submitUserName(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log("Submit ",formName);
          } else {
            console.log('error submit!!');
            return false;
          }
        });
    },
    resetUserName(formName){
      //console.log("Reset ",formName);
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
