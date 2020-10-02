<template>
    <el-form
      ref="form"
      :model="ruleForm"
      :rules="rules"
      @submit.native.prevent="onSubmit"
    >
        <h3>Login panel</h3>
        <el-form-item label="Login" prop="login">
            <el-input v-model.trim="ruleForm.login"></el-input>
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
              Login
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
        login: '',
        pass: ''
      },
      rules: {
        login: [
          { required: true, message: 'Please input a login', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ],
        pass: [
          { required: true, message: 'Please input a password', trigger: 'blur' },
          { min: 6, message: 'The password must be at least 5 characters long', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          // Prepare form data
          const formData = {
            login: this.ruleForm.login,
            pass: this.ruleForm.pass
          }
          try {
            this.$message.success('User logged in')
            //
            await this.$store.dispatch('auth/login', formData)
            // If data is ok go to the admin page
            this.$router.push('/admin')
          } catch (e) {
            this.loading = false
          }
          console.log('Form is valid ', formData)
        } else {
          // console.log('Form is invalid')
        }
      })
    }
  },
  mounted () { // This method is only called on the client side
    // Get query parameter 'message'
    const { message } = this.$route.query
    if (message === 'unauthenticated') {
      // Call element-ui method 'error'
      this.$message({
        showClose: true,
        message: 'You must first login',
        type: 'error'
      })
    } else if (message === 'admin-logout') {
      // Call element-ui method 'success'
      this.$message({
        showClose: true,
        message: 'You\'ve left the admin page',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
