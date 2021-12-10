<template>
  <div class="search-settings">
    <div class="search-settings__visibility">
      <h3>Search visibility</h3>
      <p>You can turn on/off the search bar in the sidebar block</p>
      <el-radio v-model="searchVisibility" :label="true">On</el-radio>
      <el-radio v-model="searchVisibility" :label="false">Off</el-radio>
    </div>
    <div class="search-settings__criteria">
      <h3>Choose search by posts or pages or both</h3>
      <p>Switch between posts or pages or you can choose both of them.
        <br /> <span>You must select at least one!</span>
      </p>
      <el-checkbox v-model="searchByPosts">
        Search by posts
      </el-checkbox>
      <el-checkbox v-model="searchByPages">
        Search by pages
      </el-checkbox>
    </div>
    <div class="search-settings__btn">
      <el-button
        size="mini"
        :loading="loading"
        @click="updateSearchSettings">
        Update search settings
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    sidebarSearchBlock: { type: Object }
  },
  data(){
    return {
      loading:false,
      searchVisibility: this.sidebarSearchBlock.searchVisibility,
      searchByPosts: this.sidebarSearchBlock.searchByPosts,
      searchByPages: this.sidebarSearchBlock.searchByPages
     }
  },
  methods:{
    async updateSearchSettings(){
      //If search is visible and posts with pages are turned off we can't save it
      if(this.searchVisibility && !this.searchByPosts && !this.searchByPages){
        this.$message({
          message: 'Turn off search visibility or enable post or pages',
          duration: 5000,
          type: 'error'
        });
        return true;
      }
      this.loading = true;
      try{
        const result = await this.$axios.$put('api/sidebar/admin/search/searchsettings',{
          data:{
            searchByPosts: this.searchByPosts,
            searchByPages: this.searchByPages,
            searchVisibility: this.searchVisibility
          }
        });
        if(result && result.settings){
          setTimeout(()=>{
            this.$message({
              message: 'Search settings successfully updated!',
              duration: 3000,
              type: 'success'
            });
          },2000);
        }
      }catch(e){
        console.log("Error ",e);
        this.loading = false;
      }finally{
        setTimeout(()=>{
          this.loading = false;
        },2000);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.search-settings{
  .search-settings__visibility{
    padding-bottom: 1em;
    p{
      padding-bottom: 1em;
      text-indent: .8em;
      font-size: .9em;
    }
  }
  .search-settings__criteria{
    p{
      padding-bottom: 1em;
      text-indent: .8em;
      font-size: .9em;
      span{
        color: #da0606;
      }
    }
  }
  .search-settings__btn{
    margin: 1em 0 0 .8em;
  }
}
</style>
