<template>
  <v-main>
    <v-row justify="center" align="center">
        <v-col xs="12" md="8" lg="6">
            <v-card max-width="50%" color="#AFD7F2" style="margin:0px auto">
                <v-card-title>The teammates chat</v-card-title>
                <v-card-text>
                    <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                    >
                        <v-text-field
                        v-model="name"
                        :counter="16"
                        :rules="nameRules"
                        label="Enter your name"
                        required
                        ></v-text-field>

                        <v-text-field
                        v-model="room"
                        :rules="roomRules"
                        label="Enter room name"
                        required
                        ></v-text-field>

                        <v-btn
                        :disabled="!valid"
                        color="primary"
                        class="mr-4"
                        @click="submit"
                        style="color:rgba(210,236,253,1)"
                        >
                        Enter
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-col>
    </v-row>
    <v-row justify="center" align="center">
      <v-col xs="12" md="8" lg="6">
        <v-snackbar v-model="snackbar" color="#98B7FA" :timeout="7000" bottom class="snackbar-text">
          {{ message }}
          <v-divider></v-divider>
          <v-btn color="blue" @click="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  layout: 'chat/index',
  head: {
    title: 'Sports Chat'
  },
  sockets: {
    connect () {
      console.log('socket connected')
    },
    customEmit (data) {
      console.log('this method was fired by the socket server. eg: io.emit("customEmit", data)')
    }
  },
  data: () => ({
    snackbar: false,
    message: '',
    valid: true,
    name: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 16) || 'Name must be less than 16 characters'
    ],
    room: '',
    roomRules: [
      v => !!v || 'Room is required'
      // v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),
  methods: {
    ...mapMutations('chat', ['addUser']),
    submit () {
      if (this.$refs.form.validate()) {
        const user = {
          name: this.name,
          room: this.room
        }
        // Send data by socket to the server to get an unique ID of the user connection
        this.$socket.emit('userJoined', user, (data) => {
          // Server response if request was bad
          if (typeof data === 'string') {
            console.error(data)
          } else {
            // Good response
            // Sets the user id according to the socket
            user.id = data.userId
            // Use mutation from Vuex
            this.addUser(user)
            // Redirect User to the Chat
            this.$router.push('/chat/base-chat')
          }
        })
      }
    } /*,
    message () {
      // console.log('Ok')
      this.$socket.emit('createMessage', { text: 'From client' })
    } */
  },
  mounted () {
    const { message } = this.$route.query
    if (message === 'noUser') {
      this.message = 'User data is incomplete'
    } else if (message === 'leftChat') {
      this.message = 'You\'ve left the chat'
    }
    // If 'message' is nothing - then snackbar is false, but if string - true
    this.snackbar = !!this.message
  }
}
</script>

<style lang="scss">
.snackbar-text .v-snack__content{
  text-align: center;
  color: #000;
}
</style>
