<template>
    <el-form
      ref="form"
      :model="ruleForm"
      :rules="rules"
      @submit.native.prevent="onSubmit"
      class="user-creation-form"
    >
        <el-form-item label="Login" prop="login">
            <el-input v-model.trim="ruleForm.login"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="pass">
            <el-input type="password" v-model.trim="ruleForm.pass"></el-input>
        </el-form-item>
        <el-select v-model.trim="activeRole" class="user-creation-form__select">
            <el-option
              v-for="item in roles"
              :key="item.activeRole"
              :label="item.labelRole"
              :value="item.activeRole">
            </el-option>
        </el-select>
        <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              plain
              :loading="loading"
            >
              Create
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      loading: false,
      roles: [
        { activeRole: 'guest', labelRole: 'Guest' },
        { activeRole: 'moderator', labelRole: 'Moderator' }
      ],
      activeRole: 'guest',
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
          { min: 6, message: 'The password must be at least 6 characters long', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate((valid) => { // async
        if (valid) {
          this.loading = true
          // Prepare form data
          const formData = {
            login: this.ruleForm.login,
            pass: this.ruleForm.pass,
            role: this.activeRole
            // 'this.isAdmin' - must be always 'false' because the admin exists
            // isAdmin: this.isAdmin
          }
          console.log(formData)
          try {
            // await this.$store.dispatch('auth/userCreation', formData)
            this.$message.success('User has been created')
            // Reset form fields
            this.ruleForm.login = ''
            this.ruleForm.pass = ''
            this.loading = false
          } catch (e) {
            this.loading = false
          }
          // console.log('Form is valid ', formData)
        } else {
          console.log('Form is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss">
.user-creation-form{
  max-width: 600px;
  margin: 0 auto;
}
.user-creation-form__select{
  margin-bottom:1rem;
}
</style>
