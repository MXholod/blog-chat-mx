<template>
  <div class="menu-page-content">
    <h3>{{ menuItemHeader }}</h3>
    <el-form :model="menuPageContent" status-icon :rules="rules" ref="menuPageContent" label-width="120px" class="menu-page-content__form">
      <el-form-item label="Page menu item name" prop="pageMenuItemName">
          <el-input type="text" v-model="menuPageContent.pageMenuItemName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item class="menu-page-content__checkbox" label="You can enable/disable the page menu item">
        <el-checkbox @change="showHideItem" v-model="pageHidden.value" :label="pageHidden.message" autocomplete="off"></el-checkbox>
      </el-form-item>
      <el-divider></el-divider>
      <h3>{{ pageContentHeader }}</h3>
      <el-form-item label="Page title" prop="pageTitle">
        <el-input type="text" v-model="menuPageContent.pageTitle" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Page header" prop="pageHeader">
        <el-input type="text" v-model="menuPageContent.pageHeader" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Page image">
        <image-loader
          v-bind:imageLink="imageLink"
          v-on:onSingleImage="onGetSingleImage"
          :onDeleteSingleImage="onDeleteSingleImage"
          ref="toClearUpload"
        />
      </el-form-item>
      <el-tabs type="border-card">
        <el-tab-pane label="Block content one">
          <el-form-item class="menu-page-content__header" label="Header block one" prop="headerBlockOne">
            <el-input type="text" v-model="menuPageContent.headerBlockOne" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Text block one" prop="contentBlockOne">
            <el-input
              placeholder="Text for block one"
              type="textarea"
              :rows="5"
              v-model="menuPageContent.contentBlockOne">
            </el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="Block content two">
          <el-form-item class="menu-page-content__header" label="Header block two" prop="headerBlockTwo">
            <el-input type="text" v-model="menuPageContent.headerBlockTwo" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Text block two" prop="contentBlockTwo">
            <el-input
              placeholder="Text for block two"
              type="textarea"
              :rows="5"
              v-model="menuPageContent.contentBlockTwo">
            </el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="Block content three">
          <el-form-item class="menu-page-content__header" label="Header block three" prop="headerBlockThree">
            <el-input type="text" v-model="menuPageContent.headerBlockThree" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Text block three" prop="contentBlockThree">
            <el-input
              placeholder="Text for block three"
              type="textarea"
              :rows="5"
              v-model="menuPageContent.contentBlockThree">
            </el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-form-item class="menu-page-content__submit">
          <el-button :disabled="loading" :loading="loading" type="primary" @click="submitForm('menuPageContent')">Submit</el-button>
          <el-button :disabled="loading" @click="resetForm('menuPageContent')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import ImageLoader from './ImageLoader.vue';
