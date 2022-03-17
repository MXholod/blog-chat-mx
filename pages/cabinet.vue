<template>
  <div class="cabinet">
    <el-row v-if="role">
      <el-col :span="6">
        <div class="user-cabinet">
          <div class="user-cabinet__login">
            <span>{{ isUserAuthenticated.login }}'s</span> cabinet
          </div>
          <div class="user-cabinet__role">
            <div>
              Your role is: <span>{{ isUserAuthenticated.role }}</span>
            </div>
            <p v-if="role === 'admin' || role === 'moderator'">
              <NuxtLink to="/admin">Go to admin page</NuxtLink>
            </p>
            <p v-else>Welcome guest {{ isUserAuthenticated.login }} to your cabinet</p>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <el-tabs style="height: 200px;" v-model="activeName" @tab-click="handleTabs">
          <el-tab-pane label="User information" name="userInfo">
            <avatar :imageLink="avatar" />
          </el-tab-pane>
          <el-tab-pane label="Blog statistics" name="blog">
            <posts-with-comments-list ref="postsComments" />
          </el-tab-pane>
          <el-tab-pane label="Chat statistics" name="chat">
            <rooms-with-messages-list ref="roomsMessages" />
          </el-tab-pane>
          <el-tab-pane label="Security" name="security">
            <change-user-name />
            <change-user-password />
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="6">
        <div class="chat-status">
          <p>User ban status in chat</p>
          <el-tag v-if="!chatBan" class="chat-tag" type="success">You may visit the chat</el-tag>
          <el-tag v-else class="chat-tag" type="danger">The chat access is not allowed</el-tag>
        </div>
      </el-col>
    </el-row>
    <el-row v-else>
      <el-col :span="24">
        <p style="textAlign:center">You do not have enough permissions to view the content</p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import ChangeUserName from './../components/site/user_cabinet/ChangeUserName';
import ChangeUserPassword from './../components/site/user_cabinet/ChangeUserPassword';
import Avatar from '../components/site/user_cabinet/avatar/Avatar.vue';
import RoomsWithMessagesList from '../components/site/user_cabinet/RoomsWithMessagesList.vue';
import PostsWithCommentsList from '../components/site/user_cabinet/PostsWithCommentsList.vue';
export default {
  async asyncData ({ store, app, redirect }) {
    let jwt = store.getters['auth/isUserAuthenticated'].jwtToken;
    //'$isAllowedByRole' is a function from Plugin
    const { role, sessionEnd, avatar, chatBan } = await app.$isAllowedByRole(jwt);
    let access = false;
    if(role === 'guest' || role === 'moderator' || role === 'admin'){
      access = true;
    }
    if((!access || role === '') && !sessionEnd){
      if(store.getters['auth/isUserAuthenticated'].role !== ''){
        store.dispatch('auth/logout');
      }
      redirect('/');
    }
    return {
      userLogoutRefresh: sessionEnd ? true : false,
      role,
      avatar, //'undefined' or 'image name'
      chatBan
    };
  },
  head () {
    return {
      title: `${this.isUserAuthenticated.login}'s cabinet`
    }
  },
  //middleware:['user-auth'],
  layout: 'user-cabinet',
  components: {
    ChangeUserName,
    ChangeUserPassword,
    Avatar,
    RoomsWithMessagesList,
    PostsWithCommentsList
  },
  data() {
    return {
      activeName: 'userInfo'
    };
  },
  computed: {
    ...mapGetters('auth',['isUserAuthenticated'])
  },
  methods: {
    ...mapMutations('auth', ['updateChatBan']),
    handleTabs(tab, event){
      if(tab.name === 'blog'){
        //Calling child component method with 'ref'
        this.$refs.postsComments.getAllPostsWithComments();
      }
      if(tab.name === 'chat'){
        //Calling child component method with 'ref'
        this.$refs.roomsMessages.getAllRoomsWithMessages();
      }
    }
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
    //Use Mutation
    this.updateChatBan(this.chatBan);
    //If the user was logout from the chat
    const { message } = this.$route.query;
    if(message === 'chatDenied'){
      this.$message.warning('Chat access denied');
    }
  }
}
</script>

<style lang="scss" scoped>
.user-cabinet{
  %login-role{
    padding: 5px;
    border-radius: 5px;
    border: 2px solid #225AA4;
    width:80%;
    font-size: 1em;
    font-family: Verdana, Tahoma, sans-serif;
  }
  .user-cabinet__login{
    @extend %login-role;
    background-color: #b0c9f7;
    span{
      font-size: 1.2em;
      font-weight: bold;
    }
  }
  .user-cabinet__role{
    @extend %login-role;
    width:70%;
    margin: -2px 0 0 5%;
    font-size: .9em;
    background-color: #d0defb;
    div:first-child{
      span{
        font-size: 1em;
        font-weight: bold;
      }
    }
    p{
      a{
        color: #2493f3;
        display: inline-block;
        width: 100%;
        text-align: center;
      }
    }
  }
}
.chat-status{
  p{
     width: 70%;
     margin:0 auto .5em;
     text-align: center;
     font-weight: bold;
  }
  padding: .5em;
  .chat-tag{
    width: 100%;
    height: 2.5em;
    font-size: 1.1em;
    margin-left: 3%;
  }
}
</style>
