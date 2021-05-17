<template>
  <div class="image-loader__preview">
    <figure>
      <img :src="`/pages_img/${imageLink}`" alt="Page image">
    </figure>
    <div class="image-loader__warning-block">
      <h4>This image preview belongs to the current page</h4>
      <el-alert v-if="previewWarning"
        :title="`Warning! This image will be replaced with the ${uploadedImgName}`"
        type="warning"
        :closable="false"
        class="image-loader__warning"
        show-icon
        ></el-alert>
      <el-button @click="deleteImage" type="danger" class="image-loader__btn-delete">
        Delete current image
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    imageLink: { type: String, default: '' },
    previewWarning: { type: Boolean, default: false },
    uploadedImgName: { type: String, default: '' }
  },
  methods:{
    deleteImage(e){
      console.log(this.imageLink);
    }
  }
}
</script>

<style lang="scss">
.image-loader__preview{
  background-color: #e6e6f6;
  border:1px solid #ccc;
  height: 125px;
  margin: 0.5em 0;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  figure{
    margin-top: 0.7em;
    width: 100px;
    height: 100px;
    text-align: center;
    img{
      max-width: 100%;
      height: 100%;
    }
  }
  .image-loader__warning-block{
    width: 340px;
  }
  .image-loader__warning{
    width: 95%;
    font-size: 0.7em;
    padding: 1px!important;
    line-height:20px;
    .el-alert__icon{
      vertical-align: inherit;
    }
    .el-alert__content{
      padding: 0 0 0 5px !important;
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
</style>
