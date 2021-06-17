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
                <img
                  :src="`/posts_img/${post.imageUrl}`"
                  alt="Post image detail"
                />
            </div>
        </header>
        <main class="post-details__content">
          <div v-html="$md.render(post.text)"></div>
        </main>
        <footer class="post-details__comments">
            <blog-comment-form
              v-if="commentAllowed"
              @commentAdded="commentAddedHandler"
            />
            <div v-if="post.comments.length">
                <blog-comment
                    v-for="(comment, ind) in post.comments"
                    :key="ind"
                    :comment="comment"
                ></blog-comment>
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
  data () {
    return {
      commentAllowed: true
    }
  },
  methods: {
    commentAddedHandler () {
      this.commentAllowed = false
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
                img{
                    width: 100%;
                    min-height: auto;
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
    }
</style>
