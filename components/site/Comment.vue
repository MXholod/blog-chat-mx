<template>
    <el-card class="comment">
        <div class="comment__header">
            <div>Person name: <span>{{ comment.name }}</span></div>
            <small>
                <i class="el-icon-time">
                  {{ new Date(comment.date).toLocaleString() }}
                </i>
            </small>
        </div>
        <div class="comment__text">
          {{ comment.text }}
        </div>
    </el-card>
</template>

<script>
export default {
  props: { comment: { type: Object, required: true } }
}
</script>

<style lang="scss" scoped>
    .comment{
        margin-bottom: 1rem;
    }
    .comment__header{
        display:flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        border-bottom: 1px solid #ccc;
        div:first-child{
          font-size: .9em;
          font-weight: bold;
          span{
            color: #225aa4;
            font-size: 1em;
          }
        }
    }
    .comment__text{
      white-space: pre-line;
      font-family: Tahoma, Geneva, Verdana, sans-serif;
      font-size: .9em;
    }
</style>
