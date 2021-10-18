<template>
  <div>
    <div v-if="Array.isArray(allPostsData)">
      <el-table
        :data="allPostsData"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="Post title"
          max-width="50">
        </el-table-column>
        <el-table-column
          prop="comments"
          label="Comments to the post"
          max-width="50"
          align="center">
        </el-table-column>
      </el-table>
      <div class="total-comments">Total comments: {{ totalComments }}</div>
    </div>
    <div class="data-absent" v-else>
      <!--Request went but interrupted, JWT expired, show this loader-->
      <el-button
        @click="getAllPostsWithComments"
        :disabled="loading"
        :loading="loading"
        size="mini"
        class="reload-button"
      >
        Load list again
      </el-button>
      <span class="before-loader"></span>
      <div class="loader">
        <Loader />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      allPostsData: null,
      totalComments: 0,
      loading: false
    }
  },
  methods:{
    getAllPostsWithComments(){
      const result = new Promise((resolve, reject)=>{
          this.$axios.$get('/api/cabinet/posts/comments').then((data)=>{
            resolve(data);
          }).catch((e)=>{
            reject(e.message);
          });
        });
        result.then((dataPosts)=>{
          this.allPostsData = dataPosts.arrComments;
          this.totalComments = dataPosts.totalComments;
        }).catch(e => {
          //console.log("Error ",e);
        });
    }
  }
}
</script>

<style lang="scss">
.before-loader{
  display:inline-block;
  height:30px;
  width:100px;
}
.loader{
  transform: scale(.5,.5);
  position: absolute;
  top: -50%;
  right: 50%;
}
.reload-button{
  position: relative;
  top:-5px;
}
.data-absent{
  height:2.5em;
}
.total-comments{
  color: #225aa4;
  font-size: .9em;
  margin: 0.5em 0 0 57.5%;
  font-weight: bold;
}
</style>
