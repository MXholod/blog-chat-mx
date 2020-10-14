<template>
    <nav>
        <el-menu
            router
            :default-active="$route.path"
            class="el-menu-sport"
            mode="horizontal"
            background-color="#225AA4"
            text-color="#fff"
            active-text-color="#12DEF1">
            <el-menu-item index="/" class="el-menu-sport__item" >Sportsman blog</el-menu-item>
            <el-submenu index="2" class="el-menu-sport__item_sub">
                <template slot="title">A sportsman life</template>
                <el-submenu index="2-1">
                    <template slot="title">My nutrition</template>
                    <el-menu-item index="2-1-1">Everyday nutrition</el-menu-item>
                    <el-menu-item index="2-1-2">Nutrition during exercise</el-menu-item>
                </el-submenu>
                <el-submenu index="2-2">
                    <template slot="title">A set of exercises</template>
                    <el-menu-item index="2-2-1">Morning warm-up exercises</el-menu-item>
                    <el-menu-item index="2-2-2">Strength exercises</el-menu-item>
                    <el-menu-item index="2-2-3">Agility exercises</el-menu-item>
                </el-submenu>
            </el-submenu>
            <el-menu-item index="/about" class="el-menu-sport__item">About me</el-menu-item>
            <el-menu-item index="/contacts" class="el-menu-sport__item">Contacts</el-menu-item>
            <el-menu-item index="5" class="el-menu-sport__item el-menu-sport__item_hover"></el-menu-item>
            <el-menu-item index="/chat" class="el-menu-sport__item">Teammates chat</el-menu-item>
        </el-menu>
    </nav>
</template>

<script>
/* eslint-disable */
  export default {
    data() {
      return {
        activeIndex1: '2'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(this.$router.name);
        // console.log(key, keyPath);
        // this.$router.push()
      }
    }
  }
</script>

<style lang="scss">
    .el-menu-sport{
      height:80px;
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
    @mixin aaa($c:violet){
        h1{
            color: $c;
        }
    }
    @include aaa(green);
</style>
