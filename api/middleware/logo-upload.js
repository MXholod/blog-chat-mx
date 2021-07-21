const path = require('path')
const multer = require('multer')
const moment = require('moment')

let siteUpload = {};
const fileStorage =  multer.diskStorage({
  destination: function (req, file, cb) {
    let currentPath = req.baseUrl+req.route.path;
    let destinationFolder = '';
    //Check destination path
    if((currentPath === '/settings/admin/logo/update') ){//Route part
      destinationFolder = 'logo';
      siteUpload.folderIMG = destinationFolder;
      req.siteUpload = siteUpload;
    }
    // The path to storage files '/middleware/../../static'
    cb(null, path.resolve(__dirname, '../..','static', destinationFolder, 'temp'));
  },
  filename: function (req, file, cb) {
    //cb(null, `${file.originalname}-${moment().format('DDMMYYYY-HHmmss_SSS')}`)
    let lastDotIndex = file.originalname.lastIndexOf('.');
    let part1 = file.originalname.substring(0,lastDotIndex);
    let part2 = file.originalname.substring(lastDotIndex,file.originalname.length);
    const uniqueFileName = `${part1}-${moment().format('DDMMYYYY-HHmmss_SSS')}${part2}`
    siteUpload.fileIMG = uniqueFileName;
    req.siteUpload = siteUpload;
    cb(null, uniqueFileName);
  }
})
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

module.exports = multer({
  storage: fileStorage,
  fileFilter,
  // fileSize: (1024bytes) = 1kb * 1024 = 1mb * 5 = 5mb
  limits: { fileSize: (1024 * 1024 * 5) }
})
