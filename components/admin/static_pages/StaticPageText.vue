<template>
  <div class="article">
    <h3>Text content for the static page</h3>
    <span class="article__raw-header">Raw HTML data for DB</span>
    <div class="article__raw-data">{{ articleText }}</div>
    <tiptap v-model="articleText" />
  </div>
</template>

<script>
export default {
  props:{
    text: { type: String, default: '' },
    getTextStatic: { type: Function }
  },
  data() {
    return {
      articleText: this.text
    }
  },
  watch:{
    articleText(current, previous){
      this.getTextStatic(current);
    }
  },
  methods:{
    getHeader(){
      console.log("Header ",this.header," ",this.articleText);
    },

  }
}
</script>

<style lang="scss" scoped>
.article{
  background-color: #f6f6f6;
  border-radius: 5px;
  padding: .5em;
  margin-top: .5em;
  .article__raw-header{
    font-size: .9em;
    font-weight: bold;
    margin-left: 5%;
  }
  .article__raw-data{
    margin: 0 0 0 0.8em;
    width: 92%;
    border: 1px solid #615e5e;
    background-color: #e0dddd;
    padding: .5em;
  }
  .article__btn{
    position:relative;
    top: -5px;
    left:15px;
  }
}
</style>
