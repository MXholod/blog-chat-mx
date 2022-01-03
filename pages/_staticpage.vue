<template>
  <el-row type="flex" justify="center">
    <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
      <h1 class="static-header">{{ this.staticpage.header }}</h1>
      <div v-html="staticpage.text" class="static-content"></div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  async asyncData({ params, $axios, error, route }) {
    //When calling /about the slug will be "about". 'staticpage' contains a page name
    const pageName = params.staticpage;
    const staticpage = await $axios.$get('/api/static_page/page/'+pageName);
    if(staticpage){
      //Return data for the current static page
      return { staticpage: staticpage.static }
    }else{
      //Redirect to the page 404
      error({
        statusCode: 404,
        message: `Invalid route: ${ route.path }`,
      });
    }
  },
  head(){
    return { title: `${this.staticpage.name}` };
  }
}
</script>

<style lang="scss">
.static-header{
  margin-left: 1em;
}
.static-content{
  margin-top: 1em;
  border: 1px solid #bbbbbb;
  padding: 1em;
  border-radius: 5px;
  background-color: #f6f6f6;;
  p{
    padding: 0 .5em;
    text-indent: .5em;
  }
  ul, ol{
    margin: .5em 1em;
    p{
      text-indent:0em;
      padding: 0;
    }
  }
  hr{
    margin: .5em 0;
  }
  code{
    background-color: #ebe1cc;
    padding:.0 .3em;
  }
}
</style>
