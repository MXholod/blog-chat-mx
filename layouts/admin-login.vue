<template>
    <div class="admin-login">
        <Nuxt />
    </div>
</template>

<script>
export default {
  name: 'admin-login',
  computed: {
    error () {
      return this.$store.getters['error/error']
    }
  },
  watch: {
    error (val) {
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.admin-login{
    display: flex;
    justify-content: center;
    width: 100%;
    padding-top: 4rem;
}
</style>
