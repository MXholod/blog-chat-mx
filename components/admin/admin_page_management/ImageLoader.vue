<template>
  <div class="image-loader">
    <el-upload
      class="image-loader__single-image"
      action="#"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :multiple="false"
      :limit="1"
      :on-change="handleChangeSingleImage"
      :on-exceed="handleExceed"
      :file-list="singleImage"
      :on-success="handleSuccess"
      ref="singleImage">
        <el-button size="small" type="primary">Click to upload an image</el-button>
        <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
    </el-upload>
    <image-preview v-if="imageLink !== ''"
      :imageLink="imageLink"
      :previewWarning="previewWarning"
      :uploadedImgName="singleImage[0] && singleImage[0].name"
    />
  </div>
</template>

<script>
import ImagePreview from './ImagePreview';
export default {
  props:{
    imageLink: { type: String, default: '' },
    onDeleteSingleImage: { type: Function }
  },
  components: {
    ImagePreview
  },
  data(){
    return {
      singleImage:[],
      previewWarning: false
    }
  },
  methods:{
    //Single image
    handleRemove(file, fileList) {
      this.previewWarning = false;
      //Function from parent component
      this.onDeleteSingleImage(true);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`The limit is 1, you selected ${files.length} files this time, add up to ${files.length + fileList.length} totally`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`Cancel the transfer of ${ file.name } ?`);
    },
    //Called when image is uploaded
    handleSuccess(response, file, fileList){
      this.previewWarning = true;
    },
    handleChangeSingleImage(file, fileList){
      this.singleImage[0] = file.raw;
      //Emit event with data up to the parent component
      this.$emit('onSingleImage',{'singleImage': this.singleImage[0]});
    },
    //End of the single image
  }
}
</script>

<style lang="scss" scoped>
.image-loader__single-image{
  padding:1% 2%;
  border-radius: 10px;
  background-color: #e6e6f6;
  border: 1px solid #ccc;
}
</style>
