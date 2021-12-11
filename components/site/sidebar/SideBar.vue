<template>
  <el-aside class="sidebar">
    <Search v-if="(searchSettings !== null) && (searchSettings.searchVisibility)"
      :searchByPosts="searchSettings.searchByPosts"
      :searchByPages="searchSettings.searchByPages"
    />
    <sidebar-block v-if="!!popularPosts.length"
      :blockData="popularPosts"
      blockType="posts"
      blockUrlPart="post"
      blockInfo="views">
      <template v-slot:header>
        <h4 :style="{background: '#7097ce'}">Popular posts</h4>
      </template>
    </sidebar-block>
    <sidebar-block v-if="!!popularPages.length"
      :blockData="popularPages"
      blockType="pages"
      blockUrlPart="sport_life"
      blockInfo="views">
      <template v-slot:header>
        <h4 :style="{background: '#627fa9'}">Popular pages</h4>
      </template>
    </sidebar-block>
    <sidebar-block v-if="!!recentPosts.length"
      :blockData="recentPosts"
      blockType="posts"
      blockUrlPart="post"
      blockInfo="date">
      <template v-slot:header>
        <h4 :style="{background: '#8f78d9'}">Recent posts</h4>
      </template>
    </sidebar-block>
    <sidebar-block v-if="!!recentPages.length"
      :blockData="recentPages"
      blockType="pages"
      blockUrlPart="sport_life"
      blockInfo="date">
      <template v-slot:header>
        <h4 :style="{background: '#6e56b5'}">Recent pages</h4>
      </template>
    </sidebar-block>
  </el-aside>
</template>

<script>
import SidebarBlock from './SidebarBlock';
import Search from './Search';
export default {
  props: {
    sidebarBlocks: { type: Object }
  },
  components:{
    SidebarBlock,
    Search
  },
  watch:{
    'sidebarBlocks.searchSettings':{
      handler: function (after, before) {
        //console.log("Changes ", before," ",after);
        this.searchSettings = after;
      },
      deep: true
    },
    'sidebarBlocks.popularPosts':{
      handler: function (after, before) {
        //console.log("Changes ", before," ",after);
        this.popularPosts = after;
      },
      deep: true
    },
    'sidebarBlocks.popularPages':{
      handler: function (after, before) {
        //console.log("Changes ", before," ",after);
        this.popularPages = after;
      },
      deep: true
    },
    'sidebarBlocks.recentPosts':{
      handler: function (after, before) {
        //console.log("Changes ", before," ",after);
        this.recentPosts = after;
      },
      deep: true
    },
    'sidebarBlocks.recentPages':{
      handler: function (after, before) {
        //console.log("Changes ", before," ",after);
        this.recentPages = after;
      },
      deep: true
    }
  },
  data(){
    return {
      //Get 'searchSettings', 'popularPosts', 'popularPages', 'recentPosts', 'recentPages'
      ...this.sidebarBlocks
    }
  },
  mounted(){
    //console.log("Sidebar blocks ",this.sidebarBlocks);
  }
}
</script>

<style lang="scss">
@keyframes sidebar{
  0% { left: -250px; }
  90% { left: 10px; }
  100% { left: 0px; }
}
.sidebar{
  max-width: 250px;
  padding: .5em .8em;
  position:relative;
  top:3%;
  left:-250px;
  height: 94%;
  border: 1px solid #000;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  animation: sidebar 3s ease-out 3s 1 normal forwards;
  &:hover, &:active{
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }
}
</style>
