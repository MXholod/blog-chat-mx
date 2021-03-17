<template>
    <nav class="el-menu-sport-nav">
        <el-menu
            router
            :default-active="$route.path"
            class="el-menu-sport"
            mode="horizontal"
            background-color="#225AA4"
            text-color="#fff"
            active-text-color="#12DEF1">
            <el-menu-item index="/" class="el-menu-sport__item" >Sportsman blog</el-menu-item>
            <el-submenu index="/sport_life" class="el-menu-sport__item_sub">
              <template slot="title">A sportsman life</template>
              <parent-item :parentData="createdPagesStructure" />
            </el-submenu>
            <el-menu-item index="/about" class="el-menu-sport__item">About me</el-menu-item>
            <el-menu-item index="/contacts" class="el-menu-sport__item">Contacts</el-menu-item>
            <el-menu-item index="5" class="el-menu-sport__item el-menu-sport__item_hover"></el-menu-item>
        </el-menu>
        <div class="el-menu-sport__user-space">
          <Authentication v-if="!isAuth" />
          <CabAndChat v-else :userLogin="userLogin" />
        </div>
    </nav>
</template>

<script>
/* eslint-disable */
import Authentication from '@/components/site/user_space/Authentication';
import CabAndChat from '@/components/site/user_space/CabAndChat';
import ParentItem from '@/components/site/navigation_recursion/ParentItem';
import { mapState } from 'vuex';
  export default {
    components: {
      Authentication,
      CabAndChat,
      ParentItem
    },
    data() {
      return {
        activeIndex1: '2',
        isAuth: false,
        createdPagesStructure:null,
        pages : [
          { id:1, pageName: "Top item 1", parent:undefined , item: [0,0] },//top
          { id:2, pageName: "Sub item 1-1", parent:[0,0] , item: [0,1] },
          { id:3, pageName: "Sub item 1-1-1", parent:[0,1] , item: [0,2] },
          { id:4, pageName: "Sub item 1-1-2", parent:[0,1] , item: [1,2] },
          { id:5, pageName: "Sub item 1-1-2-1", parent:[1,2] , item: [0,3] },
          { id:6, pageName: "Top item 2", parent:undefined , item: [1,0] },//top
          { id:7, pageName: "Top item 3", parent:undefined , item: [2,0] },//top
          { id:8, pageName: "Sub item 3-1", parent:[2,0] , item: [2,1] },
          { id:9, pageName: "Sub item 3-2", parent:[2,0] , item: [2,2] },
          { id:10, pageName: "Top item 4", parent:undefined , item: [3,0] },//top
        ]
      };
    },
    computed: {
      authUser(){
        return this.$store.getters['auth/isUserAuthenticated'];
      },
      ...mapState('auth',{
        userLogin: (state)=>{ return state.user.login;}
      })
    },
    watch:{
      authUser(val){
        this.isAuth = val.login === '' ? false : true;
      }
    },
    methods: {
      handleSelect(key, keyPath) {
        // console.log(this.$router.name);
      },
      createNestedMenuStructure(pages){
				const topArr = [];
				const pagesArr = [];
				//Only for top level parents
				if(pages.length !== 0){
					let i = 0;
					while(i < pages.length){
						//Only top level items
						if(pages[i].parent === undefined){
							topArr.push(pages[i]);
						}else{
							//Push other pages
							pagesArr.push(pages[i]);
						}
            //Create prop. as an empty array to all objects in list, we may use - Object.defineProperties();
            pages[i].childrenItems = [];
						i++;
					}
          //Return result of the 'recursion'
				  return this.recursion(topArr,pagesArr);
				}else{
          return null;
        }
			},
      recursion(parentArr,pages){
        //Iterate parents
        for(let curParent of parentArr){
          //Iterate pages
          for(let curPage of pages){
            //Get only linked pages with parent
            if((curParent.item[0] === curPage.parent[0]) && (curParent.item[1] === curPage.parent[1])){
              //If we have relation between Parent and Child
              curParent.childrenItems.push(curPage);
              //Call 'recursion once again'
              this.recursion(curParent.childrenItems,pages);
            }
          }
        }
        return parentArr;
      }
    },
    created(){
      if(this.$store.state.auth.user){
          if(this.$store.state.auth.user.login === ''){
            this.isAuth = false;
          }else{
            this.isAuth = true;
          }
      }else{
        this.isAuth = false;
      }
      this.createdPagesStructure = this.createNestedMenuStructure(this.pages);
    }
  }
</script>

<style lang="scss">
    .el-menu-sport-nav::after{
      content: '';
      display: block;
      clear:both;
    }
    $menu-height: 80px;
    .el-menu-sport{
      height:$menu-height;
      width:80%;
      float:left;
      display:flex;
      flex-direction: row;
    }
    .el-menu-sport__item{
      height:100% !important;
      font-size:1.2rem;
      flex-grow: 1;
    }
    .el-menu-sport__item_hover{
      flex-grow: 12;
      background: transparent url('/Places.png') 50% 0/160px 80px no-repeat padding-box border-box scroll;
      &:hover{
        background-color: transparent !important;
      }
    }
    .el-menu-sport__item_sub{
      flex-grow: 1;
      & div.el-submenu__title{
        height:78px !important;
        font-size:1.2rem;
      }
    }
    .el-menu-sport__user-space{
      background-color: #45a5e6;
      background-image: radial-gradient(#45a5e6, #225AA4);
      width:20%;
      height:$menu-height;
      float: right;
    }
</style>
