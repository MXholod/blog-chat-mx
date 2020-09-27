<template>
    <el-form
      ref="form"
      :model="ruleForm"
      :rules="rules"
      @submit.native.prevent="onSubmit"
    >
        <h3>Add your comment</h3>
        <el-form-item label="Name" prop="name">
            <el-input v-model.trim="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="Comment text" prop="text">
            <el-input
                type="textarea"
                resize="none"
                :rows="3"
                v-model.trim="ruleForm.text">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              native-type="submit"
              plain
            >
              Add comment
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        name: '',
        text: ''
      },
      rules: {
        name: [
          { required: true, message: 'Please input a name', trigger: 'blur' },
          { min: 3, max: 10, message: 'Length should be 3 to 10', trigger: 'blur' }
        ],
        text: [
          { required: true, message: 'Please type a comment', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log('Form is valid')
        } else {
          console.log('Form is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
