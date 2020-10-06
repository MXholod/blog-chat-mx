<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/admin/list' }">
                List of posts
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                {{ post.title }}
            </el-breadcrumb-item>
        </el-breadcrumb>
        <span v-if="false">{{ $route.params.id }}</span>
        <el-form
            class="post-edit"
            ref="form"
            :model="ruleForm"
            :rules="rules"
            @submit.native.prevent="onSubmit"
        >
            <el-form-item label="Post text" prop="ptext">
                <el-input
                    placeholder="Post text"
                    type="textarea"
                    :rows="10"
                    v-model="ruleForm.ptext">
                </el-input>
            </el-form-item>
            <div class="post-edit__date-views">
                <small class="post-edit__date">
                    <i class="el-icon-time"></i>
                    <span>{{ new Date(post.date).toLocaleString() }}</span>
                </small>
                <small class="post-edit__views">
                    <i class="el-icon-view"></i>
                    <span>{{ post.views }}</span>
                </small>
            </div>
            <el-form-item>
                <el-button
                    type="primary"
                    native-type="submit"
                    plain
                    :loading="loading"
                >
                    Update post
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['admin-auth'],
  head () {
    return { title: `Post | ${this.post.title}` }
  },
  validate ({ params }) {
    return Boolean(params.id)
  },
  async asyncData ({ store, params }) {
    const post = await store.dispatch('post/editAdminPost', params.id)
    return { post }
  },
  data () {
    return {
      loading: false,
      ruleForm: {
        ptext: ''
      },
      rules: {
        ptext: [
          { required: true, message: 'Post mustn\'t be empty', trigger: 'blur' }
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
            text: this.ruleForm.ptext.trim(),
            id: this.post._id
          }
          try {
            //
            await this.$store.dispatch('post/updateAdminPost', formData)
            this.$message.success('Post has updated')
            this.loading = false
          } catch (e) {
            this.loading = false
          }
          console.log('Form is valid ', formData)
        } else {
          // console.log('Form is invalid')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.post-edit{
  max-width: 600px;
}
.post-edit__date-views{
  margin: 0 0 1rem 0;
  .post-edit__date{
    margin: 0 0 0.8rem 1rem;
  }
  .post-edit__views{
    margin-left: 5%;
  }
}
</style>
