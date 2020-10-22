<template>
    <h1>Process of logout...</h1>
</template>

<script>
export default {
  layout: 'admin',
  middleware: ['admin-auth'],
  beforeCreate () {
    this.$store.dispatch('auth/logout')
    this.$router.push('/login?message=admin-logout')
  }
}
</script>
