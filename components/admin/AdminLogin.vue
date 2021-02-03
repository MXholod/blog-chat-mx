<template>
    <el-form
      ref="form"
      :model="ruleForm"
      :rules="rules"
      @submit.native.prevent="onSubmit"
    >
        <h3>Enter the cabinet</h3>
        <el-form-item label="Email" prop="email">
            <el-input v-model.trim="ruleForm.email"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="pass">
            <el-input type="password" v-model.trim="ruleForm.pass"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              plain
              :loading="loading"
            >
              Enter
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      ruleForm: {
        email: '',
        pass: ''
      },
      rules: {
        email: [
          { required: true, message: 'Please input email address', trigger: 'blur' },
          { type: 'email', message: 'Please input correct email address', trigger: ['blur', 'change'] }
        ],
        pass: [
          { required: true,  message: 'Please input a password', trigger: 'blur' },
          { min: 5, max: 12, message: 'Length should be 5 to 12', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true;
          // Prepare form data
          const formData = {
            email: this.ruleForm.email,
            password: this.ruleForm.pass
          }
          try {
            //
            await this.$store.dispatch('auth/login', formData);
            // If data is ok go to the admin page
            //this.$router.push('/admin')
            this.loading = false;
            this.ruleForm.email = '';
            this.ruleForm.pass = '';
            // this.$message.success('User logged in');
            this.$message({
              showClose: true,
              message: 'User logged in',
              type: 'success'
            })
          } catch (e) {
            this.loading = false;
            /*this.$message({
              showClose: true,
              message: e.message,
              type: 'error'
            });*/
          }
        } else {
          this.$message({
            showClose: true,
            message: 'Form is invalid',
            type: 'error'
          });
        }
      })
    }
  },
  mounted () { // This method is only called on the client side
    /* // Get query parameter 'message'
    const { message } = this.$route.query
    if (message === 'unauthenticated') {
      // Call element-ui method 'error'
    } else if (message === 'admin-logout') {
      // Call element-ui method 'success'
    }*/
  }
}
</script>

<style lang="scss" scoped>

</style>
