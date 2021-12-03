<template>
  <div>
    <div v-if="Array.isArray(dataList) && (dataList.length > 0)" class="block-list">
      <header class="block-list__header">
        <div>
          <slot name="title"></slot>
        </div>
        <label>Block
          <span :class="(visibility === false) ? 'block-list__on' : ''">On</span>
          /
          <span :class="(visibility === true) ? 'block-list__off' : ''">Off</span>
          <input type="checkbox" v-model="visibility" :disabled="loading" />
        </label>
      </header>
      <main class="block-list__main">
        <div v-if="Array.isArray(dataList) && dataList.length > 0">
          <ul>
            <li v-for="(item, index) of dataList" :key="item.id" :class="(item.views && item.pageHidden) || (item.date && item.pageHidden) ? 'block-list__hidden-page' : ''">
              <div v-if="index <= 9" class="block-list__top-ten">
                <span>{{ item.title }}</span>
                <span v-if="item.views >= 0">Views: {{ item.views }}</span>
                <span v-if="item.date">{{ new Date(item.date).toLocaleString() }}</span>
              </div>
              <div v-else>
                <span>{{ item.title }}</span>
                <span v-if="item.views">Views: {{ item.views }}</span>
                <span v-if="item.date">{{ new Date(item.date).toLocaleString() }}</span>
              </div>
            </li>
          </ul>
        </div>
      </main>
      <footer class="block-list__footer">
        <div>
          <div>
            <span>Limit of displayed items: </span>
            <span>{{ limit }}</span>
          </div>
          <el-input-number
            size="small"
            v-model="itemAmount"
            @change="handleChange"
            :min="1"
            :max="maxItems"
            :disabled="loading">
          </el-input-number>
        </div>
        <el-button @click="saveBlockChanges"
          :loading="loading"
          :disabled="loading"
          size="mini"
          class="block-list__footer-btn">
          Save changes
        </el-button>
      </footer>
      <div v-if="visibility" class="el-icon-lock block-list__lock"></div>
    </div>
    <div v-else-if="Array.isArray(dataList) && dataList.length === 0">
      <p>Data is absent</p>
    </div>
    <div v-else>
      <i class="el-icon-loading"></i>
      <div v-if="dataList === null && loadAgainButton">
        <el-button @click="uploadDataAgain" size="mini">
          Load data again
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    parentBlock:{ type: String },
    dataList: {
      required: true,
      validator: prop => {
        if(((typeof prop === 'object') && Array.isArray(prop)) || prop === null){
          return true;
        }
        return false;
      }
    },
    loadAgainButton: { type: Boolean },
    settings: {
      type: Object,
      // For objects or arrays, default values are returned from the function
      default: function () {
        return {
          //limit: { type: Number, default: 0 },
          //visibility: { type: Boolean, default: true }
       }
      }
    },
    loadingStatus: { type: Boolean }
  },
  data(){
    return {
      itemAmount: 1,
      loading: false,
      limit: this.settings.limit,
      visibility: !this.settings.visibility
    }
  },
  watch:{
    loadingStatus(val){
      //When 'loadingStatus' changes set the 'loading' to false
      this.loading = false;
    },
    //Watching for object nested property
    'settings.limit':{
      handler: function (after, before) {
        //console.log("Changes ", before," ",after);
        this.limit = after;
      },
      deep: true
    },
    //Watching for object nested property
    'settings.visibility':{
      handler: function (after, before) {
        //console.log("Changes 2 ", before," ",after);
        this.visibility = !after;
      },
      deep: true
    }
  },
  computed:{
    maxItems(){
      //Return maximum amount of items
      if(this.dataList === null){
        return 10;
      }
      else if(Array.isArray(this.dataList) && this.dataList.length > 10){
        return 10;
      }
      else if(Array.isArray(this.dataList) && this.dataList.length < 10){
        return this.dataList.length;
      }
    }
  },
   methods: {
    handleChange(value) {
      //console.log(value)
    },
    //Pass data to the parent to show the block
    uploadDataAgain(){
      this.$emit('blockType', this.parentBlock);
    },
    //Pass data to the parent to update the block
    saveBlockChanges(){
      //Freeze 'submit' button
      this.loading = true;

      this.$emit('blockUpdateData', {
        newVisibility: !this.visibility, //Inverse visibility back correct value
        newLimit: this.itemAmount,
        blockType: this.parentBlock,
        loadingStatus: this.loadingStatus
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@keyframes hidden-page{
  0%{ border-color: #cc06cc; }
  20%{ border-color: #860505; }
  40%{ border-color: #cc06cc }
  60%{ border-color: #860505; }
  80%{ border-color: #cc06cc }
  100%{ border-color: #860505; }
}
.block-list{
  border: 1px solid #cacaca;
  box-shadow: 0px 2px 8px 1px #adadad;
  padding: .5em;
  margin: .5em;
  max-width:33%;
  position: relative;
  .block-list__lock{
    position: absolute;
    top:50px;
    bottom:0;
    left:0;
    right:0;
    background-color: rgba(202,202,202, .8);
    z-index:999;
    &::before{
      font-size: 4em;
      display: inline-block;
      margin: 10% 0 0 40%;
    }
  }
  .block-list__header{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding-bottom:.5em;
    border-bottom:1px solid #cacaca;
    label{
      color:#225aa4;
      font-size: .9em;
      font-weight:bold;
      .block-list__on{
        color: #0f0;
      }
      .block-list__off{
        color:#f00;
      }
    }
  }
  .block-list__main{
    padding: .8em 0;
    ul{
      list-style-type: none;
      li{
        padding-top:.4em;
        position:relative;
        &.block-list__hidden-page{
          overflow: hidden;
          &::before{
            content: 'The page is hidden';
            position:absolute;
            display:block;
            height:15px;
            top:10px;
            right:-36%;
            padding:1px 5px;
            border-left: 10px solid #d31111;
            color:#b30606;
            font-size:.8em;
            text-align: center;
            background-color: #ebdcdc;
            animation: hidden-page 5s linear 1s infinite alternate backwards;
            transition: 2s right;
          }
          &:active:before{
            right:0;
          }
        }
        span{
          display:inline-block;
          font-size: .9em;
          &:first-child{
            width:69%;
            padding: 0 0 .3em .3em;
          }
          &:last-child{
            width:29%;
            font-size: .8em;
            padding-top: .3em;
          }
        }
      }
      & > li:first-child{
        padding-top: 0em;
      }
    }
    .block-list__top-ten{
      background-color: lighten($color: #77AAED, $amount: 7);
    }
  }
  .block-list__footer{
    & > div{
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      border-top: 1px solid #cacaca;
      padding-top: .5em;
      div{
        span{
          font-size: .9em;
          font-weight:bold;
        }
        span:first-child{
          font-size: .8em;
        }
        span:last-child{
          color:#225aa4;
        }
      }
    }
    .block-list__footer-btn{
      position: relative;
      z-index:1000;
    }
  }
}
</style>
