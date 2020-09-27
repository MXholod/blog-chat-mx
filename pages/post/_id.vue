<template>
    <article class="post-details">
        <header class="post-details__header">
            <div class="post-details__title">
                <h1>Post id</h1>
                <nuxt-link to="/">
                    <i class="el-icon-back"></i>
                </nuxt-link>
            </div>
            <div class="post-details__information">
                <small>
                    <i class="el-icon-time"></i>
                    {{ new Date().toLocaleString() }}
                </small>
                <small>
                    <i class="el-icon-view"></i>
                    17
                </small>
            </div>
            <div class="post-details__img">
                <img
                    src="/posts_img/sport_balls.jpg"
                    alt="Post image detail"
                    />
            </div>
        </header>
        <main class="post-details__content">
            <p>Lorem ipsum dolor sit,
                amet consectetur adipisicing elit.
            </p>
        </main>
        <footer class="post-details__comments">
            <blog-comment-form
              v-if="commentAllowed"
              @commentAdded="commentAddedHandler"
            />
            <div v-if="true">
                <blog-comment
                    v-for="(comment, ind) in 2"
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
