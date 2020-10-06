<template>
  <div class="post-create">
    <h3>Post creation</h3>
    <el-form
      ref="form"
      :model="ruleForm"
      :rules="rules"
      @submit.native.prevent="onSubmit"
    >
      <el-form-item label="Post title" prop="ptitle">
        <el-input
          placeholder="Post title"
          v-model="ruleForm.ptitle">
        </el-input>
      </el-form-item>
      <el-tabs type="card" @tab-click="handleClick">
        <el-tab-pane label="Post text">
          <el-form-item label="Post text (.html or .md) formats" prop="ptext">
            <el-input
              placeholder="Post text"
              type="textarea"
              :rows="10"
              v-model="ruleForm.ptext">
            </el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="Post text preview" class="sport-markdown-text-preview">
          <el-form-item label="Preview post with text in: (.html or .md) formats" prop="ptext">
          </el-form-item>
          <div
            class="sport-preview-markdown"
            v-html="$md.render(ruleForm.ptext)">
          </div>
        </el-tab-pane>
        <el-tab-pane label="Post image" class="sport-preview-image">
          <el-form-item label="Image for current post"></el-form-item>
            <el-upload
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleChangeImage"
              :auto-upload="false"
              ref="sportImage"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
              <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
            </el-upload>
        </el-tab-pane>
      </el-tabs>
      <el-form-item>
        <el-button
          type="primary"
          native-type="submit"
          plain
          :loading="loading"
        >
          Create post
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['admin-auth'],
  data () {
    return {
      activeName: 'first',
      postImage: null,
      loading: false,
      ruleForm: {
        ptitle: '',
        ptext: ''
      },
      rules: {
        ptitle: [
          { required: true, message: 'Post title mustn\'t be empty', trigger: 'blur' }
        ],
        ptext: [
          { required: true, message: 'Post mustn\'t be empty', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      this.$refs.form.validate(async (valid) => {
        if (valid && this.postImage) {
          this.loading = true
          // Prepare form data
          const formData = {
            title: this.ruleForm.ptitle.trim(),
            text: this.ruleForm.ptext.trim(),
            image: this.postImage
          }
          try {
            //
            await this.$store.dispatch('post/createAdminPost', formData)
            // Clear properties
            this.ruleForm.ptitle = ''
            this.ruleForm.ptext = ''
            this.postImage = null
            this.$refs.sportImage.clearFiles()
            this.$message.success('Post has created')
          } catch (e) {
            console.error('Error ', e)
          } finally {
            this.loading = false
          }
          console.log('Form is valid ', formData)
        } else {
          // console.log('Form is invalid')
          this.$message({
            showClose: true,
            message: 'The form is invalid!',
            type: 'warning'
          })
        }
      })
    },
    handleClick (tab, event) {
      // console.log(tab, event)
    },
    handleChangeImage (file, fileList) {
      // console.log('File ', file, 'File list ', fileList[0])
      this.postImage = file.raw
    }
  }
}
</script>

<style lang="scss" scoped>
.post-create{
  max-width: 600px;
}
.sport-preview-markdown{
  border: 1px solid #DCDFE6;
  border-radius: 4px;
  padding: 5px 25px;
  overflow-y: scroll;
  min-height: 33px;
  max-height: 250px;
  line-height: 1.5;
  font-size: 14px;
}
.sport-markdown-text-preview{
  margin-bottom: 4%;
}
.sport-preview-image{
  margin-bottom: 4%;
}
</style>
