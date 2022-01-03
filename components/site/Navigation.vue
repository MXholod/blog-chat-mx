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
            <!--<el-menu-item index="/about" class="el-menu-sport__item">About me</el-menu-item>-->
            <el-menu-item v-for="staticPage in staticPages" :key="staticPage.name"
              :index="`/${staticPage.name.toLowerCase()}`" class="el-menu-sport__item">
              {{ staticPage.name }}
            </el-menu-item>
            <el-menu-item index="5"
              :style="{ backgroundImage: siteLogo ? `url(/logo/${siteLogo})`: '' }"
              class="el-menu-sport__item el-menu-sport__item_hover"
            ></el-menu-item>
        </el-menu>
        <div class="el-menu-sport__user-space">
          <Authentication v-if="!isAuth" />
          <CabAndChat v-else :userLogin="userLogin" />
        </div>
    </nav>
</template>

<script>
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
        siteLogo: '',
        staticPages: []
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
      async getMenuPages(){
        try{
          const result = await this.$axios.get('/api/menu_page/page');
          if(result.data.pages){
            return result.data.pages;
          }
          throw new Error(result.data.message);
        }catch(e){
          throw e;
        }
      },
      async getSiteLogo(){
        try{
          const result = await this.$axios.$get('/api/settings/logo');
          if(result){
            return result.logo;
          }
        }catch(e){
          throw e;
        }
      },
      async getStaticPages(){
        try{
          const result = await this.$axios.$get('/api/static_page/pages');
          if(result){
            return result.static;
          }
        }catch(e){
          throw e;
        }
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
    },
    mounted(){
      this.getMenuPages().then(result =>{
        if(Array.isArray(result)){
          return result;
        }
      }).then( data =>{
        //The 'createNestedMenuStructure' function is taken from 'plugin'
        this.createdPagesStructure = this.createNestedMenuStructure(data);
      }).catch(e =>{
        //console.log(e);
      });
      //Get site logo
      this.getSiteLogo().then(data =>{
        //Set the site logo
        this.siteLogo =  data;
      }).catch(e => {
        //console.log(e);
      });
      this.getStaticPages().then(data =>{
        //All static pages
        this.staticPages = data
      }).catch(e => {
        console.log(e);
      });
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
      width:160px;
      height:80px;
      /*url('/logo/untitled2-20072021-182431_795.png')*/
      background: transparent 50% 0/160px 80px no-repeat padding-box border-box scroll;
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
