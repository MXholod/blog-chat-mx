<template>
  <div>
    <h1>You may add new menu items with the page content</h1>
    <div v-if="createdPagesStructure" class="each-time-item">
      <div class="display-menu-items">
        <span class="demonstration">Select any level of menu items (Single selection)</span>
        <el-cascader
          :options="createdPagesStructure"
          :props="{ checkStrictly: true , value: 'id', label: 'pageName', children: 'childrenItems'}"
          clearable
          @change="handleChangeMenuItem"
          :key="componentRerender"
          ></el-cascader>
      </div>
      <div class="edit-menu-items">
        <el-tabs type="border-card">
          <el-tab-pane label="Create and add to existed a menu item with page">
            <p>The current menu item which the new item will be attached</p>
            <div class="edit-menu-items__current-menu-item">
              The current menu item:
              <span>{{ currentPageItem && currentPageItem[0].pageName }}</span>
            </div>
            <menu-page-create v-if="currentPageItem"
              :biggest-item-value="biggestDepthValue"
              :menu-pages-parent-item="parentItemFromDB"
              :onChildDataInserted="childInsertedTheData"
              :item-place-level="true"
              :attach-to-item="currentPageItem[0]"
              menu-item-header="Create a new menu item and add to the existing the page"
              page-content-header="Create a new page content related to the menu item"
            ></menu-page-create>
          </el-tab-pane>
          <el-tab-pane label="Update menu item with page">

          </el-tab-pane>
          <el-tab-pane label="Delete menu item with page">

          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div v-else class="first-time-item">
      <p>There isn't an item here. The form to add a new one</p>
      <menu-page-create
        :onChildDataInserted="childInsertedTheData"
        menu-item-header="Create new menu page item"
        page-content-header="Create new page content to the menu item"
      ></menu-page-create>
    </div>
  </div>
</template>

<script>
import MenuPageCreate from "@/components/admin/admin_page_management/MenuPageCreate";
export default {
  async asyncData(ctx){
    const menuItems = await ctx.$axios.get('/api/menu_page/page');
    return {
      menuItemsList: menuItems.data.pages,
      menuItemsTree: menuItems.data.pages
    };
  },
  layout: 'admin',
  components: {
    MenuPageCreate
  },
  data(){
    return {
      createdPagesStructure: null, //Kepp a tree of the elements
      componentRerender: 0, //To force render component
      currentPageItem: null, //An object has been choosen by click
      parentItemFromDB: 0, //A number of free place parent item (depends on DB data)
      biggestDepthItems: null, //Array of the top parent values
      biggestDepthValue: 0, //Array of the top parent values
    }
  },
  methods: {
      //It calls whem choose an item in cascader
      handleChangeMenuItem(value) {
        if(value.length){
          let id = value[value.length-1];
          this.currentPageItem = this.menuItemsList.filter(el => {
            return el.id === id;
          });
          //Get a current parent of the group
          const currentPageParentVal = this.currentPageItem[0].parent === undefined ? this.currentPageItem[0].item[0] : this.currentPageItem[0].parent[0];
          //Current top parent value
          this.biggestDepthValue = this.biggestDepthItems[currentPageParentVal];
        }else{
          this.currentPageItem = null;
        }
      },
      //Pass into the child component the function as in React
      async childInsertedTheData(data){
        if(data.inserted){
          try{
            const menuItems = await this.$axios.get('/api/menu_page/page');
            this.menuItemsList = menuItems.data.pages;
              //Get a biggest item value
              this.biggestDepthItems = this.getBiggestItemDepth(this.menuItemsList);
              //Get the free parent item place (depends on Db data)
              let allParentItems = this.pickParentItems(this.menuItemsList);
              this.parentItemFromDB = this.makeCorrectParentItem(allParentItems);
              //Reset item name
              this.currentPageItem = null;
            //Create tree again
            this.createdPagesStructure = this.createNestedMenuStructure(menuItems.data.pages);
            //Force update component
            this.componentRerender +=1;
          }catch(e){
            console.log(e.response);
          }
        }
      },
      //Take first array element in all parent elemnt items from DB result
      pickParentItems(itemList){
        //Only first element of 'items:[]' array
        const parentItems = [];
        if(!Array.isArray(itemList) || itemList.length === 0) return [];
        itemList.forEach(element => {
          parentItems.push(element.item[0]);
        });
        return parentItems;
      },
      //It returns correct 'parent group number' as a first elemnt item:[here, 0]
      makeCorrectParentItem(array){
				if(!Array.isArray(array) || array.length === 0) return 0;
				let sortedArray = array.sort(function(a,b){
					if(a > b) return 1;
					if(a === b) return 0;
					if(a < b) return -1;
				});
				//Go through the sorted array
				for(let i = 0,j = 1; i < sortedArray.length; i++,j++){
					//If next is not undefined
					if(sortedArray[j] !== undefined){
						//Skip duplicated
						if(sortedArray[i] === sortedArray[j]){
							continue;
						}
						//Comparison of current and next to find a free place in the array
						if((sortedArray[i] + 1) !== sortedArray[j]){
							return sortedArray[i]+1;
						}
					}else{//Get the current as last, its the end of array
						return sortedArray[i] + 1;
					}
				}
				return sortedArray;
			},
      /*Get the biggest order value of the 'item:[parent, order]' in the group*/
      //It returns [ [0,5], [1,1] ] Where [ [parent order, the biggest value] ,[] ]
      getBiggestItemDepth(items){
        const resultArr = [];//Array of the biggest single children items
        let tempArr = [];//Array of children items
        if(items && items.length){
          //Loop one
          items.forEach( item1 => {
            //If we find parent
            if(item1.parent === undefined){
              //Loop two
              items.forEach( item2 => {
                //Add if parent isn't 'undefined' and  parent 'item' equals to child 'item'
                if((item2.parent !== undefined) && (item1.item[0] === item2.item[0])){
                  tempArr.unshift(item2.item[1]);
                }
              })
              if(tempArr.length){
                resultArr.push(max(tempArr));
                tempArr=[];
              }else{
                resultArr.push(item1.item[1]);//Always pushes zero
              }
            }
          });
        }
        //Leave only the biggest value in an Array
        function max(input) {
          if (toString.call(input) !== "[object Array]")
            return false;
          return Math.max.apply(null, input);
        }
        return resultArr;
      }
  },
  mounted(){
    //The 'createNestedMenuStructure' function is taken from 'plugin' adds 'childrenItems = []' to each item
    this.createdPagesStructure = this.createNestedMenuStructure(this.menuItemsTree);
    //Get a biggest item value
    this.biggestDepthItems = this.getBiggestItemDepth(this.menuItemsList);
    //Get the free parent item place (depends on Db data)
    let allParentItems = this.pickParentItems(this.menuItemsList);
    this.parentItemFromDB = this.makeCorrectParentItem(allParentItems);
  }
}
</script>

<style lang="scss" scoped>
.each-time-item{
  width: 900px;
  margin:0 auto;
  div p{
    font-size: 14px;
    text-align: center;
  }
}
.first-time-item{
  width: 900px;
  margin:0 auto;
  p{
    margin-top: 1.5em;
    font-size: 14px;
    text-align: center;
  }
}
.display-menu-items{
  margin-bottom: 1.5em;
}
.edit-menu-items__current-menu-item{
  width:600px;
  margin: 1% auto 0;
  padding:1% 1% 1% 3%;
  border:1px solid #ccc;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 1em;
  background-color: #e6e6f6;
  span{
    color: #4a0994;
    font-weight: bold;
    padding-left:20px;
  }
}
</style>
