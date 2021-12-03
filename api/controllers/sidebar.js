const { Post, MenuPage, MenuPageContent, SiteSettings, User } = require('./../helpers/db');

module.exports.getSidebarSettings = async function(req, res){
  let { id: userId, role } = req.user;
  try{
    //If moderator then get admin _id to get access to the settings for the moderator
    if(role !== 'admin'){
      const admin = await User.findOne({ role: 'admin' });
      if(!admin) return res.status(400).json({message: "Sidebar settings", sidebarSettings: {} });
      userId = admin._id;
    }
    //Get the settings object
    let settings = await SiteSettings.findOne({ adminId: userId });
    if(settings){
      const sidebarSettings = {};
        sidebarSettings.sidebarVisibility = settings.sidebarVisibility;
        sidebarSettings.popularPostsLimit = settings.popularPostsLimit;
        sidebarSettings.popularPostsVisibility = settings.popularPostsVisibility;
        sidebarSettings.popularPagesLimit = settings.popularPagesLimit;
        sidebarSettings.popularPagesVisibility = settings.popularPagesVisibility;
        sidebarSettings.recentlyCreatedPostsLimit = settings.recentlyCreatedPostsLimit;
        sidebarSettings.recentlyCreatedPostsVisibility = settings.recentlyCreatedPostsVisibility;
        sidebarSettings.recentlyCreatedPagesLimit = settings.recentlyCreatedPagesLimit;
        sidebarSettings.recentlyCreatedPagesVisibility = settings.recentlyCreatedPagesVisibility;
      return res.status(200).json({message: "Sidebar settings", sidebarSettings });
    }
    return res.status(400).json({message: "Sidebar settings", sidebarSettings: {} });
  }catch(e){
    return res.status(400).json({message: "Sidebar settings", error: e });
  }
}

module.exports.changeSidebarVisibility = async function(req, res){
  let { id: userId, role } = req.user;
  const { state } = req.params;
  //Convert state to Number and then to Boolean
  let sidebarVisibility = Boolean(+state);
  //If moderator then get admin _id to get access to the settings for the moderator
  if(role !== 'admin'){
    const admin = await User.findOne({ role: 'admin' });
    if(!admin) return res.status(400).json({message: "Sidebar visible", updatedSettings: true });
    userId = admin._id;
  }
  try{
    const updatedSettings = await SiteSettings.findOneAndUpdate({
      adminId: userId
    }, {
      sidebarVisibility
    }, { new: true });
    if(!updatedSettings){
      return res.status(400).json({message: "Sidebar visible can't be changed", sidebarVisibility: true });
    }
    return res.status(200).json({message: "Sidebar visibility changed", sidebarVisibility: updatedSettings.sidebarVisibility });
  }catch(e){
    return res.status(400).json({message: "Sidebar visible", sidebarVisibility: true });
  }
}

//A private function that displays block data on the sidebar.
//'model' - Mongoose Model, 'propTocompare' - 'views' or 'date'
function sidebarBlock(docs, propTocompare, modelName){
  const modelReduced = [];
  //Getting only the data we need
  docs.forEach( doc => {
    if(modelName === 'post'){
      modelReduced.push({
        id: doc._id,
        title: doc.title,
        [propTocompare] : doc[propTocompare]
      });
    }
    if(modelName === 'page'){
      if(doc.pageHidden) return true;
      modelReduced.push({
        id: doc._id,
        reference: doc.reference,
        title: doc.pageName,
        [propTocompare] : doc.pageContent[propTocompare]
      });
    }
  });
  //Sorting posts by views
  let sortedmodelReduced = modelReduced.sort(function(a,b){
    if(a[propTocompare] > b[propTocompare]) return 1;
    if(a[propTocompare] < b[propTocompare]) return -1;
    if(a[propTocompare] === b[propTocompare]) return 0;
  });
  if(propTocompare === "date"){
    sortedmodelReduced = sortedmodelReduced.map((obj)=>{
      let currentDate = new Date(obj.date);
      let date = currentDate.getDate() <= 9 ? '0'+currentDate.getDate() : currentDate.getDate();
      let month = ("0"+(currentDate.getMonth()+1)).slice(-2);
      let year = String(currentDate.getFullYear()).slice(-2);
      obj.date = `${date}.${month}.${year}`;
      return obj;
    });
  }
  //Reverse array
  return sortedmodelReduced.reverse();
}

