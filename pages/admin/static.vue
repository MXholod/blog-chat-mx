<template>
  <div class="static-page">
    <el-tabs type="card" @tab-click="handleTabs">
        <el-tab-pane :label="tab1.label">
          <p class="static-page__tab-header">Here you can manage static pages</p>
          <div v-if="limit !== null">
            <p v-if="limitPagesCollision" class="static-page__collision">
              <b>Warning!!! If you see this.</b>
              The limit of pages is bigger than the amount of pages.
              Set the <span class="l">limit</span> equal to <span class="a">amount</span> or lower
            </p>
            <p class="static-page__limit">The limit of displayed pages: {{ limit }}</p>
            <p class="static-page__total">Total amount of pages: {{ totalStatic }}</p>
          </div>
          <div v-if="role">
            <static-pages-limit v-if="limit !== null"
              :staticLimit="limit"
              :totalStatic="totalStatic"
              :updateLimit="updateLimit"
            />
            <el-button v-else size="mini" @click="getLimitAgain">
              Load static limit again
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="tab2.label">
          <p class="static-page__tab-header">Here you can see a lis of all static page</p>
          <i class="el-icon-loading" v-if="loader"></i>
          <div v-else>
            <div v-if="Array.isArray(allStaticPages) && (allStaticPages.length === 0 || allStaticPages.length > 0)">
              <el-table
                :data="allStaticPages"
                stripe
                style="width: 100%">
                <el-table-column
                  prop="name"
                  label="Page name"
                  min-width="180">
                </el-table-column>
                <el-table-column
                  prop="header"
                  label="Page header"
                  min-width="180">
                </el-table-column>
                <el-table-column
                  label="Operations">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="danger"
                      :icon="scope.row.loadingBtn ? 'el-icon-loading' : ''"
                      :disabled="scope.row.loadingBtn"
                      @click="deleteStaticPage(scope.$index, scope.row)">Delete</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else>
              <el-button size="mini"
                :icon="loadingBtn ? 'el-icon-loading' : ''"
                :disabled="loadingBtn"
                @click="loadListOfStaticPagesAgain">
                Load static pages again
              </el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="tab3.label">
          <p class="static-page__tab-header">Here you can create a static page</p>
          <static-page
            :pageName="pageName"
            :pageHeader="pageHeader"
            :pageText="pageText"
            @savePageData="savePageData"
            :key="creationUpdate"
            :clearSelectedPage="clearSelectedPage"
            componentPorpose="creation"
            selectedPage=""
          />
        </el-tab-pane>
        <el-tab-pane :label="tab4.label">
          <p class="static-page__tab-header">Here you can update a static page</p>
          <i class="el-icon-loading" v-if="loader"></i>
          <div v-else>
            <div v-if="Array.isArray(allStaticPages) && allStaticPages.length > 0">
              <el-select v-model="staticPageToUpdate"
                placeholder="Choose static page"
                class="select-page"
                size="small"
                @change="getStaticPageData">
                <el-option
                  v-for="page in allStaticPages"
                  :key="page.name"
                  :label="page.header"
                  :value="page.name">
                </el-option>
              </el-select>
              <static-page
                :pageName="pageName"
                :pageHeader="pageHeader"
                :pageText="pageText"
                @savePageData="savePageData"
                :key="creationUpdate"
                :clearSelectedPage="clearSelectedPage"
                componentPorpose="updation"
                :selectedPage="staticPageToUpdate"
              />
            </div>
            <div v-else-if="Array.isArray(allStaticPages) && allStaticPages.length === 0">
              <p style="color:red;text-align:center;font-size:.9em;">
                There are no pages here
              </p>
            </div>
            <div v-else>
              <el-button size="mini" @click="loadListOfStaticPagesAgain">
                Load static pages again
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
  </div>
</template>

