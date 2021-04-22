const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const removeFile = (fileTemp, next)=>{
  //Remove uploaded file from 'temp' directory
  if (!fs.existsSync(fileTemp)) {
    //console.log('The file does not exist');
    return next();
  }
  //File will be removed
  fs.unlink(fileTemp, (err) => {
    if (err) {
      //console.error(err);
      return next();
    }
  });
}

module.exports = function(req,res,next){
  //Property 'siteUpload' from the middleware before
  if(!req.siteUpload){
    return next();
  }
  //Newly processed file
  let fileNewPath = path.resolve(__dirname, '../..','static',req.siteUpload.folderIMG,req.siteUpload.fileIMG);
  //Get folder, where 'req.siteUpload.folderIMG' is - 'pages_img' or 'posts_img'
  let fileTempPath = path.resolve(__dirname, '../..','static',req.siteUpload.folderIMG,'temp',req.siteUpload.fileIMG);
    //
    const image = sharp(fileTempPath);
      image.metadata().then(function(metadata) {
        const settings = {
          kernel: sharp.kernel.nearest,
          fit: 'contain',
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        };
        //the rectangle lies: w:530px, h:370px
        if(metadata.width > metadata.height){
          settings.width = 530; settings.height = 370;
          return image.resize(settings).toFile(fileNewPath, (err, info)=>{
            if(err){
              //console.log("Error rect lies ",err);
              return next();
            }else{
              //console.log("Info rect lies ",info);
              removeFile(fileTempPath, next);
            }
          });
        }
        //the rectangle stands: w:210px, h:370px
        if(metadata.width < metadata.height){
          settings.width = 210; settings.height = 370;
          return image.resize(settings).toFile(fileNewPath, (err, info)=>{
            if(err){
              //console.log("Error rect lies ",err);
              return next();
            }else{
              //console.log("Info rect lies ",info);
              removeFile(fileTempPath, next);
            }
          });
        }
        //the square: w:370px, h:370px
        if(metadata.width === metadata.height){
          settings.width = 370; settings.height = 370;
          return image.resize(settings).toFile(fileNewPath, (err, info)=>{
            if(err){
              //console.log("Error rect lies ",err);
              return next();
            }else{
              //console.log("Info rect lies ",info);
              removeFile(fileTempPath, next);
            }
          });
        }
      }).then(function(data) {
        // data contains a WebP image half the width and height of the original JPEG
        //console.log("Data ",data);
      });
  //console.log("Req ",req.siteUpload," ",fileTemp);
  //Go to the Controller
  next();
}
