<template>
  <div class="logo">
    <h1>Site logo</h1>
    <p :style="{textIndent: '5px', padding:'5px', fontSize:'.9em'}">
      This is a site logo.
    </p>
    <image-loader
      :imageLink="imageLinkValue"
      :onDeleteSingleImage="onDeleteSingleImage"
      @onSingleImage="onSingleImage"
      ref="imageLoader"
    />
    <div>
      <form v-on:submit="addLogo">
        <button
          type="submit"
          :disabled="!singleImage"
          class="logo__submit-button"
        >Site logo</button>
      </form>
    </div>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader.vue';
export default {
  props: {
    imageLink : { type: String, default: '' }
  },
  components: {
    ImageLoader
  },
  data(){
    return {
      imageLinkValue: '',
      singleImage: null
    }
  },
  methods:{
    async addLogo(e){
      e.preventDefault();
      if(this.singleImage){
        const formData = new FormData();
          formData.append('prevLogo',this.imageLinkValue);
          formData.append('singleImage',this.singleImage);
        try{
          const result = await this.$axios.$patch('/api/settings/admin/logo/update', formData);
          if(result.logo){
            //Draw new logo
            this.imageLinkValue = result.logo;
            //If success
            //this.prevLogo = '';
            this.singleImage = null;
            //Clear image in child component
            this.$refs.imageLoader.clearUpload();
            this.$message({
              showClose: true,
              message: "Logo has been updated",
              type: 'success'
            });
          }
        }catch(e){
          //console.log("Error ",e);
          this.$message({
            showClose: true,
            message: "Logo hasn't been updated",
            type: 'error'
          });
        }
      }
    },
    //Got an uploaded Image from child
    onSingleImage(dataImage){
      this.singleImage = dataImage.singleImage;
    },
    //Uploaded Image deleted in child
    onDeleteSingleImage(){
      this.singleImage = null;
    }
  },
  created(){
    //Only when component is loaded
    this.imageLinkValue = this.imageLink;
  }
}
</script>

<style lang="scss">
.logo{
  width: 600px;
  border: 1px solid #ccc;
  background-color: #d0defb;
  padding: .5em;
  .logo__submit-button{
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
</style>
