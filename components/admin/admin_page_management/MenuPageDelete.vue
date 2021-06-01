<template>
  <div class="menu-page-content">
    <h3 class="menu-page-content__header">
      {{ idsToDelete.length === 1 ? 'This page '+menuItemHeader : 'These pages '+menuItemHeader }}
    </h3>
    <div class="menu-page-content__amount">
      Number of pages to delete: <span>{{ idsToDelete.length }}</span>
    </div>
    <div class="menu-page-content__wrapper-cascader">
      <el-cascader-panel
        :options="pagesToDelete"
        class="menu-page-content__cascader"
      ></el-cascader-panel>
    </div>
    <el-button
      type="danger"
      plain size="mini"
      v-on:click="deleteChoosenData"
      :disabled="buttonStateChanging"
      :loading="loading"
    >
      {{ idsToDelete.length === 1 ? 'Delete item' : 'Delete items' }}
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    deletePagesData: Array,
    menuItemHeader: String,
    onDeletePages: Function
  },
  data(){
    return {
      pagesToDelete:null,
      idsToDelete: new Array(),
      loading: false
    }
  },
  computed:{
    buttonStateChanging(){
      if(!!this.idsToDelete.length){
        return false;
      }else{
        return true;
      }
    }
  },
  methods:{
    preparedPageToDelete(pagesId){
      if(!pagesId) return null;
      //Clicked page object
      let clickedPage = pagesId[0];
      //
      this.pagesToDelete = this.allPagesToDelete(clickedPage, []);
    },
    //Prepare pages for removing
    //'clickedPage' - data is a tree,
    //'result' - contains data for element UI,
    //'idsToDelete' - contains page IDs for removing
    allPagesToDelete(clickedPage, result){
      //Copy the first insert
      result.push({
        value: clickedPage.pageName,
        label: clickedPage.pageName,
        children: []
      });
      //Insert the first ID to remove page
      this.idsToDelete.push(clickedPage.id);
      //Only clicked page without children
      if(clickedPage.childrenItems.length === 0){
        //console.log("Empty ",clickedPage.childrenItems);
      }else{
        //Clicked page with children
        //console.log("Not empty ",clickedPage.childrenItems);
        recursion.call(this, clickedPage.childrenItems, result[0].children);
      }
      //1.Array list of data 2.Parent array which will be filled with the data
      function recursion(arrPages, parentArr){
          for(let i = 0;i < arrPages.length; i++){
            if(arrPages[i].childrenItems.length > 0){
              parentArr.push({
                value: arrPages[i].pageName,
                label: arrPages[i].pageName,
                children: []
              });
              //Insert the first ID to remove page
              this.idsToDelete.push(arrPages[i].id);
              //The element just added and its 'children' pass as an empty array
              recursion.call(this, arrPages[i].childrenItems, parentArr[i].children);
            }else{
              parentArr.push({
                value: arrPages[i].pageName,
                label: arrPages[i].pageName,
                children: []
              });
              //Insert the first ID to remove page
              this.idsToDelete.push(arrPages[i].id);
            }
          }
        }
      return result;
    },
    deleteChoosenData(e){
      if(!!this.idsToDelete.length){
        this.loading = true;
          const result = this.$axios.delete('/api/menu_page/page/delete', {
            data: { ids: this.idsToDelete }
          });
          result.then((response) => {
            const { message } = response.data;
            setTimeout(()=>{
              this.onDeletePages(true);
              this.idsToDelete = new Array();
              this.$message({
                showClose: true,
                message: message,
                type: 'success'
              });
            },1000);
          }).catch((e) => {
            this.$message({
              showClose: true,
              message: e,
              type: 'error'
            });
          }).finally(()=>{
            setTimeout(()=>{
              this.loading = false;
            },1000);
          });
      }else{
        //console.log("There is not an item");
      }
    }
  },
  created(){
    //this.deletePagesData - clicked page
    this.preparedPageToDelete(this.deletePagesData);
  }
}
</script>

<style lang="scss">
.menu-page-content{
  width: 600px;
  margin: 2% auto 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  .menu-page-content__header{
    margin-bottom: 0.8em;
    text-align: center;
    color: #2b17d4;
  }
}
.menu-page-content__amount{
  padding: 0 0 0.5em 0.25em;
  font-size: 0.8em;
  color: #d82828;
  span{
    font-size: 1.1em;
    font-weight:bold;
  }
}
.menu-page-content__wrapper-cascader{
  overflow-x: auto;
  width: 580px;
  margin-bottom: 0.5em;
  .menu-page-content__cascader{
    border: none;
    .el-scrollbar.el-cascader-menu{
      /*min-width: 150px;*/
      background-color: whitesmoke;
      border: 1px solid #E4E7ED;
    }
  }
}
</style>
