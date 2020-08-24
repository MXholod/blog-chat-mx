<template>
  <div>
    {{ test }}
  </div>
</template>
<script>
export default {
  async asyncData ({ $http }) {
    const test = await $http.$get('/api/test')
    return {
      test
    }
  }
}
</script>

<style scoped>

</style>
