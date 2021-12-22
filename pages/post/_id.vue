<template>
    <article class="post-details">
        <header class="post-details__header">
            <div class="post-details__title">
                <h1>{{ post.title }}</h1>
                <nuxt-link to="/">
                    <i class="el-icon-back"></i>
                </nuxt-link>
            </div>
            <div class="post-details__information">
                <small>
                    <i class="el-icon-time"></i>
                    {{ new Date(post.date).toLocaleString() }}
                </small>
                <small>
                    <i class="el-icon-view"></i>
                    {{ post.views }}
                </small>
            </div>
            <div class="post-details__img">
              <div>
                <el-image
                  class="post-details__el-image"
                  fit="scale-down"
                  :src="`/posts_img/${post.imageUrl}`"
                  :preview-src-list="post.postImage">
                </el-image>
              </div>
            </div>
        </header>
        <main class="post-details__content">
          <div v-html="$md.render(post.text)"></div>
        </main>
        <div class="likes">
          <div class="amount-likes-block">
            <b class="amount-likes">Amount of likes: {{ totalLikes }}</b>
          </div>
          <div class="process-like-block">
            <el-button @click="processLike"
              v-if="user.login !== ''"
              class="process-like"
              :loading="likeLoadingState"
              :disabled="likeLoadingState">
              <span :class="likeStateChanging ? 'like__img add-like__img' : 'like__img remove-like__img'"></span>
              <span class="add-like__text">
                {{ likeStateChanging ? 'Add like' : 'Cancel "like"' }}
              </span>
            </el-button>
            <el-badge v-else class="like-forbidden">
              Sign up/in to leave a like
            </el-badge>
          </div>
        </div>
        <footer class="post-details__comments">
            <div v-if="user.login">
              <blog-comment-form
                :postId="post._id"
                :login="user.login"
                @commentAdded="commentAddedHandler"
              />
            </div>
            <div v-else class="post-details__unathorized">
              You must be registered to leave a comment!
            </div>
            <div v-if="post.comments.length">
              <blog-comment
                v-for="comment in post.comments"
                :key="comment._id"
                :comment="comment"
              />
            </div>
            <div v-else class="post-details__comments-absent">
              Comments are absent
            </div>
        </footer>
    </article>
</template>

<script>
import BlogComment from '@/components/site/Comment'
import BlogCommentForm from '@/components/site/CommentForm'
import { mapState } from 'vuex';
export default {
  async asyncData({ store, params, redirect }){
    const jwt = store.getters['auth/isUserAuthenticated'].jwtToken;
    //Pass 'jwt' if user is authenticated to let 'like' the post
    const post = await store.dispatch('post/getPost', params.id, jwt);
    if(!post) return redirect('/');
    await store.dispatch('post/addView', post);
    const postImage = [`/posts_img/${post.imageUrl}`];
    return {
      post: { ...post, views: ++post.views, postImage },
      likeState: post.likeState,
      totalLikes: post.likes.length
    };
  },
  head () {
    return {
      title: `${this.post.title}`
    }
  },
  components: {
    BlogComment,
    BlogCommentForm
  },
  validate ({ params }) {
    return Boolean(params.id)
  },
  computed: {
    ...mapState('auth', ['user']) ,
    //If 'likeState' true - add like, otherwise remove like
    likeStateChanging(){
     if(this.likeState){
          return false;
        }
      else{
        return true;
      }
    }
  },
  data(){
    return {
      likeLoadingState: false
    }
  },
  methods: {
    commentAddedHandler (comment) {
      //Add new comment as the first in the list of comments
      this.post.comments.unshift(comment);
    },
    processLike(){
      this.likeLoadingState = true;
      window.setTimeout(async ()=>{
        try{
          let url = `/api/post/likes/${this.$route.params.id}`;
          const result = await this.$axios.$patch(url);
          if(result.likeState){
            this.likeState = true;
            this.totalLikes = ++this.totalLikes;
          }else{
            this.likeState = false;
            this.totalLikes = --this.totalLikes;
          }
        }catch(e){
            console.log(e);
          }finally{
            this.likeLoadingState = false;
          }
      },3000);
    }
  }
}
</script>

<style lang="scss">
.post-details{
    max-width: 600px;
    margin: 0 auto;
    .post-details__header{
        margin-bottom: 1.5rem;
        .post-details__title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        .post-details__information{
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;
        }
        .post-details__img{
          text-align: center;
          .post-details__el-image{
            .el-image-viewer__mask{
              opacity: .9;
            }
            .el-image-viewer__btn.el-image-viewer__close{
              color:#fff;
              transition: color 2s;
              &:hover, &:active{
                color:blue;
              }
            }
          }
        }
    }
    .post-details__content{
        margin-bottom: 2rem;
    }
    .post-details__comments{
    }
    .post-details__comments-absent{
        text-align: center;
    }
    .post-details__unathorized{
      margin-bottom: .8em;
      text-align: center;
      padding:3px 0px;
      border: 3px solid #999696;
      background-color: #d4d1d1;
    }
}
.likes{
    background: whitesmoke;
    padding: 2%;
    margin: 1%;
    box-shadow: 0px 0px 5px whitesmoke;
  &:after{
    content: '';
    display: block;
    clear:both;
  }
}
.amount-likes-block{
  width:70%;
  position: relative;
  top: 5px;
  float: left;
  .amount-likes{
    margin: 0 0 5% 65%;
  }
}
.process-like-block{
  width:30%;
  float: left;
  .process-like{
    margin: 0 0 0% 10%;
    border: 1px solid #000;
    border-radius: 5px;
    display: inline-flex;
    padding: .3em 1em;
    &:hover, &:active{
      background-color: #cfdffd;
      justify-content: space-around;
    }
  }
}
.like__img{
  margin-right: .5em;
  width:20px;
  height:20px;
  display:inline-block;
}
.add-like__img{
  background: transparent url('/site_images/likes.png') -21px 0px/40px 40px no-repeat padding-box border-box scroll;
}
.remove-like__img{
  background: transparent url('/site_images/likes.png') 0px -20px/40px 40px no-repeat padding-box border-box scroll;
}
.add-like__text{
  position: relative;
  top: -5px;
}
.like-forbidden{
  font-size: .8em;
  padding: 10px 0 15px 0;
  display: block;
  color: #f53aa2;
}
</style>
