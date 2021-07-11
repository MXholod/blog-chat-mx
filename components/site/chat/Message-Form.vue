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
  props:{
    userId: { type: String, default: '' },
    roomId: { type: Object },
    avatar: { type: String, default: '' },
    role: { type: String, default: '' }
  },
  data () {
    return {
      formText: ''
    }
  },
  methods: {
    addMessage () {
      this.$socket.emit('createMessage', {
        userId: this.userId,
        roomId: this.roomId.id,
        text: this.formText,
        avatar: this.avatar,
        role: this.role
      }, (data) => {
        if (typeof data === 'string') {
          console.error(data)
        } else {
          this.formText = ''
        }
      })
    }
  },
  created () {
    // This listener is not needed in SSR-mode - if (process.client) {}
    this.$eventBus.$on('addMessage', () => {
      // Add a message by button's click
      this.addMessage()
    })
  },
  beforeDestroy () {
    // make sure to always unsubscribe from events when no longer needed
    this.$eventBus.$off('addMessage')
  }
}
</script>