module.exports.displaySidebar = async function(req, res){
  try{
    //Get the settings object
    const settings = await SiteSettings.find({});
    if(!settings || !settings[0]){
      return res.status(400).json({message: "Sidebar", sidebar: null });
    }
    //Sidebar is not visible on the site. The 'sidebarVisibility' is 'false'
    if(!settings[0].sidebarVisibility){
      return res.status(200).json({message: "Sidebar", sidebar: null });
    }
    //Sidebar is visible on the site
    const sidebar = {
      popularPosts: [],
      popularPages: [],
      recentPosts: [],
      recentPages: []
    };
    //Find all posts
    const posts = await Post.find({});
    //Get popular posts
    if(settings[0].popularPostsVisibility){
      if(posts && !!posts.length) {
        let sortedPopPosts = sidebarBlock(posts, 'views', 'post');
        if(sortedPopPosts.length > 0 && settings[0].popularPostsLimit !== 0){
          const popPosts = sortedPopPosts.slice(0, settings[0].popularPostsLimit);
          sidebar.popularPosts = popPosts;
        }
      }
    }
    //Get recently created posts
    if(settings[0].recentlyCreatedPostsVisibility){
      if(posts && !!posts.length) {
      let sortedRecPosts = sidebarBlock(posts, 'date', 'post');
        if(sortedRecPosts.length > 0 && settings[0].recentlyCreatedPostsLimit !== 0){
          const recentPosts = sortedRecPosts.slice(0, settings[0].recentlyCreatedPostsLimit);
          sidebar.recentPosts = recentPosts;
        }
      }
    }
    //Find all pages
    const pages = await MenuPage.find({}).populate('pageContent');
    //Get popular pages
    if(settings[0].popularPagesVisibility){
      if(pages && !!pages.length) {
        let sortedPopPages = sidebarBlock(pages, 'views', 'page');
        if(sortedPopPages.length > 0 && settings[0].popularPagesLimit !== 0){
          const popPages = sortedPopPages.slice(0, settings[0].popularPagesLimit);
          sidebar.popularPages = popPages;
        }
      }
    }
    //Get recently created pages
    if(settings[0].recentlyCreatedPagesVisibility){
      if(pages && !!pages.length) {
        let sortedRecPages = sidebarBlock(pages, 'date', 'page');
        if(sortedRecPages.length > 0 && settings[0].recentlyCreatedPagesLimit !== 0){
          const recentPages = sortedRecPages.slice(0, settings[0].recentlyCreatedPagesLimit);
          sidebar.recentPages = recentPages;
        }
      }
    }
    return res.status(200).json({message: "Sidebar", sidebar });
  }catch(e){
    return res.status(400).json({message: "Sidebar", sidebar: null });
  }
}

module.exports.getPopularPosts = async function(req, res){
  //const { id: userId } = req.user;
  try{
    //Find all posts
    const posts = await Post.find({});
    if(!posts) return res.status(400).json({message: "Something went wrong", posts: []});
    //Getting only the data we need
    const postsReduced = posts.map( post => {
      return {
        id: post._id,
        title: post.title,
        views: post.views
      }
    });
    //Sorting posts by views
    let sortedPosts = postsReduced.sort(function(a,b){
      if(a.views > b.views) return 1;
      if(a.views < b.views) return -1;
      if(a.views === b.views) return 0;
    });
    //Reverse array
    sortedPosts = sortedPosts.reverse();
    return res.status(200).json({message: "Ok", posts: sortedPosts });
  }catch(e){
    return res.status(400).json({message: "Bad", posts: []});
  }
}

module.exports.getPopularPages = async function(req, res){
  //const { id: userId } = req.user;
  try{
    //Find all pages
    const pages = await MenuPage.find({}).populate('pageContent');
    if(!pages) return res.status(400).json({message: "Bad", pages: []});
    const pagesReduced = [];
    const pagesHiddenReduced = [];
    //Getting only the data we need
    pages.forEach( page => {
      if(!page.pageHidden){
        pagesReduced.push({
          id: page._id,
          title: page.pageName,
          views: page.pageContent.views,
          pageHidden: page.pageHidden
        });
      }else{
        pagesHiddenReduced.push({
          id: page._id,
          title: page.pageName,
          views: page.pageContent.views,
          pageHidden: page.pageHidden
        });
      }
    });
    //Sorting pages by views
    let sortedPages = pagesReduced.sort(function(a,b){
      if(a.views > b.views) return 1;
      if(a.views < b.views) return -1;
      if(a.views === b.views) return 0;
    });
    //Sorting hidden pages by views
    let sortedHiddenPages = pagesHiddenReduced.sort(function(a,b){
      if(a.views > b.views) return 1;
      if(a.views < b.views) return -1;
      if(a.views === b.views) return 0;
    });
    //Reverse array
    sortedPages = sortedPages.reverse();
    //Reverse hidden array
    sortedHiddenPages = sortedHiddenPages.reverse();
    //Merge arrays of pages and hiiden pages
    sortedPages = sortedPages.concat(sortedHiddenPages);
    return res.status(200).json({message: "Ok", pages: sortedPages });
  }catch(e){
    return res.status(400).json({message: "Bad", pages: []});
  }
}

