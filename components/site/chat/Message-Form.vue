<template>
    <v-text-field
        label="Message text"
        color="#0C1E44"
        outlined
        v-model="formText"
        @keydown.enter="addMessage"
        background-color="#ADC3EF"
    ></v-text-field>
</template>

<script>
export default {
  data () {
    return {
      formText: ''
    }
  },
  methods: {
    addMessage () {
      // console.log('Result is: ', this.formText)
      this.$socket.emit('createMessage', {
        id: this.$store.state.user.id,
        name: 'admin',
        text: this.formText
      }, (data) => {
        if (typeof data === 'string') {
          console.error(data)
        } else {
          this.formText = ''
        }
      })
    }
  }
}
</script>
