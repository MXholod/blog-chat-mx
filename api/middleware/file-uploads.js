const path = require('path')
const multer = require('multer')
const moment = require('moment')

const fileStorage =  multer.diskStorage({
  destination: function (req, file, cb) {
    // The path to storage files '/middleware/../../static'
    cb(null, path.resolve(__dirname, '../..','static', 'posts_img'))
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname}-${moment().format('DDMMYYYY-HHmmss_SSS')}`)
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
