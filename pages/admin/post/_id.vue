<template>
    <div>
      <div v-if="!post">
        <h3>The Post is not available</h3>
      </div>
      <div v-else>
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
            <el-form-item label="Post title" prop="ptitle">
                <el-input
                    placeholder="Post title"
                    v-model="ruleForm.ptitle">
                </el-input>
            </el-form-item>
            <el-form-item label="Post text" prop="ptext">
                <el-input
                    placeholder="Post text"
                    type="textarea"
                    :rows="10"
                    v-model="ruleForm.ptext">
                </el-input>
            </el-form-item>
            <image-loader
              :imageLink="imageUrl"
              :onDeleteSingleImage="deleteSingleImage"
              v-on:onSingleImage="onSingleImage"
              ref="toClearUpload"
            />
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
    </div>
</template>

<script>
import ImageLoader from '~/components/admin/admin_post_management/ImageLoader';
export default {
  async asyncData (context) {
    let jwt = context.store.getters['auth/isUserAuthenticated'].jwtToken;
    //'$isAllowedByRole' is a function from Plugin
    let userData = await context.app.$isAllowedByRole(jwt);
    if(userData.role === 'guest'){
      context.redirect('/cabinet');
    }
    if(userData.role === '' && !userData.sessionEnd){
      if(context.store.getters['auth/isUserAuthenticated'].role !== ''){
        context.store.dispatch('auth/logout');
      }
      context.redirect('/');
    }
    let post = null;
    //If we have role: 'admin' or 'moderator'
    if(userData.role && !userData.sessionEnd){
      post = await context.store.dispatch('post/editAdminPost', context.params.id)
      //If Post doesn't exist go back to the list of Posts
      if(!post) return context.redirect('/admin/list');
    }
    return {
      post,
      userLogoutRefresh: userData.sessionEnd ? true : false
    };
  },
  layout: 'admin',
  components:{
    ImageLoader
  },
  head () {
    return { title: this.post ? `Post | ${this.post.title}` : 'Post' }
  },
  validate ({ params }) {
    return Boolean(params.id)
  },
  data () {
    return {
      loading: false,
      imageUrl: '',
      postId:'',
      singleImage: null,
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
        if (valid && (this.postId !== '')) {
          this.loading = true;
          // Prepare form data
          const formData = {
            title: this.ruleForm.ptitle.trim(),
            text: this.ruleForm.ptext.trim(),
            id: this.postId,
            imageUrl: this.imageUrl,
            singleImage: this.singleImage
          };
          try {
            const result = await this.$store.dispatch('post/updateAdminPost', formData);
            if(!result){
              throw new Error("The Post hasn't been updated");
            }
            this.imageUrl = result.imageUrl;
            this.$message.success('Post has updated');
          } catch (e) {
            this.$message({
              showClose: true,
              message: e.message,
              type: 'warning'
            })
          }finally{
            //Clear uploaded image in Child Component
            this.$refs.toClearUpload.clearUpload();
            this.loading = false;
            this.singleImage = null;
          }
        } else {
          // console.log('Form is invalid')
        }
      })
    },
    //Get the Image as an object
    onSingleImage(dataImg){
      this.singleImage = dataImg.singleImage;
    },
    //Reset by default the Image object
    deleteSingleImage(){
      this.singleImage = null;
    }
  },
  created(){
    //Text of the Post
    this.ruleForm.ptitle = this.post ? this.post.title : '';
    this.ruleForm.ptext = this.post ? this.post.text : '';
    this.imageUrl = this.post ? this.post.imageUrl : '';
    this.postId = this.post ? this.post._id : '';
  },
  mounted(){
    //Displaying the modal window to inform user about the end of the session
    if(this.userLogoutRefresh){
      this.$alert('Your session is up!', 'Session state', {
        confirmButtonText: 'Sign in again',
        showClose:false,
        callback: action => {
          this.$store.dispatch('auth/logout');
          this.$router.push('/login?message=unauthenticated');
        }
      });
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
