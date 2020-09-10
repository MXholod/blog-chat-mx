<template>
    <div>
        <el-container>
            <el-header height="80px" class="el-header-base-layout">
                <Navigation />
            </el-header>
        </el-container>
        <v-app>
            <v-container fluid style="position:relative;padding:0px !important;">
                <v-row v-bind:no-gutters="true">
                    <v-col xs="3" sm="3" md="12" lg="3" xl="3">
                        <v-navigation-drawer absolute v-model="drawer" :width="330" :height="400">
                            <v-alert
                                border="bottom"
                                color="#38588E"
                                dark
                            >
                                List of people in the room
                            </v-alert>
                            <v-list>
                                <v-list-item
                                    v-for="u in users"
                                    :key="u.id"
                                    @click.prevent=""
                                >
                                    <v-list-item-icon>
                                        <v-icon v-if="u.icon" color="pink">mdi-star</v-icon>
                                    </v-list-item-icon>

                                    <v-list-item-content>
                                        <v-list-item-title v-text="u.name"></v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-avatar>
                                        <v-img src=""></v-img>
                                    </v-list-item-avatar>

                                    <v-list-item-icon>
                                        <v-icon >mdi-comment-processing-outline</v-icon>
                                    </v-list-item-icon>
                                </v-list-item>
                            </v-list>
                        </v-navigation-drawer>
                    </v-col>
                    <v-col xs="9" sm="9" md="12" lg="9" xl="9">
                        <v-container fluid style="padding:0px;padding-right:6px;">
                            <v-row>
                                <v-col>
                                    <v-toolbar style="top:-10px !important;">
                                        <v-container>
                                            <v-row v-bind:no-gutters="true">
                                                <v-col xs="6" sm="6" md="6" lg="6" xl="6">
                                                    <v-app-bar-nav-icon
                                                        style="top:20px;"
                                                        @click="drawer = !drawer"
                                                    ></v-app-bar-nav-icon>
                                                </v-col>
                                                <v-col xs="6" sm="6" md="6" lg="6" xl="6">
                                                    <v-btn
                                                        icon
                                                        :absolute="true"
                                                        style="right:25px;top:5px;"
                                                        @click="exit"
                                                        class="hidden-xs-only">
                                                        <v-icon>mdi-run-fast</v-icon>
                                                    </v-btn>
                                                </v-col>
                                            </v-row>
                                            <v-row :no-gutters="true">
                                                <v-col xs="12" sm="12" md="12" lg="12" xl="12">
                                                    <v-toolbar-title
                                                        style="text-align:center;padding-bottom:10px;"
                                                    >Chat room name is: {{ user.room }}</v-toolbar-title>
                                                </v-col>
                                            </v-row>
                                        </v-container>
                                    </v-toolbar>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col>
                                    <v-main>
                                        <div>
                                            <Nuxt />
                                        </div>
                                    </v-main>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-col>
                </v-row>
            </v-container>
        </v-app>
        <el-container>
            <el-footer class="el-footer-base-layout">Footer</el-footer>
        </el-container>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Navigation from './../../components/site/Navigation'
export default {
  components: {
    Navigation
  },
  computed: mapState(['user']),
  data () {
    return {
      drawer: true,
      users: [
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' },
        { id: 3, name: 'User 3' },
        { id: 4, name: 'User 4' }
      ]
    }
  },
  methods: {
    exit () {
      console.log('Exit')
      // this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
.el-footer-base-layout{
  padding:0;
  background-color:#225AA4;
 }
</style>
