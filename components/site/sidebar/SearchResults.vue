<template>
  <div class="search-results">
    <slot name="header"></slot>
    <div v-if="searchByPosts" class="search-results__header">
      Posts result: {{ postSearchResults.length }}
    </div>
    <ul v-if="searchByPosts && !!postSearchResults.length" class="search-results__posts">
      <li v-for="post of postSearchResults" :key="post.id">
        <span>
          <nuxt-link
            :to="`/post/${post.id}`" append >
            {{ post.title }}
          </nuxt-link>
        </span>
      </li>
    </ul>
    <hr v-if="searchByPages" />
    <div v-if="searchByPages" class="search-results__header">
      Pages result: {{ pageSearchResults.length }}
    </div>
    <ul v-if="searchByPages && !!pageSearchResults.length" class="search-results__pages">
      <li v-for="page of pageSearchResults" :key="page.id">
        <span>
          <nuxt-link
            :to="`/sport_life/${page.id}`" append >
            {{ page.title }}
          </nuxt-link>
        </span>
      </li>
    </ul>
    <i class="el-icon-loading search-results__loader" v-show="buttonClear"></i>
    <button
      @click="clearResults"
      :disabled="buttonClear"
      class="search-results__clear">
      Clear results
    </button>
  </div>
</template>

<script>
export default {
  props:{
    postSearchResults: { type: Array },
    pageSearchResults: { type: Array },
    searchByPosts: { type: Boolean },
    searchByPages: { type: Boolean },
    clearSearchResults: { type: Function }
  },
  data(){
    return {
      buttonClear: false
    }
  },
  methods:{
    clearResults(){
      this.buttonClear = true;
      //Parent function, which clears props (Arrays)
      this.clearSearchResults();
    }
  }
}
</script>

<style lang="scss" scoped>
.search-results{
  margin-top: 1em;
  position:relative;
  h4{
    padding: .8em .4em .2em;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    text-align: center;
    font-size: .9em;
  }
  .search-results__header{
    font-family: Arial, Helvetica, sans-serif;
    font-size: .8em;
    font-weight: bold;
    padding-left: .7em;
  }
  @mixin search-results-block($color, $percentage){
    list-style-type: none;
    li{
      &:last-child{
        margin-bottom: 0.2em;
      }
      &:hover, &:active{
        background-color: lighten($color: $color, $amount: $percentage);
      }
      padding-left: 0.3em;
      transition: background-color 1s;
      a{
        font-family: Arial, Helvetica, sans-serif;
        font-size: .8em;
        text-decoration: none;
        &:link, &:visited{
          color:#225aa4;
        }
      }
    }
  }
  .search-results__posts{
    @include search-results-block(#225aa4, 55%);

  }
  .search-results__pages{
    @include search-results-block(#7467ac, 40%);
  }
  .search-results__loader{
    position:absolute;
    left:30%;
    bottom:1%;
  }
  .search-results__clear{
    width: 43%;
    margin-left: 50%;
    font-size: .8em;
    text-align: center;
    color:#f6f6f6;
    padding: .2em .3em;
    background-color: lighten($color: #225aa4, $amount: 20%);
    border-radius: 5px;
    transition: background-color 1.5s;
    &:hover, &:active{
      background-color: lighten($color: #225aa4, $amount: 50%);
      color:#3f3d3d;
    }
    &:disabled{
      background-color: #f6f6f6;
      color:#9c9c9c
    }
  }
}
</style>
