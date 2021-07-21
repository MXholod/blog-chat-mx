const path = require('path');
const fs = require('fs');
const jwtDecode = require('jwt-decode');
const { SiteSettings, JwtRefresh } = require('./../helpers/db');

async function getAllOptions(req, res){
  if(!req.params.jwt) return res.status(400).json({ message: "Can't get options", options: null });
  let jwtDecoded = jwtDecode(req.params.jwt) || {};
  //Difine current time
  const currentTime = new Date().getTime() / 1000;
  const expired = jwtDecoded.exp || 0;
  //Access Token is valid
  if(currentTime < expired){
    try{
      const siteOptions = await SiteSettings.findOne({ adminId: jwtDecoded.id }).exec();
      return res.status(200).json({ message: "All options", options: siteOptions });
    }catch(e){
      return res.status(400).json({ message: e.message, options: null });
    }
  }else{//Checking Refresh Token lifetime
    //Get Cookie using 'cookieparser'
    const token = req.cookies.refreshToken;
    try{
      //Get two objects from DB: 'refreshtokens' and 'users' merged by method 'populate()'
      const refreshToken = await JwtRefresh.findOne({ token }).populate('user');
      if (!refreshToken || refreshToken.isExpired){//!refreshToken.isActive
        //Refresh Token is expired
        return res.status(200).json({ message: "Can't get options", options: null });
      }else{
        if(refreshToken.user.role === 'admin'){
          const siteOptions = await SiteSettings.findOne({ adminId: refreshToken.user.id }).exec();
          return res.status(200).json({ message: "All options", options: siteOptions });
        }else{
          return res.status(200).json({ message: "Options not available", options: null });
        }
      }
    }catch(e){
      return res.status(400).json({ message: "Can't get options", options: null });
    }
  }
}

async function getLogo(req, res){
  const { id, role } = req.user;
  if(role !== 'admin') return res.status(400).json({ message: 'Can\'t get the logo' });
  try{
    const siteSettings = await SiteSettings.findOne({ adminId: id }).exec();
    if(siteSettings){
      return res.status(200).json({ message: 'Has got the logo', logo: siteSettings.siteLogo });
    }
  }catch(e){
    return res.status(400).json({ message: 'Can\'t get the logo' });
  }
}

async function updateLogo(req, res){
  const { id, role } = req.user;
  if(role !== 'admin') return res.status(400).json({ message: 'Logo can\'t be updated' });
  //If an image is sent, its file name is checked
  let singleImage = '';
  if(req.file){
    singleImage = req.file.filename;
  }else{
    singleImage = '';
  }
  //Remove previous logo image if it exists
  if(req.body.prevLogo !== '' && singleImage !== ''){
    removeFile(req.body.prevLogo);
  }
  if(!id){
    return res.status(400).json({ message: 'Logo can\'t be updated' });
  }
  try{
    let result;
    if(req.body.prevLogo || (req.body.prevLogo === '')){//Update ex value
      result = await SiteSettings.findOneAndUpdate({ adminId: id }, { siteLogo: singleImage }, { new: true });
    }
    if(result){
      return res.status(200).json({ message: 'Logo has updated', logo: result.siteLogo });
    }else{
      return res.status(200).json({ message: 'Logo hasn\'t updated' });
    }
  }catch(e){
    return res.status(400).json({ message: 'Logo hasn\'t updated' });
  }
}

async function deleteLogo(req, res){
  const { id, role } = req.user;
  const { imageName } = req.body;
  if((role !== 'admin') || !imageName) return res.status(400).json({ message: "Can't delete logo" });
  try{
    //Remove previous logo image if it exists
    removeFile(imageName);
    //Set an empty string in DB
    const result = await SiteSettings.findOneAndUpdate({ adminId: id }, { siteLogo: '' }, { new: true });
    if(result){
      return res.status(200).json({ message: "Logo has been deleted", logo: result.siteLogo });
    }
  }catch(e){
    return res.status(400).json({ message: "Can't delete logo" });
  }
}

// Private function for deleting files
const removeFile = (file)=>{
  let filePath = path.resolve(__dirname, '../..','static','logo',file);
  //Remove uploaded file from 'temp' directory
  if (!fs.existsSync(filePath)) {
    //console.log('The file does not exist');
    return;
  }
  //File will be removed
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

async function getSiteLogo(req, res){
  try{
    const siteSettings = await SiteSettings.find({}).exec();
    if(!!siteSettings.length){
      return res.status(200).json({ message: 'Has got the logo', logo: siteSettings[0].siteLogo });
    }
  }catch(e){
    return res.status(400).json({ message: 'Can\'t get the logo' });
  }
}

module.exports = {
  getAllOptions,
  updateLogo,
  deleteLogo,
  getLogo,
  getSiteLogo
};
