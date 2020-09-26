<template>
    <div class="el-error-page">
      <div class="el-error-page__error">
        <h1 v-if="error.statusCode === 404">404 <br /> Page not found</h1>
        <h1 v-else>An error occurred</h1>
      </div>
      <div class="el-error-page__description">
        <h2 class="info">
          {{ error.message }}
        </h2>
      </div>
      <div class="el-error-page__home">
        <nuxt-link class="el-error-page__button" to="/" v-if="error.statusCode === 404">
          Go to the homepage
        </nuxt-link>
      </div>
    </div>
</template>
<script>
export default {
  layout: 'base-error',
  props: ['error']
}
</script>

<style scoped>
.el-error-page{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.el-error-page__error{
  text-align: center;
  font-size: 1.2rem;
}
.el-error-page__description{
  background-color: #89bafa;
  padding: 5%;
  border-radius: 20%;
}
.el-error-page__home{
  min-height: 100px;
  padding-top: 5%;
}
.el-error-page__button{
  font-size: 1.2rem;
}
</style>
