<template>
  <div class="chat-sport-content__main">
    <message-system :systemMessage="systemMessage"></message-system>
    <div class="chat-sport-content__messages" ref="blockScroll">
      <Message
        v-for="message of messagesFromDB"
        :key="message._id"
        :owner="message.user === user.userId"
        :name="message.name"
        :text="message.text"
        :date="message.date"
        :avatar="message.avatar"
        :role="message.role"
        :divider="message.divider"
        :inset="message.inset"
        />
    </div>
    <div class="chat-sport-content__control">
      <div class="chat-sport-content__msg">
        <message-form
          :userId="id"
          :roomId="currentRoom"
          :avatar="avatar"
          :role="role"
        ></message-form>
      </div>
      <div class="chat-sport-content__btn">
        <message-button></message-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import MessageSystem from '@/components/site/chat/Message-System'
import Message from '@/components/site/chat/Message'
import MessageForm from '@/components/site/chat/Message-Form'
import MessageButton from '@/components/site/chat/Message-Button'
export default {
  async asyncData(context){
    let jwt = context.store.getters['auth/isUserAuthenticated'].jwtToken;
    //'$isAllowedByRole' is a function from Plugin
    const { role, sessionEnd, avatar, id } = await context.app.$isAllowedByRole(jwt);
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
      const id = context.store.state.chat.currentRoom.id;
      //Get all messages for the current room.
      result = await context.app.$axios.$get('/api/chat_message/room/message/'+id);
    }
    if(result){//Access token is active
      result = result.messages.map((msg)=> {
        const tempProp = msg.userName;
        delete msg.userName;
        msg['name'] = tempProp;
        return msg;
      });
      return {
        userLogoutRefresh: sessionEnd ? true : false,
        avatar,
        id,
        messagesFromDB: result,
        role
      };
    }else{//Axios 'jwt' access failed
      return {
        userLogoutRefresh: sessionEnd ? true : false,
        avatar: '',
        id: '',
        messagesFromDB: [],
        role: ''
      };
    }
  },
  layout: 'chat/base-chat',
  components: { Message, MessageForm, MessageButton, MessageSystem },
  computed: {
    ...mapState('chat', ['user', 'systemMessage', 'currentRoom']),
    messages(){
      //console.log("Messages ",this.$store.state.chat.messages);
      return this.$store.state.chat.messages;
    }
  },
  head () {
    return {
      title: `The room name is ${this.user.room}`
    }
  },
  watch: {
    messages (val) {
      //Always get the last element from the state of messages
      let lastEl = val[(val.length - 1)];
      this.messagesFromDB.push(lastEl);
      // setTimeout is needed to make a little pause before message will be inserted
      // setTimeout(() => {
      this.$nextTick(() => {
        // scrollToop - amount of pixeles from the top of the element
        // scrollHeight - all scrolled contentof the element
        this.$refs.blockScroll.scrollTop = this.$refs.blockScroll.scrollHeight
      // })
      })
    }
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
      //this.currentName = this.isUserAuthenticated.login;
    }
  }
}
</script>
<style lang="scss" scoped>
  .chat-sport-content__main{
    height:100%;
    background-color: #93B4F9;
    position: relative;
    overflow: hidden;
  }
  .chat-sport-content__messages{
    height:75%;
    overflow-y: auto;
  }
  .chat-sport-content__control{
    display: flex;
    flex-direction: row;
    height:25%;
    .chat-sport-content__msg{
      width:75%;
      padding-left: 2%;
    }
    .chat-sport-content__btn{
      width:25%;
      display: flex;
      justify-content: center;
      padding-top: 1%;
    }
  }
</style>
