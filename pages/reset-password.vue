<template>
  <div class="sport-reset-password">
    <h3>Enter new passwords</h3>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="sport-reset-password__ruleForm">
      <el-form-item label="Password" prop="pass">
        <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm password" prop="checkPass" class="confirm-pass">
        <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="submitToggle"
          @click.native.prevent="submitForm('ruleForm')">
            Submit
        </el-button>
      </el-form-item>
    </el-form>
    <div v-if="linkPage" class="sport-reset-password__to-login-page">
      <NuxtLink to="/login">Go to Sign in page</NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "reset-password",
  middleware: ['restrict-reset-password'],
  async asyncData({ query }){
    return { token : query.token};
  },
  head: {
    title: 'Reset password page'
  },
  data(){
    var validatePass = (rule, value, callback) => {
        this.submitToggle = true;
        if (value === '') {
          callback(new Error('Please input the password'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
    var validatePass2 = (rule, value, callback) => {
        this.submitToggle = true;
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          this.submitToggle = false;
          callback();
        }
      };
    return {
       ruleForm: {
          pass: '',
          checkPass: ''
        },
        rules: {
          pass: [
            { required: true, validator: validatePass, trigger: ['blur', 'change'] },
            { min: 5, max: 12, message: 'Length should be 5 to 12', trigger: ['blur', 'change'] }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: ['blur', 'change'] },
            { min: 5, max: 12, message: 'Length should be 5 to 12', trigger: ['blur', 'change'] }
          ]
        },
        loading: false,
        submitToggle: true,
        linkPage: false
    }
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate( async (value)=>{
        if(value){
          this.loading = true;
          const userData = {
            token: this.token,
            password: this.ruleForm.pass,
            confirmPassword: this.ruleForm.checkPass
          };
          try{
            const response = await this.$axios.$put('/api/user/reset-password', userData);
            if(response){
              this.$message({
                showClose: true,
                message: response.message,
                type: 'success'
              });
            }
            this.linkPage = true;
            this.loading = false;
            this.submitToggle = true;
            this.ruleForm.pass = '';
            this.ruleForm.checkPass ='';
          }catch(e){
            this.loading = false;
            this.$message({
              showClose: true,
              message: e.response.data.message, //Error of $axios
              type: 'error'
            });
          }
        }else{
          this.$message({
            showClose: true,
            message: "You've entered incorrect data",
            type: 'error'
          });
        }
      });
    }
  }
}
</script>

<style lang="scss">
.sport-reset-password{
  width:700px;
  h3{
    margin: 5% 0% 3%;
    text-align: center;
  }
  .el-form.sport-reset-password__ruleForm{
    .el-form-item{
      .el-form-item__label{
        width:120px !important;
        font-size: 12px !important;
      }
    }
  }
  .sport-reset-password__to-login-page{
    position: relative;
    left: 70%;
    top: -50px !important;
  }
}
</style>
