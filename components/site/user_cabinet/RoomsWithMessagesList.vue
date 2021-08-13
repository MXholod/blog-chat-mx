<template>
  <div>
    <div v-if="Array.isArray(allRoomsData)">
      <el-table
        :data="allRoomsData"
        style="width: 100%">
        <el-table-column
          prop="roomName"
          label="Room name"
          width="180">
        </el-table-column>
        <el-table-column
          prop="roomDescription"
          label="Room description"
          width="180">
        </el-table-column>
        <el-table-column
          prop="totalMessages"
          label="Total messages in the room">
        </el-table-column>
      </el-table>
    </div>
    <div class="data-absent" v-else>
      <!--Request went but interrupted, JWT expired, show this loader-->
      <el-button v-if="!loading"
        @click="getAllRoomsWithMessages"
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
import Loader from '../../Loader.vue';
export default {
  components:{
    Loader
  },
  data(){
    return {
      allRoomsData: null,
      loading: false
    }
  },
  methods:{
    //This method is invoked by the parent component using 'ref'
    async getAllRoomsWithMessages(){
      try{
        this.loading = true;
        const result = await this.$axios.$get('/api/cabinet/user-chat-messages');
        if(result?.roomsData){
          window.setTimeout(()=>{
            this.allRoomsData = result.roomsData;
            this.loading = false;
          }, 1500);
        }else{
          this.loading = false;
        }
      }catch(e){
        console.log(e);
        this.loading = false;
      }
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
</style>
