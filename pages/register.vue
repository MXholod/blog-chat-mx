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
      <div class="accept-terms-block">
        <el-checkbox v-model="checked" class="accept-terms-tick">Accept terms</el-checkbox>
        <el-card class="accept-terms-text" :class="!checked ? 'sh' : 'hd'">
          Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
        </el-card>
      </div>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          :disabled="!checked"
          @click="submitForm('ruleForm')">
            Submit
        </el-button>
        <el-button @click="resetForm('ruleForm')" :disabled="!checked">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    head: {
      title: 'Registration page'
    },
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
            { min: 3, max: 15, message: 'Length should be 3 to 15', trigger: 'blur' }
          ],
          email: [
            { required: true, message: 'Please input email address', trigger: 'blur' },
            { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
          ],
          pass: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { min: 5, max: 12, message: 'Length should be 5 to 12', trigger: 'blur' }
          ],
          checkPass: [
            { required: true, validator: validatePass2, trigger: 'blur' },
            { min: 5, max: 12, message: 'Length should be 5 to 12', trigger: 'blur' }
          ]
        },
        loading: false,
        checked: false
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid && this.checked) {
            this.loading = true;
            //Prepare User data
            const userData = {
              login: this.ruleForm.login,
              email: this.ruleForm.email,
              password: this.ruleForm.pass,
              passwordConfirmation: this.ruleForm.checkPass,
              acceptTerms: this.checked
            };
            //
            try {
              const result = await this.$axios.$post('/api/user/registration', userData);
               this.$message({
                  showClose: true,
                  message: result.message, //'You\'ve sent the data to register',
                  type: 'success'
                });
            } catch (e) {
              this.$message({
                showClose: true,
                message: `Data ${e.message}`,
                type: 'error'
              })
            }
              this.resetForm(formName);
              this.loading = false;
              this.checked = false;
          } else {
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
        font-size: 12px;
      }
    }
  }
  .accept-terms-block{
    padding:0px 0px 3% 0px;
    &::after{
      content:'';
      display: block;
      clear: both;
    }
    .accept-terms-tick{
      float:left;
      width:300px;
      padding: 2% 0 0 20%;
    }
    .accept-terms-text{
      float:right;
      width:400px;
      height:70px;
      overflow-y: scroll;
      transition: all 1s ease-in;
      .el-card__body{
        padding:15px;
        font-size:12px;
      }
      &.sh{
        visibility: visible;
        height:70px;
        color:#000;
      }
      &.hd{
        visibility: hidden;
        height: 50px;
        color: transparent;
      }
    }
  }
}
</style>
