<template>
  <div class="chat-sport-content__main">
    <message-system :systemMessage="systemMessage"></message-system>
    <div class="chat-sport-content__messages">
      <Message
        v-for="(message,ind) of messages"
        :key="ind"
        :owner="message.id === user.id"
        :name="message.name"
        :text="message.text"
        :avatar="message.avatar"
        :divider="false"
        :inset="false"
        />
    </div>
    <div class="chat-sport-content__control">
      <div class="chat-sport-content__msg">
        <message-form></message-form>
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
  layout: 'chat/base-chat',
  middleware: ['chat'],
  components: { Message, MessageForm, MessageButton, MessageSystem },
  computed: mapState(['user', 'messages', 'systemMessage']),
  head () {
    return {
      title: `The room name is ${this.user.room}`
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
