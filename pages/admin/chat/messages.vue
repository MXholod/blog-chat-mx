<template>
  <div>
    <h1>List of messages</h1>
    <el-tabs type="card" v-model="activeName" @tab-click="handleClickTab">
      <el-tab-pane label="Info about messages" name="info">
        Here you can manage chat messages
      </el-tab-pane>
      <el-tab-pane label="All chat messages" name="all">
        <el-button v-if="!Array.isArray(rooms)" size="mini" @click="loadRoomsAgain">
          Load messages again
        </el-button>
        <el-alert v-else-if="Array.isArray(rooms) && rooms.length == 0"
          title="Rooms with messages are absent"
          type="warning"
          :closable="false">
        </el-alert>
        <el-collapse v-else @change="handleChangeRoom">
          <el-collapse-item
            v-for="room in rooms"
            :key="room.id"
            :title="'Room: '+room.roomName+' / Total messages: '+room.totalMessages+' / Current page: '+room.currentPage"
            :name="room.roomName"
            class="chat-messages-collapse"
          >
            <chat-messages
              :roomId="room.id"
              :messages="room.messages"
              :deleteChosenMessage="deleteChosenMessage"
              @onCurrentPage="setCurrentPage"
              class="chat-messages"
            />
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane v-if="isUserAuthenticated.role == 'admin'" label="System messages" name="system">
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import chatMessages from '../../../components/admin/admin_chat_msg_management/chat-messages.vue';
import { mapGetters } from 'vuex';
export default {
  async asyncData(context){
    let jwt = context.store.getters['auth/isUserAuthenticated'].jwtToken;
    //'$isAllowedByRole' is a function from Plugin
    let userData = await context.app.$isAllowedByRole(jwt);
    if(userData.role === 'guest'){
      context.redirect('/cabinet');
    }
    if(userData.role === '' && !userData.sessionEnd){
      if(context.store.getters['auth/isUserAuthenticated'].role !== ''){
        context.store.dispatch('auth/logout');
      }
      context.redirect('/');
    }
    let rooms = null;
    try{
      const result = await context.$axios.$get('/api/chat_room/admin/rooms/chat_messages');
      rooms = result.rooms;
      //console.log(result.rooms);
    }catch(e){
      //console.log(e);
    }
    return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      rooms
    };
  },
  layout: 'admin',
  name: 'messages',
  components:{
    chatMessages
  },
  data(){
    return {
      activeName: ""
    }
  },
  computed:{
    ...mapGetters('auth', ['isUserAuthenticated'])
  },
  methods: {
    handleClickTab(tab, event) {
      //console.log(tab, event);
      //console.log("Info ",this.isUserAuthenticated.role);
    },
    handleChangeRoom(val) {
      //console.log(val);
    },
    setCurrentPage(dataRoom){
      this.rooms = this.rooms.map( room => {
        if(dataRoom.roomId === room.id){
          return { ...room, currentPage: dataRoom.currentPage }
        }
        return room;
      });
      //Update template by force
      this.$forceUpdate();
    },
    async deleteChosenMessage(roomId, messageId){
      try{
        await this.$axios.$delete('/api/chat_room/admin/rooms/chat_message',{
          data: { messageId }
        });
        //
        let tempRooms = [];
        this.rooms.forEach( room => {
          if(room.id === roomId){
            //Edit messages in this component
            room.messages = room.messages.filter( msg => {
              return msg.id !== messageId;
            });
            room.totalMessages = room.messages.length;
          }
          tempRooms.push(room);
        });
        this.rooms = tempRooms;
        this.$forceUpdate();
      }catch(e){
        console.log("Error ",e);
      }
    },
    async loadRoomsAgain(){
      try{
        const result = await this.$axios.$get('/api/chat_room/admin/rooms/chat_messages');
        this.rooms = result.rooms;
      }catch(e){
        console.log(e);
      }
    }
  },
  created(){
    // []; || null;
    /*this.rooms = this.rooms2.map( room => {
      return { ...room, totalMessages: room.messages.length };
    });*/
  },
  mounted(){
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
    }
  }
}
</script>

<style lang="scss">
.chat-messages-collapse:nth-child(2n+1){
  background-color: #d5dcf6;
}
.chat-messages-collapse:nth-child(2n+2){
  background-color: #cfb7f6;
}
/* Override background color */
.el-collapse-item__header{
  background-color: transparent;
  padding-left: .5em;
}
.chat-messages{
  background-color: #f6f6f6;
  border: 2px solid #c3bebe;
}
</style>
