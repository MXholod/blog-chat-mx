<template>
  <div class="room-creation">
    <h1>System message from admin or moderator to the chat</h1>
    <div v-if="!Array.isArray(rooms)">
      <el-button @click="loadRoomsAgain">Try load rooms again</el-button>
    </div>
    <div v-else-if="Array.isArray(rooms) && (rooms.length === 0)">
      <p style="padding:10px;">Chat rooms are absent</p>
    </div>
    <el-form v-else :model="systemMessage" status-icon :rules="rules" ref="systemMessageForm" label-width="120px" class="system-message__form">
      <el-form-item label="System message title" prop="title">
        <el-input v-model="systemMessage.title" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="System message text" prop="text">
        <el-input type="textarea" v-model="systemMessage.text" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="List of chat rooms">
        <el-select v-model="systemMessage.room" placeholder="Choose a room">
          <el-option v-for="room in rooms"
            :key="room._id"
            :label="room.name"
            :value="room.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading" :disabled="loading"
          type="primary" @click="submitForm('systemMessageForm')">
            Submit
        </el-button>
        <el-button :disabled="loading"
          @click="resetForm('systemMessageForm')">
          Reset
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
      let result = await context.$axios.$get('/api/chat_room/admin/rooms');
      if(result && result.rooms){
        rooms = result.rooms;
      }else{
        console.log(result.rooms);
      }
    }catch(e){
      //console.log(e);
    }

    return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      rooms,
      id: userData.id,
      role: userData.role
    };
  },
  layout: 'admin',
  computed:{
    ...mapState('auth', ['user'])
  },
  data(){
    return {
      loading: false,
      systemMessage: {
        title: '',
        text: '',
        room: ''
      },
      rules: {
        title: [
          { required: true, message: 'Please input a title', trigger: 'blur' }
        ],
        text: [
          { required: true, message: 'Please input a text', trigger: 'blur' }
        ]
      }
    };
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate(async (valid) => {
        if(valid && this.systemMessage.room !== ''){
          this.loading = true;
          const formData = {
            id: this.id,
            title: this.systemMessage.title,
            text: this.systemMessage.text,
            roomName: this.systemMessage.room,
            userName: this.user.login, //Get it from store Vuex
            userRole: this.role
          };
          //Show modal window confirmation
          this.$confirm(`Are you sure to send a message to room ${this.systemMessage.room}?`)
          .then(_ => {
              this.$socket.emit('notificationFromAdminPanel',formData, (data)=>{
                //If we get an error
                if(typeof data === 'string'){
                  window.setTimeout(()=>{
                    this.$message({
                      showClose: true,
                      message: data,
                      type: 'error'
                    });
                    this.loading = false;
                  },1500);
                }else{
                  window.setTimeout(function(){
                    this.$message({
                      showClose: true,
                      message: data.success,
                      type: 'success'
                    });
                    this.loading = false;
                    this.systemMessage.title = '';
                    this.systemMessage.text = '';
                    this.systemMessage.room = '';
                  }.bind(this),1500);
                }
              });
            done();
          })
          .catch(_ => {});
        }else{
          this.$message({
            showClose: true,
            message: 'The form is invalid!',
            type: 'warning'
          });
        }
      });
    },
    resetForm(formName){
      this.$refs[formName].resetFields();
      this.systemMessage.room = '';
    },
    async loadRoomsAgain(){
      try{
        let result = await this.$axios.$get('/api/chat_room/admin/rooms');
        if(result && result.rooms){
          this.rooms = result.rooms;
        }else{
          console.log(result.rooms);
        }
      }catch(e){
        console.log(e);
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
  }
}

</script>

<style lang="scss">
.system-message__form{
  margin-top:1em;
  width: 650px;
  .el-form-item.el-form-item--feedback{
  /*.el-form-item.el-form-item--feedback:nth-child(2){*/
    label[for='title']{
      width: 205px!important;
      font-size: .9em;
    }
    label[for='text']{
      width: 205px!important;
      font-size: .9em;
    }
    .el-form-item__label{
      width: 205px!important;
      font-size: .9em;
    }
    .el-form-item__content{
      margin-left: 225px!important;
    }
  }
}
</style>
