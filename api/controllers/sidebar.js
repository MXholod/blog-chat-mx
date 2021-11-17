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

module.exports.displaySidebar = async function(req, res){
  try{
    //Get the settings object
    const settings = await SiteSettings.find({});
    if(!settings || !settings[0]){
      return res.status(400).json({message: "Sidebar", sidebar: null });
    }
    return res.status(200).json({message: "Sidebar", sidebar: settings[0].sidebarVisibility });
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
    //Getting only the data we need
    const pagesReduced = pages.map( page => {
      return {
        id: page._id,
        title: page.pageName,
        views: page.pageContent.views
      }
    });
    //Sorting posts by views
    let sortedPages = pagesReduced.sort(function(a,b){
      if(a.views > b.views) return 1;
      if(a.views < b.views) return -1;
      if(a.views === b.views) return 0;
    });
    //Reverse array
    sortedPages = sortedPages.reverse();
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
    //Getting only the data we need
    const pagesReduced = pages.map( page => {
      return {
        id: page._id,
        title: page.pageName,
        date: page.pageContent.date
      }
    });
    //Sorting posts by views
    let sortedPages = pagesReduced.sort(function(a,b){
      if(a.date > b.date) return 1;
      if(a.date < b.date) return -1;
      if(a.date === b.date) return 0;
    });
    //Reverse array
    sortedPages = sortedPages.reverse();
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
