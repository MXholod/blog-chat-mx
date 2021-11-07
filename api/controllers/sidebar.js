const { Post, MenuPage, MenuPageContent, SiteSettings, User } = require('./../helpers/db');

module.exports.getSidebarVisibility = async function(req, res){
  let { id: userId, role } = req.user;
  try{
    //If moderator then get admin _id to get access to the settings for the moderator
    if(role !== 'admin'){
      const admin = await User.findOne({ role: 'admin' });
      if(!admin) return res.status(400).json({message: "Sidebar visible", sidebarVisibility: true });
      userId = admin._id;
    }
    //Get the settings object
    const settings = await SiteSettings.findOne({ adminId: userId });
    if(settings){
      return res.status(200).json({message: "Sidebar visibility changed", sidebarVisibility: settings.sidebarVisibility });
    }
    return res.status(400).json({message: "Sidebar visible", sidebarVisibility: true });
  }catch(e){
    return res.status(400).json({message: "Sidebar visible", error: e });
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
