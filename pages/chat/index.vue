<template>
  <v-main>
    <v-row justify="center" align="center">
        <v-col xs="12" md="8" lg="6">
            <v-card v-if="tryAgainMessage" max-width="50%" color="#AFD7F2" style="margin:0px auto">
              <v-card-title>{{ tryAgainMessage }}</v-card-title>
              <v-card-text>
                <v-btn depressed color="primary" small @click="getRoomsAgain">
                  Click to try to load rooms
                </v-btn>
              </v-card-text>
            </v-card>
            <v-card v-else max-width="50%" color="#AFD7F2" style="margin:0px auto">
                <v-card-title>The teammates chat</v-card-title>
                <v-card-text>
                  <v-chip class="ma-2 sport-chip" color="primary" label>
                    <v-icon left>
                      mdi-account-circle-outline
                    </v-icon>
                    {{ currentName }}
                  </v-chip>
                  <div v-if="rooms.length">
                    <v-select
                      :items="rooms.map(room => room.name)"
                      label="Chat rooms"
                      @change="selectRoom"
                    ></v-select>
                    <v-btn
                      :disabled="!currentRoom"
                      depressed color="primary" small @click="roomEnter">
                      Enter chat
                    </v-btn>
                  </div>
                  <v-chip
                    v-else
                    class="ma-2 ml-8"
                    color="pink"
                    label
                    text-color="white"
                  >
                    <v-icon left>mdi-close-circle</v-icon>
                    'There are no rooms'
                  </v-chip>
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
import { mapMutations, mapGetters } from 'vuex';
export default {
  async asyncData(context){
    let jwt = context.store.getters['auth/isUserAuthenticated'].jwtToken;
    //'$isAllowedByRole' is a function from Plugin
    const { role, sessionEnd, id } = await context.app.$isAllowedByRole(jwt);
    let access = false;
    if(role === 'guest' || role === 'moderator' || role === 'admin'){
      access = true;
    }
    if((!access || role === '') && !sessionEnd){
      if(context.store.getters['auth/isUserAuthenticated'].role !== ''){
        context.store.dispatch('auth/logout');
      }
      context.redirect('/');
    }
    let result;
    if(access && !sessionEnd){
      //Get all rooms. The result can be 'undefined' if jwt access has expired
      result = await context.app.$axios.$get('/api/chat_room/rooms');
    }
    if(result){//Access token is active
      return {
        userLogoutRefresh: sessionEnd ? true : false,
        rooms: result.rooms,
        tryAgainMessage: null,
        id
      };
    }else{//Axios 'jwt' access failed
      return {
        userLogoutRefresh: sessionEnd ? true : false,
        rooms: [],
        tryAgainMessage: 'Get a list of rooms again',
        id
      };
    }
  },
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
  data(){
    return {
      currentName: '',//User name
      snackbar: false,
      currentRoomId:'',//Room id
      currentRoom: '',//Room name
      message: ''//Room description
    }
  },
  computed:{
    ...mapGetters('auth', ['isUserAuthenticated'])
  },
  methods: {
    ...mapMutations('chat', ['addUser', 'addCurrentRoom']),
    selectRoom (roomName) {
      // roomName - current selected room as a String
      if (roomName) {
        const resultRoom = this.rooms.filter(room => room.name === roomName);
        // Assign current room name
        this.currentRoom = resultRoom[0].name;
        // Assign current room id
        this.currentRoomId = resultRoom[0]._id;
        // Show details about the current room
        this.message = resultRoom[0].description;
        this.snackbar = true;
      }
    },
    roomEnter () {
      /* eslint-disable */
        const user = {
          name: this.currentName,
          room: this.currentRoom,
          userId: this.id
        }
        //
        this.addCurrentRoom({
          id: this.currentRoomId, //Room id
          name: this.currentRoom, //Room name
          description: this.message //Room description
        });
        // Send data by socket to the server to get an unique ID of the user connection
        this.$socket.emit('userJoined', user, (data) => {
          // Server response if request was bad
          if (typeof data === 'string') {
            console.error(data);
          } else {
            // Good response
            // Sets the user id according to the socket
            //user.userSocketId = data.userSocketId
            user.userId = this.id;
            // Use mutation from Vuex
            this.addUser(user);
            // Redirect User to the Chat
            this.$router.push('/chat/base-chat');
          }
        })
    },
    async getRoomsAgain(){
      try{
        //Get all rooms. The result can be 'undefined' if jwt access has expired
        let result = await this.$axios.get('/api/chat_room/rooms');
        let conditionTwo = result?.response?.data?.rooms.length === 0;
        result = result?.data;
        if(result && (result.rooms.length > 0)){
          this.rooms = result.rooms;
          this.tryAgainMessage = null;
        }else if(conditionTwo){
          this.rooms = [];
          this.tryAgainMessage = null;
          this.$message({
            showClose: true,
            message: "There aren't any rooms",
            type: 'warning'
          });
        }else if(result === undefined){
          this.tryAgainMessage = 'Get a list of rooms again';
          this.$message({
            showClose: true,
            message: "Click to load the list of rooms",
            type: 'warning'
          });
        }
      }catch(e){
        //console.log("Error ",e.message);
      }
    }
     /*,
    message () {
      // console.log('Ok')
      this.$socket.emit('createMessage', { text: 'From client' })
    } */
  },
  mounted () {
    //Displaying the modal window to inform user about the end of the session
    if(this.userLogoutRefresh){
      this.$alert('Your session is up!', 'Session state', {
        confirmButtonText: 'Sign in again',
        showClose:false,
        callback: action => {
          this.$store.dispatch('auth/logout');
          this.$router.push('/login?message=unauthenticated');
        }
      });
    }else{
      //Get User name from store
      this.currentName = this.isUserAuthenticated.login;
      //
      const { message } = this.$route.query
      if (message === 'noUser') {
        this.message = 'User data is incomplete'
      } else if (message === 'leftChat') {
        this.message = 'You\'ve left the chat'
      }
      // If 'message' is nothing - then snackbar is false, but if string - true
      this.snackbar = !!this.message;
    }
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
