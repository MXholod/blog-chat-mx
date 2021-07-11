<template>
    <v-app>
        <v-container class="container-chat" fluid>
            <header-chat></header-chat>
            <v-row v-bind:no-gutters="true" style="position:relative;">
                <v-col xs="3" sm="3" md="12" lg="3" xl="3">
                    <v-navigation-drawer absolute v-model="drawer" :width="330" :height="400" mobile-breakpoint="650">
                        <v-alert
                            border="bottom"
                            color="#38588E"
                            dark
                            class="sport-text-center"
                        >
                            List of people in the room
                        </v-alert>
                        <v-list>
                            <v-list-item
                                v-for="u in users"
                                :key="u.userId"
                                @click.prevent=""
                                :style="u.userId === user.userId ? {backgroundColor:'#d9efff'} : {backgroundColor:'#fff'}"
                            >
                                <v-list-item-content>
                                  <v-list-item-title v-text="u.name"></v-list-item-title>
                                </v-list-item-content>

                                <v-list-item-avatar>
                                  <v-img src=""></v-img>
                                </v-list-item-avatar>

                                <v-list-item-icon>
                                  <v-icon :color="u.userId === user.userId ? 'blue' : 'grey'">mdi-comment-processing-outline</v-icon>
                                </v-list-item-icon>
                            </v-list-item>
                        </v-list>
                    </v-navigation-drawer>
                </v-col>
                <v-col xs="9" sm="9" md="12" :lg="cols" :xl="cols">
                    <v-container fluid style="padding:0px;padding-right:6px;">
                        <v-row
                            :style="withSidebar"
                        >
                            <v-col>
                                <v-toolbar style="top:-10px !important;">
                                    <v-container>
                                        <v-row v-bind:no-gutters="true">
                                            <v-col xs="6" sm="6" md="6" lg="6" xl="6">
                                                <v-app-bar-nav-icon
                                                    style="top:0px;"
                                                    @click="()=>{
                                                        drawer = !drawer
                                                        drawer ? cols = 9 : cols = 12
                                                    }"
                                                ></v-app-bar-nav-icon>
                                            </v-col>
                                            <v-col xs="6" sm="6" md="6" lg="6" xl="6">
                                                <v-btn
                                                    :outlined="true"
                                                    icon
                                                    :absolute="true"
                                                    style="right:25px;top:5px;background:aliceblue;"
                                                    @click="exit"
                                                    class="hidden-xs-only">
                                                    <v-icon>mdi-run-fast</v-icon>
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-row :no-gutters="true">
                                            <v-col xs="6" sm="6" md="6" lg="6" xl="6">
                                                <v-btn
                                                    class="ma-2"
                                                    color="primary"
                                                    dark
                                                    :height="20"
                                                    :absolute="true"
                                                    style="cursor:auto;bottom:1%;left:10%;"
                                                >
                                                    <v-icon dark :left="true">mdi-human-greeting</v-icon>
                                                    Visitor name is: {{ user.name }}
                                                </v-btn>
                                            </v-col>
                                            <v-col xs="6" sm="6" md="6" lg="6" xl="6">
                                                <v-btn
                                                    class="ma-2"
                                                    color="#1553B6"
                                                    dark
                                                    :height="20"
                                                    :absolute="true"
                                                    style="cursor:auto;bottom:1%;right:10%;">
                                                    <v-icon dark :left="true">mdi-door-open</v-icon>
                                                    Chat room name is: {{ user.room }}
                                                </v-btn>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                </v-toolbar>
                            </v-col>
                        </v-row>
                        <v-row justify="center" align="center">
                            <v-col
                                xs="10"
                                sm="10"
                                md="10"
                                lg="10"
                                xl="10"
                                class="chat-sport-cols">
                                <v-main class="chat-sport-content">
                                    <Nuxt />
                                </v-main>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-container>
        <v-footer app :padless="true" color="#225AA4" :height="60">
            <p>Footer</p>
        </v-footer>
    </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import HeaderChat from './../../components/site/chat/Header-Chat.vue';
export default {
  components: {
    HeaderChat
  },
  computed: {
    ...mapState('chat', ['user', 'users']),
    withSidebar () {
      return this.drawer ? 'margin-left:-12px' : 'margin-left:-6px'
    }
  },
  data () {
    return {
      drawer: true,
      cols: 9
    }
  },
  methods: {
    ...mapMutations('chat', ['clearData']),
    exit () {
      this.$socket.emit('userLeft', this.user.userId, () => {
        // Use mutation to reset state.user
        //this.clearData()
        this.$router.push('/chat/?message=leftChat')
      })
    }
  }
}
</script>

<style lang="scss">
.el-header-base-layout{
  .el-menu-sport.el-menu--horizontal.el-menu{
    padding:0;
  }
}
.chat-sport-cols{
  padding-top: 0px;
}
.chat-sport-content{
  height: 50vh;
  border: 1px solid green;
  background-color:#225AA4;
  padding-bottom: 0px !important;
 }
.el-footer-base-layout{
  padding:0;
  background-color:#225AA4;
 }
 .sport-text-center{
   text-align: center;
 }
</style>
