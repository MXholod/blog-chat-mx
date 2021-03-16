<template>
  <section class="container">
    <div>
      <h1 class="title">
        {{ title }}
      </h1>
    </div>
  </section>
</template>

<script>
export default {
  data(){
    return { title: "Users VUE" }
  },
  head () {
    return {
      title: `Test: ${this.title}`
    }
  },
  mounted() {
    console.log("ID ",this.$route.params);
  }
}
</script>

<style scoped>
.container {
  /*margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;*/
}
.title
{
  margin-top: 30px;
}
.header
{
  margin-top: 30px;
}
</style>
