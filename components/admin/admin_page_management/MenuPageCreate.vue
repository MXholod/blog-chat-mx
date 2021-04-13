<template>
  <div class="menu-page-content">
    <div v-if="itemPlaceLevel" class="menu-page-content__item-level">
      <h5>Make a choice where the menu item will be placed</h5>
      <el-radio v-model="attachMenuItemWay" :label="1">Item as a sibling</el-radio>
      <el-radio v-model="attachMenuItemWay" :label="2">Item as a nested</el-radio>
    </div>
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
        <el-upload
          class="menu-page-content__singleImage"
          action="#"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :multiple="false"
          :limit="1"
          :on-change="handleChangeSingleImage"
          :on-exceed="handleExceed"
          :file-list="menuPageContent.singleImage"
          ref="singleImage">
          <el-button size="small" type="primary">Click to upload an image</el-button>
          <div slot="tip" class="el-upload__tip">jpg/png files with a size less than 500kb</div>
        </el-upload>
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
export default {
  props:{
    menuItemHeader: String,
    pageContentHeader: String,
    attachToItem: { type: Object, default: function(){
      return { attachToItem: null }
    } },
    menuPagesParentItem: { type: Number, default: 0 },
    biggestItemValue: { type: Number, default: 0 },
    onChildDataInserted: { type: Function, default: null},
    itemPlaceLevel: { type: Boolean, default: false }
  },
  data(){
    return {
      attachMenuItemWay: 1,
      loading: false,
      pageHidden: { value: false, message:"Show this item" },
      parent: undefined,
      item: [0,0],
      menuPageContent: {
        pageMenuItemName:'',
        pageTitle: '',
        pageHeader: '',
        singleImage:[],
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
    };
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if(valid) {
            this.loading = true;
            //Prepare data
            const newMenuPageContent = {
              pageHidden: this.pageHidden.value,
              parent: this.parent,
              item: this.item,
              pageName: this.menuPageContent.pageMenuItemName,
              title: this.menuPageContent.pageTitle,
              pageHeader: this.menuPageContent.pageHeader,
              singleImage: this.menuPageContent.singleImage[0] || '',
              headerBlockOne: this.menuPageContent.headerBlockOne || '',
              contentBlockOne: this.menuPageContent.contentBlockOne || '',
              headerBlockTwo: this.menuPageContent.headerBlockTwo || '',
              contentBlockTwo: this.menuPageContent.contentBlockTwo || '',
              headerBlockThree: this.menuPageContent.headerBlockThree || '',
              contentBlockThree: this.menuPageContent.contentBlockThree || ''
            };
            try{
              // If 'this.attachToItem' has an object data then at least one menu item exists
              if(this.attachToItem.attachToItem !== null){
                //Now 'this.attachToItem' is an object
                if(this.attachMenuItemWay === 1){//Siblings menu items
                  //Set another Top level menu item
                  if(this.attachToItem.parent === undefined){
                    newMenuPageContent.parent = undefined;
                      let firstItemEl = this.menuPagesParentItem;
                    newMenuPageContent.item = [firstItemEl, this.attachToItem.item[1]];
                  }else{//Set all other sibling level menu items
                    newMenuPageContent.parent = this.attachToItem.parent;
                      let secondItemEl = (this.biggestItemValue + 1);
                    newMenuPageContent.item = [this.attachToItem.item[0], secondItemEl];
                  }
                }else{//Nested menu items
                  //Set a child as a nested menu item
                    newMenuPageContent.parent = this.attachToItem.item;
                      let secondItemEl = (this.biggestItemValue + 1);
                    newMenuPageContent.item = [this.attachToItem.item[0], secondItemEl];
                }
                await this.createMenuItem(newMenuPageContent);
              }else{//The very first time
                await this.createMenuItem(newMenuPageContent);
              }
              this.onChildDataInserted({ inserted: true });
              this.$refs.singleImage.clearFiles();
              this.resetForm(formName);
            }catch(e){
              console.log(e);
            }finally{
              this.loading = false;
            }
          }else {
            this.$message({
              showClose: true,
              message: "The Form data is incorrect",
              type: 'error'
            });
            return false;
          }
        });
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
    //Single message
    handleRemove(file, fileList) {
      console.log(file, fileList);
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
    handleChangeSingleImage(file, fileList){
      this.menuPageContent.singleImage[0] = file.raw;
    },
    //End of the single message
    async createMenuItem(data){
      try{
        //If 'this.attachToItem' hasn't an object then create the first menu item
        const result = await this.$axios.post('/api/menu_page/create', data);
        if(result.data.page){
          this.$message({
            showClose: true,
            message: result.data.message,
            type: 'success'
          });
        }else{
          this.$message({
            showClose: true,
            message: result.data.message,
            type: 'error'
          });
        }
      }catch(e){
        this.$message({
          showClose: true,
          message: e.message,
          type: 'error'
        });
      }
    }
  }
}
</script>

<style lang="scss">
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
  .menu-page-content__item-level{
    padding: 2% 5%;
    background-color: #e6e6f6;
    margin-bottom: 3%;
    h5{
      margin-bottom: 1%;
    }
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
  .menu-page-content__singleImage{
    padding:1% 2%;
    border-radius: 10px;
    background-color: rgb(196, 226, 246);
  }
  .menu-page-content__submit{
    margin-top:3%;
  }
}
</style>
