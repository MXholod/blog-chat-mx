<template>
  <v-main>
    <v-row justify="center" align="center">
        <v-col xs="12" md="8" lg="6">
            <v-card max-width="50%" color="#AFD7F2" style="margin:0px auto">
                <v-card-title>The teammates chat</v-card-title>
                <v-card-text>
                  <v-chip class="ma-2 sport-chip" color="primary" label>
                    <v-icon left>
                      mdi-account-circle-outline
                    </v-icon>
                    {{ currentName }}
                  </v-chip>
                  <v-select
                    v-if="rooms.length"
                    :items="rooms.map(room => room.name)"
                    label="Chat rooms"
                    @change="selectRoom"
                  ></v-select>
                  <v-chip
                    v-else
                    class="ma-2"
                    color="pink"
                    label
                    text-color="white"
                  >
                    <v-icon left>
                      mdi-compare-horizontal
                    </v-icon>
                    No rooms
                  </v-chip>
                  <v-btn depressed color="primary" small @click="roomEnter">
                    Enter chat
                  </v-btn>
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
    currentName: 'John Leider',
    currentRoom: '',
    rooms: [
      { name: 'funny', description: 'Funny is good' },
      { name: 'happy', description: 'Happy is good' }
    ],
    snackbar: false,
    message: ''
  }),
  methods: {
    ...mapMutations('chat', ['addUser']),
    selectRoom (roomName) {
      // roomName - current selected room as a String
      if (roomName) {
        const resultRoom = this.rooms.filter(room => room.name === roomName)
        // Assign current room name
        this.currentRoom = resultRoom[0].name
        // Show details about the current room
        this.message = resultRoom[0].description
        this.snackbar = true
      }
    },
    roomEnter () {
      /* eslint-disable */
        const user = {
          name: this.currentName,
          room: this.currentRoom
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
.v-card__text{
  .sport-chip{
    width:100%;
    margin: 0 auto!important;
  }
}
.snackbar-text .v-snack__content{
  text-align: center;
  color: #000;
}
</style>
