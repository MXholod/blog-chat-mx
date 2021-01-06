<template>
  <div class="sport-register">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="register-ruleForm">
      <el-form-item label="Login" prop="login">
        <el-input type="text" v-model="ruleForm.login" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input type="email" v-model="ruleForm.email" autocomplete="off"></el-input>
      </el-form-item>
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
          @click="submitForm('ruleForm')">
            Submit
        </el-button>
        <el-button @click="resetForm('ruleForm')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      var validatePass = (rule, value, callback) => {
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
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.ruleForm.pass) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          callback();
        }
      };
      return {
        ruleForm: {
          login:'',
          email:'',
          pass: '',
          checkPass: ''
        },
        rules: {
          login: [
            { required: true, message: 'Please input Activity login', trigger: 'blur' },
            { min: 3, max: 12, message: 'Length should be 3 to 12', trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'Please input email address', trigger: 'blur' },
            { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        },
        loading: false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true;
            setTimeout(()=>{
              this.$message({
                showClose: true,
                message: 'You\'ve sent the data to register',
                type: 'success'
              });
              this.loading = false;
            },3000);
            //alert('submit!');
          } else {
            //console.log('error submit!!');
            this.$message({
              showClose: true,
              message: 'You\'ve input incorrect data',
              type: 'error'
            })
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
  }
</script>

<style lang="scss">
.sport-register{
  width:700px;
  .el-form.register-ruleForm{
    .el-form-item{
      .el-form-item__label{
        width:120px;
        font-size: 13px;
      }
    }
  }
}
</style>
