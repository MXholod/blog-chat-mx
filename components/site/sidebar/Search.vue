<template>
  <div class="search">
    <span class="search__header">Search by posts or pages</span>
    <input type="text"
      v-on:input="(e)=> search = e.target.value"
      :value="search"
      class="search__field" />
    <div class="search_options">
      <el-checkbox v-model="posts">Posts</el-checkbox>
      <el-checkbox v-model="pages">Pages</el-checkbox>
    </div>
    <button class="search__button"
      :class="loading ? 'search_disabled' : ''"
      @click="startSearching"
      :disabled="loading">
      <i class="el-icon-loading search__loading" v-show="loading && !resetSearch"></i>
      Search
    </button>
    <search-results
      v-if="searchResultVisibilityComputed"
      :postSearchResults="postSearchResults"
      :pageSearchResults="pageSearchResults"
      :clearSearchResults="clearSearchResults"
    >
      <template v-slot:header>
        <h4 :style="{background: '#b3c9e9'}">Search results</h4>
      </template>
    </search-results>
  </div>
</template>

<script>
import SearchResults from './SearchResults';
export default {
  components:{
    SearchResults
  },
  data(){
    return {
      search: '',
      loading: false,
      resetSearch: false,
      posts: false,
      pages: false,
      postSearchResults: [],
      pageSearchResults: []
    }
  },
  computed:{
    searchResultVisibilityComputed(){
      if(this.postSearchResults.length || this.pageSearchResults.length){
        return true;
      }else{
        return false;
      }
    }
  },
  methods:{
    startSearching(e){
      e.preventDefault();
      if(!this.posts && !this.pages){
        this.$message({
          message: "You must select posts or pages, or both, to perform a search",
          type: 'warning'
        });
        return true;
      }
      if(this.search.length === 0){
        this.$message({
          message: "The search field is empty!",
          type: 'warning'
        });
        return true;
      }
      this.loading = true;
      try{
        // Compose url
        const url = `api/sidebar/search/${this.search}?posts=${this.posts}&pages=${this.pages}`;
        setTimeout(async ()=>{
          const result = await this.$axios.$get(url);
          if(result && result.data){
            //If nothing found
            if((result.data.posts.length === 0) && (result.data.pages.length === 0)){
              this.$message({
                message: "Nothing found!",
                type: 'warning'
              });
              this.loading = false;
              this.search = '';
              return true;
            }
            //If we've found results
            this.postSearchResults = result.data.posts;
            this.pageSearchResults = result.data.pages;
          }
          this.loading = false;
          this.search = '';
        }, 2000);
      }catch(e){

      }
    },
    //This function will be called by child component
    clearSearchResults(){
      this.loading = true;
      this.resetSearch = true;
      //Reset search result
      setTimeout(()=>{
        this.postSearchResults = [];
        this.pageSearchResults = [];
        this.loading = false;
        this.resetSearch = false;
      },2000);
    }
  }
}
</script>

<style lang="scss" scoped>
$main-color: #225aa4;
.search{
  border: 1px solid $main-color;
  padding: .5em;
  border-radius: 5px;
  margin-bottom: 1em;
  .search__header{
    display:inline-block;
    width:100%;
    padding-bottom: .5em;
    text-align: center;
    font-weight: bold;
    font-size: .8em;
    font-family: Verdana, Arial, Helvetica, sans-serif;
  }
  .search__field{
    border: 1px solid $main-color;
    border-radius: 5px;
    width:100%;
    padding:3px 2px;
  }
  .search_options{
    padding: .5em;
    display:flex;
    flex-direction: row;
    justify-content: space-around;
  }
  .search__button{
    width:50%;
    border: 1px solid #000;
    border-radius: 5px;
    padding: 1px 3px;
    margin-left: 25%;
    background-color: lighten($color: $main-color, $amount: 30%);
    transition: background-color 2s;
    position: relative;
    &:hover, &:active{
      background-color: lighten($color: $main-color, $amount: 45%);
      .search__loading{
        color: darken($color: $main-color, $amount: 30%);
      }
    }
    .search__loading{
      color: lighten($color: $main-color, $amount: 50%);
      position:absolute;
      top:10%;
      left:5%;
    }
    &.search_disabled{
      border: 1px solid #d6d6d6;
    }
  }
}
</style>
