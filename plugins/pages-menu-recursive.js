import Vue from "vue";

// Make sure to pick a unique name for the flag
// so it won't conflict with any other mixin.
if (!Vue.__page_menu_recursive_mixin__) {
  Vue.__page_menu_recursive_mixin__ = true
  Vue.mixin({ methods: {
      createNestedMenuStructure(pages){
        const topArr = [];
        const pagesArr = [];
        //Only for top level parents
        if(pages.length !== 0){
          let i = 0;
          while(i < pages.length){
            // If 'pageHidden' is true, the found item should not be displayed
            if(pages[i].pageHidden){
              i++;
              continue;
            }
            //Only top level items
            if(pages[i].parent === undefined || pages[i].parent === null){
              pages[i].parent = undefined;
              //Add an empty array to the Top level
              //pages[i].childrenItems = [];
              pages[i].loop = true;
              topArr.push(pages[i]);
            }else{
              pages[i].loop = false;
              //Push other pages
              pagesArr.push(pages[i]);
            }
            //Create prop. as an empty array to all objects in list, we may use - Object.defineProperties();
            pages[i].childrenItems = [];
            i++;
          }
          // If 'topArr' has not any child or children item(s)
          if(!topArr.length) return null;
          //Return result of the 'recursion'
          return this.recursion(topArr,pagesArr);
        }else{
          return null;
        }
      },
      recursion(parentArr,pages){
        //Iterate parents
        for(let curParent of parentArr){
          //Iterate pages
          for(let curPage of pages){
            //Get only linked pages with parent
            if((curParent.item[0] === curPage.parent[0]) && (curParent.item[1] === curPage.parent[1]) && !curPage.loop){//&& !curPage.childrenItems
              //If we have relation between Parent and Child
              curPage.loop = true;
              //curPage.childrenItems = [];
              curParent.childrenItems.push(curPage);
              //Call 'recursion once again'
              this.recursion(curParent.childrenItems,pages);
            }
          }
        }
        return parentArr;
      }
    }
     }) // Set up your mixin then
}