<script>
import StaticPage from './../../components/admin/static_pages/StaticPage.vue';
import StaticPagesLimit from './../../components/admin/static_pages/StaticPagesLimit.vue';
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
    let role = true;//admin - true
    //If we have role: 'admin' or 'moderator'
    if(userData.role === 'moderator'){
      role = false;
    }
    let totalStatic = null;
    let limit = null;
    try{
      const result = await context.$axios.$get('/api/settings/admin/limit');
      if(result){
        limit = result.staticPagesLimit;
        totalStatic = result.totalPages;
      }
    }catch(e){
      //console.log(e);
    }
    return {
      userLogoutRefresh: userData.sessionEnd ? true : false,
      role,
      limit,
      totalStatic
    };
  },
  layout: 'admin',
  components:{
    StaticPage,
    StaticPagesLimit
  },
  data(){
    return {
      currentTab: '',
      tab1: {
        label: 'Information about static pages',
      },
      tab2: {
        label: 'List of static pages',
      },
      tab3: {
        label: 'Create static page',
      },
      tab4: {
        label: 'Update static page',
      },
      currentTabClicked: '',
      allStaticPages: null,
      pageName: '',
      pageHeader: '',
      pageText: '',
      //Re-render component property
      creationUpdate: 0,
      //It remembers a selected static page on the Update Tab
      staticPageToUpdate: '',
      loader: false,
      loadingBtn: false,
    };
  },
  computed:{
    limitPagesCollision(){
      //We have a collision
      if(this.totalStatic < this.limit){
        return true;
      }
      return false;
    }
  },
  methods:{
    handleTabs(tab, event) {
      //Check current 'tab'
      switch(tab.label){
        case this.tab1.label : this.currentTab = tab.label;
        break;
        case this.tab2.label :
          if(this.currentTabClicked === tab.label){
            return true;
          }
          this.currentTab = tab.label;
          //Try to get all the static pages
          this.getAllStaticPages();
          //Save current tab
          this.currentTabClicked = tab.label;
        break;
        case this.tab3.label : this.currentTab = tab.label;
            //Reset component's data during switching between Tabs
            this.pageName = '';
            this.pageHeader = '';
            this.pageText = '';
            //Re-render component
            this.creationUpdate += 1;
        break;
        case this.tab4.label :
          if(this.currentTabClicked === tab.label){
            return true;
          }
          this.currentTab = tab.label;
          //Reset component's data during switching between Tabs
          this.pageName = '';
          this.pageHeader = '';
          this.pageText = '';
          //Try to get all the static pages
          this.getAllStaticPages();
          //Clear selected drop down list
          this.staticPageToUpdate = '';
          //Save current tab
          this.currentTabClicked = tab.label;
        break;
      }
    },
    async getAllStaticPages(){
      //Reset to 'null' each time when this function calls
      this.allStaticPages = null;
      this.loader = true;
      try{
        const result = await this.$axios.$get('/api/static_page/admin/pages');
        if(result && result.static){
          window.setTimeout(()=>{
            this.allStaticPages = result.static.map(staticPage => {
              return { ...staticPage, loadingBtn: false };
            });
            this.loader = false;
          },2000);
        }else{
          this.loader = false;
        }
      }catch(e){
        console.log(e);
      }
    },
    //Load a list of static pages if 'allStaticPages' is 'null'
    loadListOfStaticPagesAgain(){
      //Show loader in button when load data list again
      this.loadingBtn = true;
      window.setTimeout(()=>{
        //Hide loader in button when load data list again
        this.loadingBtn = false;
        this.getAllStaticPages();
      },2000);
    },
    //This function invokes by child event to create or save a newly created static page
    async savePageData(pageData){
      //Create static page
      if(this.currentTab === this.tab3.label){
        const { pageName: name, pageHeader: header, pageText: text } = pageData;
        try{
          const result = await this.$axios.$post('/api/static_page/admin/page', {
            name,
            header,
            text
          });
          //Page already exists
          if(result && !result.static.name){
            this.$message({
              showClose: true,
              message: "The 'name' for the static page is occupied",
              type: 'warning'
            });
            //Rewrite component's props to save previous values if name is already exists
            this.pageName = name;
            this.pageHeader = header;
            this.pageText = text;
            //Re-render component
            this.creationUpdate += 1;
            return true;
          }//Page has been created
          else if(result && result.static){
            setTimeout(()=>{
              this.pageName = '';
              this.pageHeader = '';
              this.pageText = '';
              //Update 'totalStatic' pages
              this.totalStatic = ++this.totalStatic;
              //Re-render component
              this.creationUpdate += 1;
              this.$message({
                showClose: true,
                message: "The page has been created",
                type: 'success'
              });
            },2000);
          }
        }catch(e){
          //Rewrite component's props to save previous values if name is already exists
          this.pageName = name;
          this.pageHeader = header;
          this.pageText = text;
          //Re-render component
          this.creationUpdate += 1;
          //console.log("Error ",e);
        }
      }
      //Update static page
      if(this.currentTab === this.tab4.label){
        if(this.staticPageToUpdate === ''){
          this.$message({
            showClose: true,
            message: "You must select a static page from the list",
            type: 'warning'
          });
          return true;
        }
        const { pageName: name, pageHeader: header, pageText: text } = pageData;
        try{
          const result = await this.$axios.$put('/api/static_page/admin/page', {
            name,
            header,
            text
          });
          if(result && result.static){
            setTimeout(()=>{
              this.pageName = name;
              this.pageHeader = header;
              this.pageText = text;
              //Re-render component
              this.creationUpdate += 1;
              this.$message({
                showClose: true,
                message: "The page has been updated",
                type: 'success'
              });
            },2000);
          }
        }catch(e){
          console.log("Error ",e);
        }
      }
    },
    //This function invokes when changing a selection of a page on the Update Tab
    getStaticPageData(staticPage){
      //Save the selected page 'name'
      let foundStaticPage = this.allStaticPages.filter(statPage => {
        return statPage.name === staticPage;
      });
      if(foundStaticPage && foundStaticPage[0]){
        //Add static page data to the form update fields
        this.pageName = foundStaticPage[0].name;
        this.pageHeader = foundStaticPage[0].header;
        this.pageText = foundStaticPage[0].text;
        //Re-render component
        this.creationUpdate += 1;
      }else{
        this.$message({
          showClose: true,
          message: "The page data is absent",
          type: 'error'
        });
      }
    },
    //This function deletes a chosen static page
    deleteStaticPage(staticPageIndex){
      if(this.allStaticPages.length > 0){
        let name = this.allStaticPages[staticPageIndex].name;
        //Show message of confirmation
        this.$confirm('This will permanently delete the static page. Continue?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(async () => {
          //Set current deletion element prop 'loadingBtn' to true
          this.allStaticPages[staticPageIndex].loadingBtn = true;
          this.$message({
            type: 'success',
            message: 'Delete completed'
          });
          //Make a request to delete a static page
          try{
            const result = await this.$axios.$delete('/api/static_page/admin/page', {
              data: { name: name }
            });
            if(result.static){
              setTimeout(()=>{
                //Delete static page locally
                this.allStaticPages = this.allStaticPages.filter( staticPage => {
                  return staticPage.name !== name;
                });
                //Update 'totalStatic' pages
                this.totalStatic = --this.totalStatic;
                this.$message({
                  showClose: true,
                  message: `Static page ${name} has been deleted`,
                  type: 'success'
                });
              },2000);
            }else{
              this.allStaticPages[staticPageIndex].loadingBtn = false;
            }
          }catch(e){
            console.log(e);
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Delete canceled'
          });
          //this.loadingBtn = false;
          this.allStaticPages[staticPageIndex].loadingBtn = false;
        });
      }else{
        return true;
      }
    },
    //This function calls in child and clears selected static page
    clearSelectedPage(emptyStr){
      this.staticPageToUpdate = emptyStr;
    },
    //Get limit of static pages again
    async getLimitAgain(){
      try{
        const result = await this.$axios.$get('/api/settings/admin/limit');
        if(result){
          this.limit = result.staticPagesLimit;
          this.totalStatic = result.totalPages;
          console.log(result);
        }
      }catch(e){
        console.log(e);
      }
    },
    //This function will be called by child
    updateLimit(val){
      this.limit = val;
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
/* This rule is to reset padding-right, which sets by confirmation 'message box' */
body{
  padding-right:0px!important;
}
.static-page__tab-header{
  margin-bottom: .5em;
}
.static-page__collision{
  color:#d60606;
  padding: .5em;
  border:1px solid #fa0a0a;
  border-radius: 5px;
  width:30%;
  font-size: .9em;
  b{
    margin-left:10%;
  }
  .l{
    color: #6d7af0;
  }
  .a{
    color: #5eb952;
  }
}
.static-page__limit{
  text-indent: 1em;
  color:#6d7af0;
  font-size: .9em;
  margin-top:1em;
  margin-bottom: .5em;
}
.static-page__total{
  text-indent: 1em;
  color:#5eb952;
  font-size: .9em;
  margin-bottom:1em;
}
.select-page div.el-input{
  border: 1px solid #f00;
  border-radius:3px;
  position:relative;
  &::before{
    content: 'Required field';
    display: block;
    position: absolute;
    top:10px;
    right:-40%;
    color: red;
    font-size:.9em;
  }
}
</style>
