<template>
  <section class="container">
    <el-row>
      <el-col :span="12">
        <h1 class="header-content">{{ result.pageHeader }}</h1>
      </el-col>
      <el-col :span="4">
        <small class="views-content">Total views
          <i class="el-icon-view"></i>
          {{ result.views+1 }}
        </small>
      </el-col>
      <el-col :span="8">
        <span class="date-content">Published on: {{ new Date(result.date).toLocaleString() }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
         <el-divider></el-divider>
      </el-col>
    </el-row>
    <el-row v-if="result.singleImage">
      <el-col :span="24">
        <div class="img-content">
          <img :src="`/pages_img/${result.singleImage}`" alt=""  />
        </div>
      </el-col>
    </el-row>
    <el-row v-if="result.headerBlockOne">
      <el-col :span="24">
        <h3 class="title-content">{{ result.headerBlockOne }}</h3>
      </el-col>
    </el-row>
    <el-row v-if="result.contentBlockOne">
      <el-col :span="24" class="block-content-1">{{ result.contentBlockOne }}</el-col>
    </el-row>
    <el-row v-if="result.headerBlockTwo">
      <el-col :span="24">
        <h3 class="title-content">{{ result.headerBlockTwo }}</h3>
      </el-col>
    </el-row>
    <el-row v-if="result.contentBlockTwo">
      <el-col :span="24" class="block-content-2">{{ result.contentBlockTwo }}</el-col>
    </el-row>
    <el-row v-if="result.headerBlockThree">
      <el-col :span="24">
        <h3 class="title-content">{{ result.headerBlockThree }}</h3>
      </el-col>
    </el-row>
    <el-row v-if="result.contentBlockThree">
      <el-col :span="24" class="block-content-3">{{ result.contentBlockThree }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="18">
        <b class="amount-likes">Amount of likes: {{ totalLikes }}</b>
      </el-col>
      <el-col :span="6">
        <el-button @click="processLike"
          v-if="isUserAuthenticated.login !== ''"
          class="process-like"
          :loading="likeLoadingState"
          :disabled="likeLoadingState">
          <span :class="likeStateChanging ? 'like__img add-like__img' : 'like__img remove-like__img'"></span>
          <span class="add-like__text">
            {{ likeStateChanging ? 'Add like' : 'Cancel "like"' }}
          </span>
        </el-button>
        <el-badge v-else class="like-forbidden">
          Sign up/in to leave a like
        </el-badge>
      </el-col>
    </el-row>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  async asyncData({ $axios, route, redirect, store }){
    try{
      const result = await $axios.get(`/api/menu_page/page/${route.params.pathMatch}/${store.getters['auth/isUserAuthenticated'].jwtToken}`);
      //Query "put" to add one view of the page
      await $axios.$put(`/api/menu_page/page/${route.params.pathMatch}/${result.data.pageContent.views}`);
      return {
        result: result.data.pageContent,
        likeState: result.data.pageContent.likeState,
        totalLikes: result.data.pageContent.likes.length
      }
    }catch(e){
      return redirect('/');
    }
  },
  head () {
    return {
      title: `${this.result.title}`
    }
  },
  computed:{
    ...mapGetters('auth', ['isUserAuthenticated']),
    //If 'likeState' true - add like, otherwise remove like
    likeStateChanging(){
      if(this.likeState){
          return false;
        }
      else{
        return true;
      }
    }
  },
  data(){
    return {
      likeLoadingState: false
    }
  },
  methods:{
    processLike(e){
      this.likeLoadingState = true;
      window.setTimeout(async ()=>{
        try{
          let url = `/api/menu_page/page/likes/like_update/${this.$route.params.pathMatch}`;
          const result = await this.$axios.$put(url);
          if(result.likeState){
            this.likeState = true;
            this.totalLikes = ++this.totalLikes;
          }else{
            this.likeState = false;
            this.totalLikes = --this.totalLikes;
          }
        }catch(e){
            console.log(e);
          }finally{
            this.likeLoadingState = false;
          }
      },3000);
    }
  },
  mounted() {
    if(this.result){
      //console.log("Result ",new Date(this.result.date).toLocaleString());
    }
  }
}
</script>

<style scoped lang="scss">
$container-width: 960px;
.container {
  width: $container-width;
  margin: 0px auto;
  border: 1px solid #ccc;
  box-shadow: 0px 12px 9px -4px #888888
}
.header-content{
  color: #12128f;
  font-size: 1.2em;
  font-family: Tahoma, Verdana, sans-serif;
}
.views-content{
  font-size: .8em;
  font-weight: bold;
  & i{
    margin-left: 5%;
  }
}
.date-content{
  font-size: .8em;
  font-weight: bold;
  padding-left:25%;
}
@mixin content($block:false,$b-color-content:#ccc){
  width: ($container-width - 100px);
  @if $block == false {/* Margin for title-content by default */
    text-indent: .5em;
    margin: 0 35px 1% 35px;
  }@else{/* Margin for block-content by default */
    margin: 0 35px 5% 35px;
    padding: .3em;
    border: 1px solid $b-color-content;
    box-shadow: 0px 12px 9px -10px $b-color-content;
  }
}
.img-content{
  width: $container-width / 2 + 50;
  height: $container-width / 3 + 50;
  margin: 0 auto;
  text-align: center;
  img {
    max-width: 100%;
    display:inline-block;
  }
  img[width]{
    width: auto; /*Defer to max-width*/
  }
  img[wedth][height]{
    height: auto; /*Preserve aspect ratio*/
  }
}
.title-content{
  @include content(false);
}
.block-content-1{
  @include content(true, #3282eb);
}
.block-content-2{
  @include content(true, #2a6dc5);
}
.block-content-3{
  @include content(true, #1e5295);
}
.amount-likes{
  position: relative;
  top: 10px;
  left: 77%;
}
.process-like{
  margin: 0 0 5% 5%;
  border: 1px solid #000;
  border-radius: 5px;
  display: inline-flex;
  padding: .3em 1em;
  &:hover, &:active{
    background-color: #cfdffd;
    justify-content: space-around;
  }
}
.like__img{
  margin-right: .5em;
  width:20px;
  height:20px;
  display:inline-block;
}
.add-like__img{
  background: transparent url('/site_images/likes.png') -21px 0px/40px 40px no-repeat padding-box border-box scroll;
}
.remove-like__img{
  background: transparent url('/site_images/likes.png') 0px -20px/40px 40px no-repeat padding-box border-box scroll;
}
.add-like__text{
  position: relative;
  top: -5px;
}
.like-forbidden{
  font-size: .8em;
  padding: 10px 0 15px 0;
  display: block;
  color: #f53aa2;
}
</style>
