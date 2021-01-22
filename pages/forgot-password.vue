<template>
  <div class="sport-forgot-password">
    <h3>Enter the email address where the new password will be sent</h3>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="120px" class="sport-forgot-password__ruleForm">
      <el-form-item label="Email" prop="email">
        <el-input type="email" v-model="ruleForm.email" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :loading="loading"
          @click.native.prevent="submitForm('ruleForm')">
            Submit
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'forgot-password',
  data(){
    return {
      ruleForm: {
        email:''
      },
      rules: {
        email: [
          { required: true, message: 'Please input email address', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ]
      },
      loading: false
    }
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate( async (valid) => {
        if(valid){
          this.loading = true;
          try{
            const result = await this.$axios.$post('/api/user/forgot-password', { email: this.ruleForm.email });
            if(result){
              this.$message({
                showClose: true,
                message: result.message,
                type: 'success'
              });
              this.ruleForm.email = '';
            }
            this.loading = false;
          }catch(e){
            this.$message({
              showClose: true,
              message: e.message,
              type: 'error'
            });
            this.loading = false;
          }
        }else{
         this.$message({
            showClose: true,
            message: 'Your email is incorrect!',
            type: 'error'
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.sport-forgot-password{
  width: 650px;
  margin: 5% 0% 0% 15%;
  h3{
    margin: 0% 0% 5% 20%;
    font-size: 0.9em;
  }
  .sport-forgot-password__ruleForm{}
}
</style>
