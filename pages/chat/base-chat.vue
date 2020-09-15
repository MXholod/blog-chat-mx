<template>
  <div class="chat-sport-content__main">
    <div class="chat-sport-content__messages">
      <Message
        v-for="(message,ind) of messages"
        :key="message.title + ind"
        :owner="true"
        :name="message.name"
        :text="message.text"
        :title="message.title"
        :subtitle="message.subtitle"
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
import Message from '@/components/site/chat/Message'
import MessageForm from '@/components/site/chat/Message-Form'
import MessageButton from '@/components/site/chat/Message-Button'
export default {
  layout: 'chat/base-chat',
  middleware: ['chat'],
  components: { Message, MessageForm, MessageButton },
  computed: mapState(['user', 'messages']),
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
    background-color: violet;
  }
  .chat-sport-content__messages{
    height:75%;
    background-color: blue;
    overflow-y: auto;
  }
  .chat-sport-content__control{
    display: flex;
    flex-direction: row;
    height:25%;
    background-color:yellowgreen;
    .chat-sport-content__msg{
      width:75%;
      background-color:brown;
    }
    .chat-sport-content__btn{
      width:25%;
      background-color:chocolate;
    }
  }
</style>
