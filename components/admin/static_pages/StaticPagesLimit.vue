<template>
  <div class="page-limit">
    <p class="page-limit__header">
      Admin can set a limit of quantity pages <br />
      <span>This block can only be seen by the administrator</span>
    </p>
    <el-input-number
      v-model="num"
      @change="handleChange"
      :min="0"
      :max="10"
      size="mini"
      :disabled="loading"
    ></el-input-number>
    <el-button
      :disabled="loading"
      :loading="loading"
      @click="updateLimitStaticPages"
      size="mini">
      Update limit of static pages
    </el-button>
  </div>
</template>

<script>
export default {
  props:{
    //Limit sets by admin
    staticLimit: { type:Number, default: 0 },
    //Total amount of pages
    totalStatic: { type:Number, default: 0 },
    updateLimit: { type: Function }
  },
  data(){
    return {
      num: this.staticLimit,
      //maxLimit: this.totalStatic,
      loading: false
    }
  },
  methods:{
    //Calls every time when click on '-' or '+'
    handleChange(v){
      //console.log("Test ",v);
    },
    //Update static pages
    async updateLimitStaticPages(){
      if(this.num > this.totalStatic){
        this.$message({
          message: 'The limit of displayed pages is greater than the existing one',
          type: 'warning'
        });
        return true;
      }
      this.loading = true;
      try{
        const result = await this.$axios.$put('/api/settings/admin/limit',{
          limit: this.num
        });
        if(result){
          window.setTimeout(()=>{
            this.$message({
              message: 'Limit of static pages successfully updated',
              type: 'success'
            });
            this.loading = false;
            //Pass 'limit' value to the parent
            this.updateLimit(this.num);
          },2000);
        }else{
          window.setTimeout(()=>{
            this.$message({
              message: 'Limit of static pages hasn\'t been updated',
              type: 'warning'
            });
            this.loading = false;
          },2000);
        }
      }catch(e){
        this.loading = true;
      }
    }
  }
}
</script>

<style lang="scss">
.page-limit{
  border:1px solid #000;
  width:40%;
  padding:10px;
  border-radius: 5px;
  .page-limit__header{
    margin-bottom: .5em;
    text-indent: .5em;
    span{
      font-size: .9em;
      color:#b82424;
      padding: .3em;
    }
  }
}
</style>