module.exports.getRecentlyCreatedPosts = async function(req, res){
  //const { id: userId } = req.user;
  try{
    //Find all posts
    const posts = await Post.find({});
    if(!posts) return res.status(400).json({message: "Something went wrong", posts: []});
    //Getting only the data we need
    const postsReduced = posts.map( post => {
      return {
        id: post._id,
        title: post.title,
        date: post.date
      }
    });
    //Sorting posts by views
    let sortedPosts = postsReduced.sort(function(a,b){
      if(a.date > b.date) return 1;
      if(a.date < b.date) return -1;
      if(a.date === b.date) return 0;
    });
    //Reverse array
    sortedPosts = sortedPosts.reverse();
    return res.status(200).json({message: "Ok", posts: sortedPosts });
  }catch(e){
    return res.status(400).json({message: "Bad", posts: []});
  }
}

module.exports.getRecentlyCreatedPages = async function(req, res){
  //const { id: userId } = req.user;
  try{
    //Find all pages
    const pages = await MenuPage.find({}).populate('pageContent');
    if(!pages) return res.status(400).json({message: "Bad", pages: []});
    const pagesReduced = [];
    const pagesHiddenReduced = [];
    //Getting only the data we need
    pages.forEach( page => {
      if(!page.pageHidden){
        pagesReduced.push({
          id: page._id,
          title: page.pageName,
          date: page.pageContent.date,
          pageHidden: page.pageHidden
        });
      }else{
        pagesHiddenReduced.push({
          id: page._id,
          title: page.pageName,
          date: page.pageContent.date,
          pageHidden: page.pageHidden
        });
      }
    });
    //Sorting pages by date
    let sortedPages = pagesReduced.sort(function(a,b){
      if(a.date > b.date) return 1;
      if(a.date < b.date) return -1;
      if(a.date === b.date) return 0;
    });
    //Sorting hidden pages by date
    let sortedHiddenPages = pagesHiddenReduced.sort(function(a,b){
      if(a.date > b.date) return 1;
      if(a.date < b.date) return -1;
      if(a.date === b.date) return 0;
    });
    //Reverse array
    sortedPages = sortedPages.reverse();
    //Reverse array
    sortedHiddenPages = sortedHiddenPages.reverse();
    //Merge arrays of pages and hiiden pages
    sortedPages = sortedPages.concat(sortedHiddenPages);
    return res.status(200).json({message: "Ok", pages: sortedPages });
  }catch(e){
    return res.status(400).json({message: "Bad", pages: []});
  }
}

module.exports.updateBlockSettings = async function(req, res){
  let { id: userId, role } = req.user;
  //If moderator then get admin _id to get access to the settings for the moderator
  if(role !== 'admin'){
    const admin = await User.findOne({ role: 'admin' });
    if(!admin) return res.status(400).json({message: "Sidebar settings", updatedSettings: false });
    userId = admin._id;
  }

  if(!req.body.data) return res.status(400).json({message: "Bad"});
  const { data } = req.body;
  let updateBlockSettings = {};
  try{
      switch(data.blockType){
        case 'popular_posts' : updateBlockSettings['popularPostsLimit'] = data.newLimit;
          updateBlockSettings['popularPostsVisibility'] = data.newVisibility;
          break;
        case 'popular_pages' : updateBlockSettings['popularPagesLimit'] = data.newLimit;
        updateBlockSettings['popularPagesVisibility'] = data.newVisibility;
          break;
        case 'recent_posts' : updateBlockSettings['recentlyCreatedPostsLimit'] = data.newLimit;
        updateBlockSettings['recentlyCreatedPostsVisibility'] = data.newVisibility;
          break;
        case 'recent_pages' : updateBlockSettings['recentlyCreatedPagesLimit'] = data.newLimit;
        updateBlockSettings['recentlyCreatedPagesVisibility'] = data.newVisibility;
          break;
      }
      const updatedSettings = await SiteSettings.findOneAndUpdate({
        adminId: userId
      }, updateBlockSettings, { new: true });
      if(!updatedSettings) return res.status(400).json({message: "Bad"});
      //If block was successfully updated
    return res.status(200).json({message: "Ok", updatedSettings: data});
  }catch(e){
    return res.status(400).json({message: "Bad", updatedSettings: false});
  }
}
