<template>
  <section class="container">
    <el-row>
      <el-col :span="16">
        <h1 class="header-content">{{ result.pageHeader }}</h1>
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
  </section>
</template>

<script>
export default {
  async asyncData({ $axios, route, redirect }){
    try{
      const result = await $axios.get(`/api/menu_page/page/${route.params.pathMatch}`);
      return { result: result.data.pageContent }
    }catch(e){
      return redirect('/');
    }
  },
  head () {
    return {
      title: `${this.result.title}`
    }
  },
  mounted() {
    //console.log("Reference ",this.$route.params);
    if(this.result){
      //console.log("Result ",this.result.date);
      //console.log("Result ",new Date(this.result.date).toLocaleString());
    }
  }
}
</script>

<style scoped  lang="scss">
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
</style>
