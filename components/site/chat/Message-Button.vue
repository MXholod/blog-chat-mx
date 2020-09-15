<template>
    <v-btn
        rounded
        color="primary"
        dark
        @click="addMessage"
    >
        Add message
    </v-btn>
</template>

<script>
export default {
  methods: {
    addMessage () {
      console.log('Button add message')
    }
  }
}
</script>
