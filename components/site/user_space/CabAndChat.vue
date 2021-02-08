<template>
    <div class="user-space-cab-chat">
      <div class="user-space-cab-chat__text">
        User name:
        <span class="user-space-cab-chat__login">{{ userLogin }}</span>
      </div>
      <el-menu
            router
            class="el-menu-cab-chat-sport"
            mode="horizontal"
            background-color="#225AA4"
            text-color="#fff"
          >
        <el-menu-item index="/cabinet" class="sport-item__cabinet el-icon-user-solid"></el-menu-item>
        <el-menu-item index="/chat" class="sport-item__chat">Teammates chat</el-menu-item>
        <el-menu-item class="sport-item__log-out" @click.native="userLogOutHandler">Log out</el-menu-item>
      </el-menu>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  props: { userLogin : String },
  methods: {
    userLogOutHandler(){
      this.userLogOutMethod();
      this.$router.push('/');
    },
    ...mapMutations('auth',{
      userLogOutMethod: 'userLogOut'
    })
  }
}
</script>

<style lang="scss" scoped>
.user-space-cab-chat{
  display: flex;
  flex-direction:column;
}
.user-space-cab-chat__text{
  height: 30px;
  font-size: 0.9em;
  font-weight: bold;
  padding-left: 1.5em;
  padding-top: 0.5em;
  border-left:1px solid #fff;
  border-bottom:1px solid #fff;
  text-shadow: 0.5px 0.5px 8px #fff;
  .user-space-cab-chat__login{
    font-size: 1em;
    color: #fff;
    padding-left: 1em;
    text-shadow: 2px 3px 3px #000;
  }
}
.el-menu-cab-chat-sport{
  height: 50px;
}
.el-icon-user-solid::before{
  color:#fff;
}
  %item-cab-chat{
    padding: 0px 0px 0px 0px;
    text-align: center;
    height: 49px;
    &.is-active{
      border-bottom: none;
      color: transparent;
    }
  }
.sport-item__cabinet{
  width:23%;
  @extend %item-cab-chat;
}
.sport-item__chat{
  width:43%;
  @extend %item-cab-chat;
}
.sport-item__log-out{
  width:33%;
  @extend %item-cab-chat;
}
</style>
