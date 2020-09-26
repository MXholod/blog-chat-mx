<template>
    <el-card class="comment">
        <div class="comment__header">
            <span>Person name:</span>
            <small>
                <i class="el-icon-time">
                    {{ new Date().toLocaleString() }}
                </i>
            </small>
        </div>
        <div class="comment__text">
            Lorem ipsum dolor sit, amet consectetur adipisicing.
            Lorem, ipsum dolor.
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </div>
    </el-card>
</template>

<script>
export default {
  props: ['comment']
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
    }
    .comment__text{
        white-space: pre-line;
    }
</style>
