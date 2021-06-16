<template>
    <el-card
        shadow="hover"
        :body-style="{padding: 0}"
        class="post">
        <header slot="header" class="post__header">
            <h1>{{ post.title }}</h1>
            <small>
                <i class="el-icon-time"></i>
                {{ new Date(post.date).toLocaleString() }}
            </small>
        </header>
        <div class="post__body">
            <img
                :src="`/posts_img/${post.imageUrl}`"
                alt="Post image"
                class="post__img"
                />
        </div>
        <footer class="post__footer">
            <el-button round @click="openPost">Open post</el-button>
            <span>
                <i class="el-icon-message"></i>
                {{ post.comments.length }}
            </span>
        </footer>
    </el-card>
</template>

<script>
export default {
  props: {
    post: { type: Object, required: true }
  },
  methods: {
    openPost(){
      this.$router.push(`/post/${this.post._id}`);
    }
  }
}
</script>

<style lang="scss">
    .post{
        min-height:200px;
        border: 1px solid #000;
        margin-bottom: 2rem;
        .post__header{
            display: flex;
            justify-content: space-between;
            align-items: center;
            small{
              text-align: center;
            }
        }
        .post__body{
            width: 200px;
            margin: 5px auto;
            .post__img{
              width: 100%;
              min-height: auto;
            }
        }
        .post__footer{
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
        }
    }
</style>