export default {
  props:{
    menuItemHeader: String,
    pageContentHeader: String,
    attachToItem: { type: Object, default: function(){
      return { attachToItem: null }
    } }
  },
  components:{
    ImageLoader
  },
  //By default data of 'provide/inject' is not reactive! Let's fix it.
  //After that changing of 'this.id' in Parent will change it in children
  provide(){
    //'this.id' - from data
    let provideId = {};
    Object.defineProperty(provideId, 'id', { enumerable: true, get: () => this.id });
    return { provideId };
  },
  data(){
    return {
      loading: false,
      fetchedData: null,
      pageHidden: { value: false, message:"Show this item" },
      imageLink: '', //Name of the existing page image,
      id: null,
      menuPageContent: {
        pageMenuItemName:'',
        pageTitle: '',
        pageHeader: '',
        singleImage:[], //Uploaded image
        headerBlockOne: '',
        contentBlockOne: '',
        headerBlockTwo: '',
        contentBlockTwo: '',
        headerBlockThree: '',
        contentBlockThree: ''
      },
      rules: {
        pageMenuItemName: [
          { required: true, message: 'Please input menu page name', trigger: 'blur' },
          { min: 2, max: 20, message: 'Length should be 2 to 20', trigger: 'blur' }
        ],
        pageTitle: [
          { required: true, message: 'Please input page title', trigger: 'blur' },
          { min: 5, max: 30, message: 'Length should be 5 to 20', trigger: 'blur' }
        ],
        pageHeader: [
          { required: true, message: 'Please input page header', trigger: 'blur' },
          { min: 3, message: 'Length should be minimum 3', trigger: 'blur' }
        ],
        headerBlockOne: [
          { min: 3, message: 'Length should be minimum 3', trigger: 'blur' }
        ],
        contentBlockOne: [
          { min: 2, message: 'Length should be minimum 2', trigger: 'blur' }
        ],
        headerBlockTwo: [
          { min: 3, message: 'Length should be minimum 3', trigger: 'blur' }
        ],
        contentBlockTwo: [
          { min: 2, message: 'Length should be minimum 2', trigger: 'blur' }
        ],
        headerBlockThree: [
          { min: 3, message: 'Length should be minimum 3', trigger: 'blur' }
        ],
        contentBlockThree: [
          { min: 2, message: 'Length should be minimum 2', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    submitForm(formName){
      this.$refs[formName].validate(async (valid) => {
        if(valid){
          this.loading = true;
          //Prepare data
            const newMenuPageContent = {
              pageHidden: this.pageHidden.value,
              pageName: this.menuPageContent.pageMenuItemName || '',
              title: this.menuPageContent.pageTitle || '',
              pageHeader: this.menuPageContent.pageHeader || '',
              headerBlockOne: this.menuPageContent.headerBlockOne || '',
              contentBlockOne: this.menuPageContent.contentBlockOne || '',
              headerBlockTwo: this.menuPageContent.headerBlockTwo || '',
              contentBlockTwo: this.menuPageContent.contentBlockTwo || '',
              headerBlockThree: this.menuPageContent.headerBlockThree || '',
              contentBlockThree: this.menuPageContent.contentBlockThree || ''
            };
            let formData = new FormData();
            //Make sure there are images in the fields 'singleImage' and 'imageLink'
            let singleImage = this.menuPageContent.singleImage.length;
            //There are both of images
            if(singleImage && this.imageLink !== ''){
              //'singleImage' is an image, 'this.imageLink' is an image too
              formData.append('imageToDelete',this.imageLink);
              formData.append('singleImage',this.menuPageContent.singleImage[0], this.menuPageContent.singleImage[0].name);
              //console.log("There are both of images");
            }
            //There are no any images
            else if(!singleImage && this.imageLink === ''){
              //'singleImage' is a [], 'this.imageLink' is a ''
              formData.append('singleImage', '');
              //console.log("There are no any images");
            }
            //There is only 'singleImage'
            else if(singleImage && this.imageLink === ''){
              //'singleImage[0]' - an object contains an image
              formData.append('singleImage',this.menuPageContent.singleImage[0], this.menuPageContent.singleImage[0].name);
              //console.log("There is only 'singleImage'");
            }
            //There is only 'imageLink'
            else if(!singleImage && this.imageLink !== ''){
              //'this.imageLink' - name of the image in DB
              formData.append('singleImage',this.imageLink);
              //console.log("There is only 'imageLink' ",this.imageLink);
            }
            //Append custom ID from 'Menu-Pages' collection
            formData.append('id', this.id);
            //Append all data in the object except of the image
            formData.append('allData', JSON.stringify(newMenuPageContent));
            //Send data via API
            this.updateMenuItem(formData);
        }else{
          //Form data is invalid
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.pageHidden.message = "Show this item";
      this.pageHidden.value = false;
    },
    showHideItem(e){
      if(e === false){
        this.pageHidden.message = "Show this item";
        this.pageHidden.value = false;
      }else{
        this.pageHidden.message = "Hide this item";
        this.pageHidden.value = true;
      }
    },
    //Get data from child (ImageLoader), method calls when child emits an event
    onGetSingleImage(data){
      this.menuPageContent.singleImage[0] = data.singleImage;
    },
    //Get data from child (ImageLoader), method calls by child, like in (React)
    onDeleteSingleImage(isDelete){
      if(isDelete){
        this.menuPageContent.singleImage = [];
      }
    },
    async updateMenuItem(data){
      try{
        const result = await this.$axios.put('/api/menu_page/update', data);
        if(result.status === 200){
          setTimeout(()=>{
            this.imageLink = result.data.imageName;
            this.$message({
              showClose: true,
              message: result.data.message,
              type: 'success'
            });
          },1000);
        }else{
          throw new Error("Form data can't be updated");
        }
      }catch(e){
        this.$message({
          showClose: true,
          message: e.message,
          type: 'error'
        });
      }finally{
        this.loading = false;
        //Clear uploaded image in Child Component
        this.$refs.toClearUpload.clearUpload();
      }
    }
  },
  mounted(){
    //Get data from two collections at ones
    if(this.attachToItem.reference){
      const apiUrl = `/api/menu_page/full_page/${this.attachToItem.reference}`;
        this.$axios.get(apiUrl).then( response =>{
          return response.data;
        }).then( data =>{
          this.pageHidden.value = data.fullContent.pageHidden;
          this.imageLink = data.fullContent.pageContent.singleImage;
          //Custom ID from 'Menu-Pages' collection
          this.id = data.fullContent.id;
          this.menuPageContent.pageMenuItemName = data.fullContent.pageName;
          this.menuPageContent.pageTitle = data.fullContent.pageContent.title;
          this.menuPageContent.pageHeader = data.fullContent.pageContent.pageHeader;
          this.menuPageContent.headerBlockOne = data.fullContent.pageContent.headerBlockOne;
          this.menuPageContent.contentBlockOne = data.fullContent.pageContent.contentBlockOne;
          this.menuPageContent.headerBlockTwo = data.fullContent.pageContent.headerBlockTwo;
          this.menuPageContent.contentBlockTwo = data.fullContent.pageContent.contentBlockTwo;
          this.menuPageContent.headerBlockThree = data.fullContent.pageContent.headerBlockThree;
          this.menuPageContent.contentBlockThree = data.fullContent.pageContent.contentBlockThree;
        }).catch(error =>{
          //console.log("Error ",error.message);
        });
    }
  }
}
</script>

<style lang="scss" scoped>
.menu-page-content__form{
  .el-form-item:first-child{
    .el-form-item__label{
      line-height: 1.5 !important;
    }
  }
  .el-input{
    width:70%;
  }
}
.menu-page-content{
  width: 600px;
  margin: 2% auto 0;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  h3{
    margin-bottom: 0.8em;
    text-align: center;
  }
  .el-form-item.menu-page-content__checkbox{
    .el-form-item__label{
        width: 350px !important;
      }
      .el-form-item__content{
        margin-left:0px !important;
      }
    .el-form-item.menu-page__checkbox{
      .el-form-item__label{
        width: 300px !important;
      }
    }
    .el-form-item__content{
      .el-checkbox{
        background-color: #d3ddff;
        padding: 0 2%;
        border-radius: 10px;
      }
    }
  }
  .menu-page-content__header{
    display: flex;
    flex-direction: column;
    .el-form-item__label{
      width: 100% !important;
      text-align: center;
      font-weight: bold;
    }
  }
  .menu-page-content__submit{
    margin-top:3%;
  }
}
</style>
