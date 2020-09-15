<template>
    <v-text-field
        label="Outlined"
        outlined
        v-model="formText"
        @keydown.enter="addMessage"
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
          this.text = ''
        }
      })
    }
  }
}
</script>
