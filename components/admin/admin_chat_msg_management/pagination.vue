<template>
  <div class="messages-paginate">
    <div class="messages-paginate__header">
      <span>Total pages: {{ totalPages }}</span>
      <span>Current page</span>
      <el-dropdown size="mini" @command="onChangeUpdateLimit">
        <span class="el-dropdown-link">
          Limit on the page: {{ limit }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="5">5</el-dropdown-item>
          <el-dropdown-item command="10">10</el-dropdown-item>
          <el-dropdown-item command="20">20</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="messages-paginate__controll">
      <el-button size="mini" @click="msgStart">To the start</el-button>
      <el-button size="mini" @click="msgBack">Back</el-button>
      <div class="messages-current__page">{{ currentPage }}</div>
      <el-button size="mini" @click="msgForward">Forward</el-button>
      <el-button size="mini" @click="msgEnd">To the end</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    messages: { type: Array },
    limit: { type: Number },
    goForward: { type: Function },
    goBack: { type: Function },
    updateLimit: { type: Function },
    getCurrentPage: { type: Function },
    updatedModels: {
      type: Object,
      // For objects and arrays default values return from a function
      default: function () {
        return {
          updatedCurrentPage: 0,
          updatedTotalPages: 0
        }
      }
    }
  },
  data(){
    return {
      portionMessages: null,
      currentPage: 1,
      totalPages: 0
    }
  },
  watch:{
    currentPage(val){
      //Watching for the current page state. Call parent function
      this.getCurrentPage(val);
    },
    updatedModels:{
      deep: true,
      handler(updatedModels){
        //console.log("Updated models ",updatedModels.updatedCurrentPage," ",updatedModels.updatedTotalPages);
        this.currentPage = updatedModels.updatedCurrentPage,
        this.totalPages = updatedModels.updatedTotalPages
      }
    }
  },
  methods:{
    msgBack(){
      //Total pages
      let pages = Math.ceil(this.messages.length / this.limit);
      if(pages >= this.currentPage && this.currentPage > 1){
        let prevPage = (this.currentPage - 1);
        //console.log("msgBack ",prevPage);
        //Set the current page
        this.currentPage = prevPage;
        //Calculate the index of the first item of the current page
        let startPageIndex = (prevPage * this.limit) - this.limit;
        this.goBack(startPageIndex);
      }
      //console.log("msgBack ");
    },
    msgForward(){
      //Total pages
      let pages = Math.ceil(this.messages.length / this.limit);
      if(pages > this.currentPage){
        let nextPage = (this.currentPage + 1);
        //console.log("Pages ",pages," Current page ",this.currentPage," Next next ",nextPage);
        //Set the current page
        this.currentPage = nextPage;
        //Calculate the index of the first item of the current page
        let startPageIndex = (nextPage * this.limit) - this.limit;
        this.goForward(startPageIndex);
      }
    },
    msgStart(){
      let totalMessages = this.messages.length;
      //If messages are less than limit do nothing
      if(totalMessages <= this.limit){
        return;
      }
      //Set number of pages by default
      this.currentPage = 1;
      //Emit an event to the parent component with the last
      this.$emit('onGoToTheStart', 0);
    },
    msgEnd(){
      let totalMessages = this.messages.length;
      //If messages are less than limit do nothing
      if(totalMessages <= this.limit){
        return;
      }
      //Total pages
      let pages = Math.ceil(this.messages.length / this.limit);
      //Set the last number of page
      this.currentPage = pages;
      //Calculate last portion of messages
      let withRest = (totalMessages % this.limit);
      const prev = withRest === 0 ? (totalMessages - this.limit) : (this.messages.length - withRest);
      //Emit an event to the parent component with the last
      this.$emit('onGoToTheEnd', prev);
    },
    onChangeUpdateLimit(limit){
      limit = Number(limit);
      if(this.limit != limit){
        //Reset current page
        this.currentPage = 1;
        //Call parent function
        this.updateLimit(limit);
      }
    }
  },
  created(){
    this.portionMessages = this.messages;
    //Total pages
    this.totalPages = Math.ceil(this.messages.length / this.limit);
    // This listener is not needed in SSR-mode - if (process.client) {}
    //this.$eventBus.$on('updatePagination', (dataUpdation) => {
    /*this.$nuxt.$on('update-pagination', (dataUpdation) => {
      //
      console.log("Child updated ",dataUpdation);
    })*/
  }
  /*,
  beforeDestroy () {
    // Make sure to always unsubscribe from events when no longer needed
    //this.$eventBus.$off('updatePagination')
    this.$nuxt.$off('update-pagination')
  }*/
}
</script>

<style lang="scss">
.messages-paginate{
  width: 405px;
  margin: 1em;
  border: 1px solid #c3bebe;
  padding: .5em;
  background-color: #d4c8c8;
}
.messages-paginate__header{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  height:30px;
  background-color: #f6f6f6;
  font-weight: bold;
  margin-bottom: .5em;
  font-size: 12px;
  border-bottom: 1px solid #c3bebe;
  & > span{
    border-right: 1px solid #c3bebe;
    padding-right: 4px;
    width: 30%;
    text-align: center;
  }
  .el-dropdown{
    font-size: 12px!important;
  }
}
.messages-paginate__controll{
  display: flex;
  flex-direction: row;
  justify-content: space-around;
}
.messages-current__page{
  margin: 0 10px;
  border: 1px solid #000;
  width: 30px;
  text-align: center;
  font-weight: bold;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1.2em;
  background-color: #f6f6f6;
}
</style>
