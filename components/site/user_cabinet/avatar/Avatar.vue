<template>
  <div class="avatar">
    <h1>Avatar</h1>
    <p :style="{textIndent: '5px', padding:'5px', fontSize:'.9em'}">
      This avatar is used in chat, but you can still leave it blank. <br />
      You can click the button below to select and download one of your avatars.
    </p>
    <image-loader
      :imageLink="imageLinkValue"
      :onDeleteSingleImage="onDeleteSingleImage"
      @onSingleImage="onSingleImage"
      ref="imageLoader"
    />
    <div>
      <form v-on:submit="addAvatar">
        <button
          type="submit"
          :disabled="!singleImage"
          class="avatar__submit-button"
        >Add avatar</button>
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
      singleImage: null,
      prevAvatar: ''
    }
  },
  methods:{
    async addAvatar(e){
      e.preventDefault();
      if(this.singleImage){
        const formData = new FormData();
          formData.append('singleImage',this.singleImage);
          formData.append('prevAvatar',this.prevAvatar);
        try{
          const result = await this.$axios.$patch('/api/cabinet/user-avatar/update', formData);
          if(result.avatar){
            //Draw new avatar
            this.imageLinkValue = result.avatar;
            //If success
            this.prevAvatar = '';
            this.singleImage = null;
            //Clear image in child component
            this.$refs.imageLoader.clearUpload();
            this.$message({
              showClose: true,
              message: "Avatar nas been updated",
              type: 'success'
            });
          }
        }catch(e){
          this.$message({
            showClose: true,
            message: "Avatar nasn't been updated",
            type: 'error'
          });
        }
      }
    },
    //Got an uploaded Image from child
    onSingleImage(dataImage){
      this.prevAvatar = this.imageLinkValue;
      this.singleImage = dataImage.singleImage;
    },
    //Uploaded Image deleted in child
    onDeleteSingleImage(){
      this.prevAvatar= '';
      this.singleImage = null;
    }
  },
  created(){
    this.imageLinkValue = this.imageLink;
  }
}
</script>

<style lang="scss">
.avatar{
  border: 1px solid #ccc;
  background-color: #d0defb;
  padding: .5em;
  .avatar__submit-button{
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
