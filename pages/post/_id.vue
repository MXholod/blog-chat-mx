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
                <img
                  :src="`/posts_img/${post.imageUrl}`"
                  alt="Post image detail"
                />
              </div>
            </div>
        </header>
        <main class="post-details__content">
          <div v-html="$md.render(post.text)"></div>
        </main>
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
    const post = await store.dispatch('post/getPost', params.id);
    if(!post) return redirect('/');
    await store.dispatch('post/addView', post);
    return { post: { ...post, views: ++post.views } };
  },
  components: {
    BlogComment,
    BlogCommentForm
  },
  validate ({ params }) {
    return Boolean(params.id)
  },
  computed: mapState('auth', ['user']),
  methods: {
    commentAddedHandler (comment) {
      //Add new comment as the first in the list of comments
      this.post.comments.unshift(comment);
    }
  }
}
</script>

<style lang="scss" scoped>
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
              div{
                width: 300px;
                margin: 0 auto;
                img{
                    width: 100%;
                    min-height: auto;
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
</style>
