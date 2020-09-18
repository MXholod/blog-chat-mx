<template>
  <v-card
    max-width="600"
    height="75px"
    class="mx-auto"
    :class="alignMessage"
  >
    <v-list v-if="name === 'admin'" class="admin">
      <v-list-item
        @click.prevent=""
        height="40px"
      >
        <v-list-item-avatar v-if="avatar">
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="message-content">
          <v-list-item-title class="message-content__name">
            <span>Name: </span>{{name}}
          </v-list-item-title>
          <v-list-item-subtitle class="message-content__time">
            <time>16:30</time>
          </v-list-item-subtitle>
          <v-list-item-subtitle class="message-content__text" v-html="text"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider
        v-if="divider"
        :inset="inset"
      ></v-divider>
    </v-list>

    <v-list v-else class="user" :class="{ owner }">
      <v-list-item
        @click.prevent=""
        height="40px"
      >
        <v-list-item-avatar v-if="avatar">
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>
        <v-list-item-content class="message-content">
          <v-list-item-title class="message-content__name">
            <span>Name: </span>{{name}}
          </v-list-item-title>
          <v-list-item-subtitle class="message-content__time">
            <time>16:30</time>
          </v-list-item-subtitle>
          <v-list-item-subtitle class="message-content__text" v-html="text"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-divider
        v-if="divider"
        :inset="inset"
      ></v-divider>
    </v-list>
  </v-card>
</template>

<script>
export default {
  props: {
    name: String,
    text: String,
    avatar: String,
    divider: { type: Boolean, default: false },
    inset: { type: Boolean, default: false },
    owner: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    alignMessage () {
      if (this.name === 'admin') {
        return 'admin'
      } else if (this.owner) {
        return 'owner-right-margin'
      } else {
        return 'visitor-left-margin'
      }
    }
  }
}
</script>

<style lang="scss">
.admin{
  background-color: pink !important;
  margin-top: 1% !important;
}
.v-application .owner-right-margin{
  margin-right: 0 !important;
  margin-top: 1% !important;
}
.v-application .visitor-left-margin{
  margin-left: 0 !important;
  margin-top: 1% !important;
}
/* owner - true | false */
.owner {
  background-color: #f6f6f6 !important;
  color: #000 !important;
}
.message-content{
  padding:0;
  display: flex;
  flex-direction: row;
  .message-content__name{
    max-width: none !important;
    flex-basis: 75% !important;
    padding: 2px 5px;
    font-size: 14px;
    text-decoration: underline;
    span{
      color: #000;
      font-weight: bold;
    }
  }
  .message-content__time{
    max-width: none !important;
    flex-basis: 25% !important;
    text-align: right;
    padding: 3px 5px 4px;
    font-size: 14px;
    time{
      padding: 0px 10px;
    }
  }
  .message-content__text{
    max-width: none !important;
    flex-basis: 100% !important;
    padding: 2px 5px;
    font-size: 14px;
    white-space: normal;
    color: rgba(0, 0, 0, 0.9) !important;
    text-indent: 2%;
  }
}
</style>
