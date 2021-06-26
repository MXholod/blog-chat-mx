<template>
  <div>
    <div v-if="imageLink !== ''" class="image-loader__preview">
      <figure :style="{ width:'75px', height:'75px',marginTop: '1.3em' }">
        <img
          v-show="isImageLoaded"
          :src="isImageLoaded ? `/avatar/${this.imageLink}` : src"
          alt="Page image"
          :load="loadImage()"
        />
        <loader v-if="!isImageLoaded" class="pre-loader" />
      </figure>
      <div class="image-loader__warning-block">
        <h4>This is your avatar</h4>
        <el-alert v-if="previewWarning"
          :title="`Warning! Your current avatar will be replaced with the ${uploadedImgName}`"
          type="warning"
          :closable="false"
          class="image-loader__warning"
          show-icon
          ></el-alert>
      </div>
    </div>
    <div v-else class="avatar__icon">
      <i class="el-icon-user"></i>
      <span>Your avatar image is absent</span>
    </div>
  </div>
</template>

<script>
import Loader from './../../../Loader.vue';
export default {
  props:{
    imageLink: { type: String, default: '' },
    previewWarning: { type: Boolean, default: false },
    uploadedImgName: { type: String, default: '' }
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
        this.src = `/avatar/${this.imageLink}`;
      }.bind(this),2000);
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
}
.avatar__icon{
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
