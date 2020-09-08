<template>
    <h1>Visitor name is: {{ user.name }}</h1>
</template>

<script>
import { mapState } from 'vuex'
export default {
  middleware: ['chat'],
  computed: mapState(['user']),
  head () {
    return {
      title: `The room name is ${this.user.room}`
    }
  }
}
</script>
