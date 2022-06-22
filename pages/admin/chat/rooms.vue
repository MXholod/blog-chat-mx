<template>
  <div class="chat-rooms-page">
    <h1>List of rooms</h1>
    <span class="warning-deletion">A room or rooms can only be deleted if you mark checkbox and click the confirm button!</span>
    <div v-if="Array.isArray(allRooms)">
      <el-table
        ref="multipleTable"
        :data="allRooms"
        style="width: 100%"
        @row-click="rowClickDeleteButon"
        @select="rowClickCheckBox"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="Room name"
          width="120">
          <template slot-scope="scope">{{ scope.row.roomName }}</template>
        </el-table-column>
        <el-table-column
          property="roomDescription"
          label="Room description"
          >
        </el-table-column>
        <el-table-column
          property="totalMessages"
          label="Total messages in the room"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          property="switchBtn"
          label="Delete the room"
          show-overflow-tooltip
          >
          <template slot-scope="scope">
            <el-button v-if="!scope.row.switchBtn" size="mini">
              <i class="el-icon-delete" style="padding-right:3px;"></i>
              Confirm deletion
            </el-button>
            <span v-else style="color:red;">
              This room will be deleted
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px" class="chat-rooms-page__buttons">
        <el-button @click="deleteSelected()">Delete selected</el-button>
        <el-button @click="toggleSelection()">Clear selection</el-button>
        <div class="loader-list" v-if="loaderList">
          <Loader />
        </div>
      </div>
    </div>
    <div v-else>
      <el-button
        @click="reloadRoomList"
        size="mini"
        >Retry to download room list</el-button>
      <div class="loader" v-if="loader">
        <Loader />
      </div>
    </div>
  </div>
</template>

<script>
import Loader from './../../../components/Loader.vue';
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
    let allRooms = null;
    try{
      const result = await context.$axios.$get('/api/chat_room/rooms_messages');
      if(result){
        allRooms = result.rooms;
      }
    }catch(e){
      console.log(e);
    }
    return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      allRooms
    };
  },
  layout: 'admin',
  components:{
    Loader
  },
  data(){
    return {
      multipleSelection: [],
      loader: false,
      loaderList: false
    }
  },
  methods:{
    async reloadRoomList(){
      this.loader = true;
      try{
        const result = await this.$axios.$get('/api/chat_room/rooms_messages');
        if(result){
          window.setTimeout(()=>{
            this.loader = false;
            this.allRooms = result.rooms;
          },1500);
        }else{
          this.allRooms = null;
          this.loader = false;
        }
      }catch(e){
        console.log(e);
        this.loader = false;
      }
    },
    toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
          //Reset all rooms data by default
          for(let i = 0; i < this.allRooms.length;i++){
            this.allRooms[i].deleteRoom = false;
            this.allRooms[i].switchBtn = false;
          }
        }
      },
      //Click on confirm deletion button 'switchBtn' - false/true
      rowClickDeleteButon(clickedRow, column, e){
        const button = 'BUTTON';
        const span = 'SPAN';
        if(column.label !== 'Delete the room') return;
        if(e.srcElement.nodeName === button || e.srcElement.nodeName === span){
          for(let i = 0;i < this.allRooms.length;i++){
            if(this.allRooms[i].roomName === clickedRow.roomName && this.allRooms[i].switchBtn === false){
              this.allRooms[i].switchBtn = true;
            }else if(this.allRooms[i].roomName === clickedRow.roomName && this.allRooms[i].switchBtn === true){
              //
              this.allRooms[i].switchBtn = false;
            }
          }
        }
      },
      //Change checkbox value and its property 'deleteRoom' when clicking
      rowClickCheckBox(selection, row){
        for(let i = 0; i < this.allRooms.length;i++){
          if(this.allRooms[i].id === row.id){
            this.allRooms[i].deleteRoom = !row.deleteRoom;
          }
        }
      },
      //Delete all selected
      deleteSelected(){
        //Prepare data to delete
        let dataToDelete = [];
        dataToDelete = this.allRooms.filter(room =>
          (room.deleteRoom && room.switchBtn)
        ).map(room => room.id );
        //).map(room => ({ id: room.id, name: room.roomName }));

        //If not one room selected with checkbox and button click don't do the request
        if(!dataToDelete.length) {
          this.$message({
            type: 'warning',
            message: 'No room selected to delete correctly'
          });
          return false;
        };
        this.$confirm('Selected rooms will be deleted. Continue?', 'Warning',{
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(async () => {
          //Send room(s) data for deletion
          try{
            const result = await this.$axios.$delete('/api/chat_room/rooms_messages',{
              data: dataToDelete
            });
            let roomsAfterDeletion = [];
            if(result.rooms){
              this.loaderList = true;
              //Update list of rooms in template after deleting
              if(dataToDelete.length > 0){
                roomsAfterDeletion = this.allRooms.filter( (room) =>{
                  return !dataToDelete.includes(room.id);
                });
                window.setTimeout(()=>{
                  //Rewrite rooms
                  this.allRooms = roomsAfterDeletion;
                  roomsAfterDeletion = [];
                  this.loaderList = false;
                  this.$message({
                    type: 'success',
                    message: 'Delete completed'
                  });
                },1500);
              }else{
                this.loaderList = false;
              }
            }
          }catch(e){
            //console.log(e);
            this.loaderList = false;
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });
        });
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

<style lang="scss" scoped>
$color: #225aa4;
.warning-deletion{
  margin: .5em;
  padding: .5em;
  background-color: lighten($color, 50%);
  color: darken(#f00, 15%);
  font-size: .9em;
  border: 1px solid $color;
  display: inline-block;
}
%loader{
  width: 100px;
  height: 100px;
  position: relative;
  top: -50px;
  left: 30%;
}
.loader{
  @extend %loader;
}
.loader-list{
  @extend %loader;
  top: -65px;
  transform: scale(.6);
}
</style>
