<template>
  <el-tabs type="card" @tab-click="handleTabPaneClick">
    <el-tab-pane v-bind:label="tabLabels[0]">
      <h3>About user management</h3>
      <p>In this section you can create new user and modify those who are existed.</p>
    </el-tab-pane>
    <el-tab-pane v-bind:label="tabLabels[1]">
      <h3>List of users</h3>
      <el-button v-if="!Array.isArray(users) || (users === null)" @click="showUsersList">
        Retry to download user list
      </el-button>
      <admin-user-list :users="users" :userId="userId" />
    </el-tab-pane>
    <el-tab-pane v-bind:label="tabLabels[2]" v-if="isUserAuthenticated.role === 'admin'">
      <h3>Create user</h3>
      <admin-user-create />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import AdminUserCreate from './admin_user_management/AdminUserCreate';
import AdminUserList from './admin_user_management/AdminUserList';
import { mapGetters } from 'vuex';
export default {
  components: { AdminUserCreate, AdminUserList },
  data () {
    return {
      activeName: 'first',
      tabLabels:[
        "About user management",
        "List of users",
        "Create user"
      ],
      users: null,
      userId: ''
    }
  },
  computed: {
    ...mapGetters('auth',['isUserAuthenticated'])
  },
  methods: {
    async getAllUsers(){
      try{
        const apiUsers = await this.$axios.get('/api/auth/admin/users');
        if(apiUsers){//apiUsers - [ [],'' ]
          //Create array of data for the Moderators only
          const arrForModerator = [];
          //Prepare data for the Moderators
          apiUsers.data.users[0].forEach(obj => {
            if((obj.role === "guest")){
              arrForModerator.push(obj);
            }
          });
          //Get the current role from Vuex Store
          if(this.isUserAuthenticated.role === "admin"){
            this.users = apiUsers.data.users[0];
          }else{
            this.users = arrForModerator;
          }
          this.userId = apiUsers.data.users[1];
        }
      }catch(e){
        this.users = null;
      }
    },
    handleTabPaneClick (tab, event) {
      //console.log(tab, event)
      if(tab.label === this.tabLabels[1]){
        this.getAllUsers();
      }
    },
    showUsersList(){
      this.getAllUsers();
    }
  },
  mounted(){
    setTimeout(()=>{
      this.getAllUsers();
    },3000);
  }
  /* mounted () { // This method is only called on the client side
    // Get query parameter 'message'
    const { message } = this.$route.query
    if (message === 'unauthenticated') {
      // Call element-ui method 'error'
      this.$message({
        showClose: true,
        message: 'You must first login',
        type: 'error'
      })
    }
  } */
}
</script>

<style lang="scss" scoped>
</style>
