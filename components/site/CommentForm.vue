<template>
    <el-form
      ref="form"
      :model="ruleForm"
      :rules="rules"
      @submit.native.prevent="onSubmit"
    >
        <span style="font-weight:bold">Hey, </span>
        <el-tag>{{ login }} !</el-tag>
        <span style="font-weight:bold">Add your comment</span>
        <el-form-item label="Comment text" prop="text">
            <el-input
                type="textarea"
                resize="none"
                :rows="3"
                v-model="ruleForm.text">
            </el-input>
        </el-form-item>
        <el-form-item>
            <el-button
              type="primary"
              native-type="submit"
              plain
              :loading="loading"
            >
              Add comment
            </el-button>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
  props: {
    postId: { type: String, required: true },
    login: { type: String, required: true }
  },
  data () {
    return {
      loading: false,
      ruleForm: {
        text: ''
      },
      rules: {
        text: [
          { required: true, message: 'Please type a comment', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate( async (valid) => {
        if (valid) {
          this.loading = true
          // Prepare form data
          const formData = {
            postId: this.postId,
            name: this.login,
            text: this.ruleForm.text
          }
          try {
            const newComment = await this.$store.dispatch('comment/create', formData);
            if(newComment){
              this.$message.success('Comment has been added');
              this.ruleForm.text = '';
              // Referring to the parent with event
              this.$emit('commentAdded', newComment);
            }
          } catch (e) {

          }finally{
            this.loading = false;
          }
        } else {
          // console.log('Form is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
