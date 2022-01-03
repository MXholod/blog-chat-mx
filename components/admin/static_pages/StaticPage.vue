<template>
  <div class="static-page">
    <div>
      <h3>Page name</h3>
      <el-input
        :readonly="componentPorpose === 'creation' ? false : true"
        placeholder="Page name"
        v-model="pageNameStatic"
        size="medium"
        class="static-page__input"></el-input>
    </div>
    <div>
      <div><h3 style="display:inline-block;">Page header</h3>
        (Header before content on the page)
      </div>
      <el-input
        placeholder="Page header"
        v-model="pageHeaderStatic"
        size="medium"
        class="static-page__input"></el-input>
    </div>
    <static-page-text
      :text="pageTextStatic"
      :getTextStatic="getTextStatic"
      :key="updateText"
    />
    <div class="static-page__buttons">
    <el-button size="mini" class="static-page__btn"
      :loading="loaderBtn"
      :disabled="loaderBtn"
      @click="saveStaticPageData">
      Save data page
    </el-button>
    <el-button size="mini" class="static-page__btn"
      :disabled="loaderBtn"
      @click="clearStaticPageData">
      Reset fields
    </el-button>
    </div>
  </div>
</template>

<script>
import StaticPageText from './StaticPageText.vue';
export default {
  props:{
    pageName: { type: String, default: '' },
    pageHeader: { type: String, default: '' },
    pageText: { type: String, default: '' },
    clearSelectedPage: { type: Function },
    componentPorpose: { type: String },
    selectedPage: { type: String }
  },
  components:{
    StaticPageText
  },
  data(){
    return {
      pageNameStatic: this.pageName,
      pageHeaderStatic: this.pageHeader,
      pageTextStatic: this.pageText,
      updateText: 0,
      sendData: false
    }
  },
  computed:{
    loaderBtn(){
      if(this.componentPorpose === 'creation'){
        if(this.pageNameStatic === '' && this.pageHeaderStatic === '' && this.pageTextStatic === '' && this.sendData){
          this.sendData = false;
          return false
        }else if(this.pageNameStatic !== '' && this.pageHeaderStatic !== '' && this.pageTextStatic !== '' && this.sendData){
          return true;
        }else{
          this.sendData = false;
          return false;
        }
      }
      if(this.componentPorpose === 'updation'){
        if(this.pageNameStatic === '' && this.pageHeaderStatic === '' && this.pageTextStatic === '' && this.sendData && this.selectedPage === ''){
          this.sendData = false;
          return false
        }else if(this.pageNameStatic !== '' && this.pageHeaderStatic !== '' && this.pageTextStatic !== '' && this.sendData && this.selectedPage !== ''){
          return true;
        }else{
          this.sendData = false;
          return false;
        }
      }
    }
  },
  methods:{
    saveStaticPageData(){
      if(this.pageNameStatic.trim().length === 0){
        this.$message({
          showClose: true,
          message: "The 'name' for static page is absent",
          type: 'warning'
        });
        return true;
      }
      if(this.pageHeaderStatic.trim().length === 0){
        this.$message({
          showClose: true,
          message: "The 'header' for static page is absent",
          type: 'warning'
        });
        return true;
      }
      if(this.pageTextStatic.trim().length === 0){
        this.$message({
          showClose: true,
          message: "The 'text' for static page is absent",
          type: 'warning'
        });
        return true;
      }
      this.sendData = true;
      //Raising data to the highest level
      this.$emit('savePageData', {
        pageName: this.pageNameStatic,
        pageHeader: this.pageHeaderStatic,
        pageText: this.pageTextStatic
      });
    },
    //Reset all fields
    clearStaticPageData(){
      this.pageNameStatic = '',
      this.pageHeaderStatic = '',
      this.pageTextStatic = '';
      this.updateText++;
      this.clearSelectedPage('');
    },
    //This function calls in child component
    getTextStatic(text){
      this.pageTextStatic = text;
    }
  }
}
</script>

<style lang="scss" scoped>
.static-page{
  .static-page__input{
    width:30%;
  }
  .static-page__buttons{
    margin-top: .5em;
    .static-page__btn:last-child{
      background-color: #f5dfb6;
      color:#000;
      &:hover,&:active,&:visited{
        color:#8a8888;
      }
    }
  }
}
</style>
