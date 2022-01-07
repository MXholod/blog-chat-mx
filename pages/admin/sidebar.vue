<template>
    <div>
      <el-tabs type="card" v-model="activeName" @tab-click="handleTabs">
        <el-tab-pane label="Sidebar management of blocks" name="first">
          <p>Here you can control the visibility of the blocks. The blocks represent information on the sidebar.</p>
          <div v-if="sidebarVisibility !== null">
            <h3>Turn the sidebar on / off (by default its on)</h3>
            <div class="sidibar-visibility-switcher">
              <button v-if="!sidebarLoading"
                class="sidibar-visibility-switcher__btn"
                @click="handleSidebarVisibility">
                <i v-if="sidebarVisibility" class="el-icon-open"></i>
                <i v-else class="el-icon-turn-off"></i>
              </button>
              <button v-else type="button"
                class="sidibar-visibility-switcher__btn-default">
                <i v-if="sidebarVisibility" class="el-icon-open"></i>
                <i v-else class="el-icon-turn-off"></i>
              </button>
              <span v-if="sidebarVisibility"
                class="sidibar-visibility-switcher__on">
                On
              </span>
              <span v-else class="sidibar-visibility-switcher__off">
                Off
              </span>
              <span v-show="sidebarLoading"
                class="el-icon-loading sidibar-visibility-switcher__preloading">
              </span>
            </div>
          </div>
          <div v-else>
            <el-button @click="loadSidebarVisibilityAndSearch"
              size="mini"
              :loading="loading"
              :disabled="loading"
            >
              Load data again
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Popular posts" name="second">
          <h3>Set the number of posts displayed on the sidebar</h3>
          <block-list :dataList="popularPosts.dataToPopularPosts"
            parentBlock="popular_posts"
            :settings="popularPosts.settings"
            :loadAgainButton="popularPosts.loadAgainButton"
            @blockType="loadDataAgain"
            @blockUpdateData="blockUpdateData"
            :loadingStatus="popularPosts.loading">
            <template v-slot:title>
              <h3>Popular 10 posts</h3>
            </template>
          </block-list>
        </el-tab-pane>
        <el-tab-pane label="Popular pages" name="third">
          <h3>Set the number of pages displayed on the sidebar</h3>
          <block-list :dataList="popularPages.dataToPopularPages"
            parentBlock="popular_pages"
            :settings="popularPages.settings"
            :loadAgainButton="popularPages.loadAgainButton"
            @blockType="loadDataAgain"
            @blockUpdateData="blockUpdateData"
            :loadingStatus="popularPages.loading">
            <template v-slot:title>
              <h3>Popular 10 pages</h3>
            </template>
          </block-list>
        </el-tab-pane>
        <el-tab-pane label="Recently created posts" name="fourth">
          <h3>Set the number of recently created posts displayed on the sidebar</h3>
          <block-list :dataList="recentPosts.dataToRecentPosts"
            parentBlock="recent_posts"
            :settings="recentPosts.settings"
            :loadAgainButton="recentPosts.loadAgainButton"
            @blockType="loadDataAgain"
            @blockUpdateData="blockUpdateData"
            :loadingStatus="recentPosts.loading">
            <template v-slot:title>
              <h3>Recent 10 posts</h3>
            </template>
          </block-list>
        </el-tab-pane>
        <el-tab-pane label="Recently created pages" name="fifth">
          <h3>Set the number of recently created pages displayed on the sidebar</h3>
          <block-list :dataList="recentPages.dataToRecentPages"
            parentBlock="recent_pages"
            :settings="recentPages.settings"
            :loadAgainButton="recentPages.loadAgainButton"
            @blockType="loadDataAgain"
            @blockUpdateData="blockUpdateData"
            :loadingStatus="recentPages.loading">
            <template v-slot:title>
              <h3>Recent 10 pages</h3>
            </template>
          </block-list>
        </el-tab-pane>
        <el-tab-pane label="Search settings" name="sixth">
          <div v-if="sidebarSearchBlock !== null">
            <search-settings
              :sidebarSearchBlock="sidebarSearchBlock"
            />
          </div>
          <div v-else>
            <el-button @click="loadSidebarVisibilityAndSearch"
              size="mini"
              :loading="loading"
              :disabled="loading"
            >
              Load data again
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import BlockList from './../../components/admin/sidebar/BlockList.vue';
import SearchSettings from './../../components/admin/sidebar/SearchSettings.vue';
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
    let sidebarVisibility = null;
    let sidebarSettings = null;
    let sidebarSearchBlock = null;
    try{
      //Get sidebar visibility
      const result = await context.$axios.$get('api/sidebar/admin/settings');
      if(result){
        //Sidebar visibility has been changed
        sidebarVisibility = result.sidebarSettings.sidebarVisibility;
        sidebarSettings = result.sidebarSettings;
        sidebarSearchBlock = {
          searchVisibility: result.sidebarSettings.searchVisibility,
          searchByPosts: result.sidebarSettings.searchByPosts,
          searchByPages: result.sidebarSettings.searchByPages
        };
      }
    }catch(e){
      //console.log(e);
    }
    return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      sidebarVisibility,
      sidebarSearchBlock,
      loading: false, //For the first and last Tabs
      popularPosts: {
        settings: {
          limit: sidebarSettings?.popularPostsLimit,
          visibility: sidebarSettings?.popularPostsVisibility
        },
        dataToPopularPosts: null,
        loadAgainButton: false,
        loading: false
      },
      popularPages: {
        settings: {
          limit: sidebarSettings?.popularPagesLimit,
          visibility: sidebarSettings?.popularPagesVisibility
        },
        dataToPopularPages: null,
        loadAgainButton: false,
        loading: false
      },
      recentPosts: {
        settings: {
          limit: sidebarSettings?.recentlyCreatedPostsLimit,
          visibility: sidebarSettings?.recentlyCreatedPostsVisibility
        },
        dataToRecentPosts: null,
        loadAgainButton: false,
        loading: false
      },
      recentPages: {
        settings: {
          limit: sidebarSettings?.recentlyCreatedPagesLimit,
          visibility: sidebarSettings?.recentlyCreatedPagesVisibility
        },
        dataToRecentPages: null,
        loadAgainButton: false,
        loading: false
      }
    };
  },
  layout: 'admin',
  name: 'sidebar',
  components:{
    BlockList,
    SearchSettings
  },
  computed: mapState('auth', ['user']),
  data(){
    return {
      activeName: 'first',
      sidebarLoading: false
    }
  },
  methods:{
    async handleTabs(tab, event) {
      if(tab.name === 'second'){
        this.requestApi('popular_posts');
      }
      if(tab.name === 'third'){
        this.requestApi('popular_pages');
      }
      if(tab.name === 'fourth'){
        this.requestApi('recent_posts');
      }
      if(tab.name === 'fifth'){
        this.requestApi('recent_pages');
      }
    },
    requestApi(partUrl){
      //Reset 'loadAgainButton' to default value
      this.popularPosts.loadAgainButton = false;
      this.popularPages.loadAgainButton = false;
      this.recentPosts.loadAgainButton = false;
      this.recentPages.loadAgainButton = false;
        try{
          window.setTimeout(async ()=>{
            let url, result;
            switch(partUrl){
              case 'popular_posts' :
                url = `api/sidebar/admin/posts/${partUrl}`;
                result = await this.$axios.$get(url);
                if(result){
                  const settings = await this.$axios.$get('api/sidebar/admin/settings');
                  if(settings){
                    this.popularPosts.dataToPopularPosts = result.posts;
                    this.popularPosts.settings = {
                      limit: settings.sidebarSettings?.popularPostsLimit,
                      visibility: settings.sidebarSettings?.popularPostsVisibility
                    }
                  }
                }
                //401. try to load data again
                if(result === undefined){
                  this.popularPosts.loadAgainButton = true;
                }
                break;
              case 'popular_pages' :
                url = `api/sidebar/admin/pages/${partUrl}`;
                result = await this.$axios.$get(url);
                if(result){
                  const settings = await this.$axios.$get('api/sidebar/admin/settings');
                  if(settings){
                    this.popularPages.dataToPopularPages = result.pages;
                    this.popularPages.settings = {
                      limit: settings.sidebarSettings.popularPagesLimit,
                      visibility: settings.sidebarSettings.popularPagesVisibility
                    }
                  }
                }
                //401 try to load data again
                if(result === undefined){
                  this.popularPages.loadAgainButton = true;
                }
                break;
              case 'recent_posts' :
                url = `api/sidebar/admin/posts/${partUrl}`;
                result = await this.$axios.$get(url);
                if(result){
                  const settings = await this.$axios.$get('api/sidebar/admin/settings');
                  if(settings){
                    this.recentPosts.dataToRecentPosts = result.posts;
                    this.recentPosts.settings = {
                      limit: settings.sidebarSettings?.recentlyCreatedPostsLimit,
                      visibility: settings.sidebarSettings?.recentlyCreatedPostsVisibility
                    }
                  }
                }
                //401 try to load data again
                if(result === undefined){
                  this.recentPosts.loadAgainButton = true;
                }
                break;
              case 'recent_pages' :
                url = `api/sidebar/admin/pages/${partUrl}`;
                result = await this.$axios.$get(url);
                if(result){
                  const settings = await this.$axios.$get('api/sidebar/admin/settings');
                  if(settings){
                    this.recentPages.dataToRecentPages = result.pages;
                    this.recentPages.settings = {
                      limit: settings.sidebarSettings?.recentlyCreatedPagesLimit,
                      visibility: settings.sidebarSettings?.recentlyCreatedPagesVisibility
                    }
                  }
                }
                //401 try to load data again
                if(result === undefined){
                  this.recentPages.loadAgainButton = true;
                }
                break;
              }
          },2000);
        }catch(e){
          //console.log(e);
        }
    },
    handleSidebarVisibility(){
      //Start pre-loading
      this.sidebarLoading = true;
      //Inverting Boolean value and then convert it to Number
      const sidebarState = Number(!this.sidebarVisibility);
      try{
        window.setTimeout(async ()=>{
          const result = await this.$axios.$patch(`api/sidebar/admin/visibility/${sidebarState}`);
          if(result){
            //Sidebar visibility has been changed
            this.sidebarVisibility = result.sidebarVisibility;
          }
          this.sidebarLoading = false;
        },2000);
      }catch(e){
        //console.log("Error ",e);
      }
    },
    //Event from child
    loadDataAgain(blockName){
      this.requestApi(blockName);
    },
    //Event from child
    blockUpdateData(dataUpdating){
      try{
        //Creating dynamically object property from the string
        let blockTypesArr = dataUpdating.blockType.split('_');
        let upper = blockTypesArr[1][0].toUpperCase();
        let upperRest = blockTypesArr[1].substr(1);
        const blockProperty = blockTypesArr[0]+upper+upperRest;
        window.setTimeout(async ()=>{
          const result = await this.$axios.$put('api/sidebar/admin/block',{
            data:{
              ...dataUpdating
            }
          });
          if(result){
            //Updating 'settings' object of the current block
            this[blockProperty].settings = {
              limit: result.updatedSettings.newLimit,
              visibility: result.updatedSettings.newVisibility
            };
          }
          //Release 'Submit' button in child component
          this[blockProperty].loading = !dataUpdating.loadingStatus;
        },3000);
      }catch(e){
        //console.log(e);
      }
    },
    async loadSidebarVisibilityAndSearch(){
      this.loading = true;
      try{
        //Get sidebar visibility
        const result = await this.$axios.$get('api/sidebar/admin/settings');
        if(result){
          window.setTimeout(()=>{
            //Sidebar visibility has been changed
            this.sidebarVisibility = result.sidebarSettings.sidebarVisibility;
            //Sidebar search settings
            this.sidebarSearchBlock = {
              searchVisibility: result.sidebarSettings.searchVisibility,
              searchByPosts: result.sidebarSettings.searchByPosts,
              searchByPages: result.sidebarSettings.searchByPages
            };
            this.loading = false;
          },2000);
        }else{
          this.loading = false;
        }
      }catch(e){
        console.log(e);
        this.loading = false;
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
.sidibar-visibility-switcher{
  .sidibar-visibility-switcher__btn{
    .el-icon-turn-off{
      color:red;
    }
    .el-icon-open{
      color:green;
    }
    padding: 1px 0px!important;
    font-size: 2.3em;
    margin: .2em 0 0 1em;
  }
  .sidibar-visibility-switcher__btn-default{
    padding: 1px 0px!important;
    font-size: 2.3em;
    margin: .2em 0 0 1em;
  }
  .sidibar-visibility-switcher__on{
    color:green;
    top: -6px;
    position: relative;
    left: 10px;
    font-weight: bold;
  }
  .sidibar-visibility-switcher__off{
    color:red;
    top: -6px;
    position: relative;
    left: 10px;
    font-weight: bold;
  }
  .sidibar-visibility-switcher__preloading{
    top: -6px;
    position: relative;
    left: 10px;
    font-weight: bold;
  }
}
</style>
