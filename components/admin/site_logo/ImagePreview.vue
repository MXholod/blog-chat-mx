<template>
  <div>
    <div v-if="imageLink !== ''" class="image-loader__preview">
      <figure :style="{ width:'75px', height:'75px',marginTop: '1.3em' }">
        <img
          v-show="isImageLoaded"
          :src="isImageLoaded ? `/logo/${this.imageLink}` : src"
          alt="Page image"
          :load="loadImage()"
        />
        <loader v-if="!isImageLoaded" class="pre-loader" />
      </figure>
      <div class="image-loader__warning-block">
        <h4>This is your site logo</h4>
        <el-alert v-if="previewWarning"
          :title="`Warning! Your current site logo will be replaced with the ${uploadedImgName}`"
          type="warning"
          :closable="false"
          class="image-loader__warning"
          show-icon
          ></el-alert>
      </div>
      <button
          type="button"
          @click="deleteLogo"
          class="logo__delete"
        >Delete logo</button>
    </div>
    <div v-else class="logo__icon">
      <i class="el-icon-picture-outline"></i>
      <span>Logo image for this site is absent</span>
    </div>
  </div>
</template>

<script>
import Loader from './../../Loader.vue';
export default {
  props:{
    imageLink: { type: String, default: '' },//Image from the site folder
    previewWarning: { type: Boolean, default: false },
    uploadedImgName: { type: String, default: '' },//Temp image name
    onDeleteLogo: { type: Function }
  },
  components:{
    Loader
  },
  data(){
    return {
      isImageLoaded: false,
      src: ''
    };
  },
  methods:{
    //Triggers on image onload event
    loadImage(e){
      setTimeout(function(){
        this.isImageLoaded = true;
        //this.$refs.img.src = `/posts_img/${this.imageLink}`;
        this.src = `/logo/${this.imageLink}`;
      }.bind(this),2000);
    },
    async deleteLogo(){
      if(!this.imageLink) return;
      try{
        const result = await this.$axios.$delete('/api/settings/admin/logo/delete', {
          data: { imageName: this.imageLink }
        });
        //Avatar was erased
        if(result.logo === ''){
          this.$message({
            showClose: true,
            message: "Site logo has been deleted",
            type: 'success'
          });
          //This function placed in parent
          this.onDeleteLogo(result.logo);
        }
      }catch(e){
        this.$message({
          showClose: true,
          message: "Logo couldn't be deleted",
          type: 'error'
        });
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.image-loader__preview{
  background-color: #e6e6f6;
  border:1px solid #ccc;
  height: 125px;
  margin: 0.5em 0;
  padding-bottom: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  figure{
    text-align: center;
    width:75px;
    height:75px;
    margin-top:1.3em;
    img{
      max-width: 100%;
      height: 100%;
    }
  }
  .pre-loader{
    left:5%;
    top:20%;
    height:30px;
    transform: scale(.5);
  }
  .image-loader__warning-block{
    width: 340px;
    font-size: .9em;
  }
  .image-loader__warning{
    margin-top: 1.5em;
    width: 95%;
    font-size: 0.7em;
    padding: 1px!important;
    line-height:20px;
    .el-alert__icon{
      vertical-align: inherit;
      font-size: 20px;
      margin-left: 10px;
    }
    .el-alert__content{
      padding: 0 20px 0 20px !important;
      .el-alert__title{
        font-size: 1.2em;
      }
    }
  }
  .image-loader__btn-delete{
    font-size: 0.9em;
    padding: 0.5em;
  }
  .logo__delete{
    height:30px;
    align-self: flex-end;
    background-color: #97b1fa;
    border: 1px solid #95a0bb;
    border-radius: 10%;
    padding: 5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: .9em;
    margin-top: 10px;
    &:hover{
      background-color: #b7bbf8;
      color: #e7ecf8;
    }
    &:disabled{
      color: lighten($color: #4b33d3, $amount: 15);
      background-color: #bdccf5;
      cursor:initial;
    }
  }
}
.logo__icon{
  display: flex;
  justify-content: space-around;
  align-items: center;
  i{
    text-align: center;
    margin-top: 10px;
    border:1px solid #ccc;
    font-size: 3em;
    background-color: #e6e6f6;
    flex-grow: 1;
  }
  span{
    margin-top: 10px;
    flex-grow: 12;
    padding-left: 5%;
    border:1px solid #ccc;
    border-left:none;
    background-color: #e6e6f6;
    height:50px;
    padding-top:10px;
    font-weight: bold;
  }
}
</style>
