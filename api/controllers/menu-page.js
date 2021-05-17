const fs = require('fs');
const path = require('path');
const { MenuPage, MenuPageContent } = require('./../helpers/db');
const { validationResult } = require('express-validator');
const { createPageItemIdV4, createReferenceV5 } = require('./../helpers/uuid');

async function getMenuPages(req, res){
  try{
    const allPages = await MenuPage.find({});//.populate('pageContent');
    if(allPages){
      return res.status(200).json({ message: "Ok", pages: allPages });
    }
    res.status(400).json({ message: "Can't get items", pages: null });
  }catch(e){
    res.status(400).json({ message: "Can't get items", pages: null });
  }
}

async function getMenuPageContent(req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try{
    const reference = req.params.reference;
    const currentPageContent = await MenuPage.findOne({
      reference
     }).populate('pageContent');
    if(currentPageContent){
      const { title, pageHeader, singleImage, date } = currentPageContent.pageContent;
      const newPageContent = { title,pageHeader,singleImage,date };
      if(currentPageContent.pageContent.isBlockOne){
        newPageContent.headerBlockOne = currentPageContent.pageContent.headerBlockOne;
        newPageContent.contentBlockOne = currentPageContent.pageContent.contentBlockOne;
      }
      if(currentPageContent.pageContent.isBlockTwo){
        newPageContent.headerBlockTwo = currentPageContent.pageContent.headerBlockTwo;
        newPageContent.contentBlockTwo = currentPageContent.pageContent.contentBlockTwo;
      }
      if(currentPageContent.pageContent.isBlockThree){
        newPageContent.headerBlockThree = currentPageContent.pageContent.headerBlockThree;
        newPageContent.contentBlockThree = currentPageContent.pageContent.contentBlockThree;
      }
      return res.status(200).json({ message: "Ok", pageContent: newPageContent });
    }
    res.status(400).json({ message: "Can't get content", pageContent: null, error: e });
  }catch(e){
    res.status(400).json({ message: "Can't get content", pageContent: null, error: e });
  }
}

function createPage(req, res){
  //Parse the JSON data from 'allData' field - it is an Object of all client data except image
  let body = JSON.parse(req.body.allData);
    let { pageName, pageHidden, parent, item, ...rest } = body;
      const id = createPageItemIdV4();
      const reference = createReferenceV5(parent, item);
      //If an image is sent, its file name is checked
      if(req.file){
        rest.singleImage = req.file.filename;
      }else{
        rest.singleImage = '';
      }
    const menuPC = new MenuPageContent(rest);
    menuPC.save(async function(err,result){
        if (err){
          res.status(400).json({ message: "Can't save", page: null, error: err });
        }
        else{
          try{
            const menuP = new MenuPage({
              id, pageName, reference, pageHidden, parent, item, pageContent: result._id
            });
            const result2 = await menuP.save();
            return res.status(201).json({ message: "New menu item has been added", page: Object.assign({}, result2, result), error: null });
          }catch(e){
            res.status(400).json({ message: "Can't save", page: null, error: e });
          }
        }
    });
}

async function getFullPageContent(req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const reference = req.params.reference;
  try{
    const currentPageContent = await MenuPage.findOne({
      reference
    }).populate('pageContent');
    if(currentPageContent){
      return res.status(200).json({ message: "All content", fullContent: currentPageContent });
    }
  }catch(e){
    res.status(400).json({ message: "Page doesn't exist", fullContent: null, error: e });
  }
}

async function updatePage(req, res){
  if(req.body.imageToDelete){
    //Remove previous image by name 'imageToDelete'
    removeFile(req.body.imageToDelete);
  }
  //Parse the JSON data from 'allData' field - it is an Object of all client data except image
  let body = JSON.parse(req.body.allData);
  let { pageName, pageHidden, ...rest } = body;
  //Get 'id' of 'MenuPage' Model
  const id = req.body.id;
  //'singleImage' is undefined because it comes through the Multer
  if(!req.body.singleImage){
    //If an image is sent, its file name is checked
    if(req.file){
      rest.singleImage = req.file.filename;
    }
  }else{//'singleImage' has a name
    rest.singleImage = req.body.singleImage
  }
  try{
    //Update Models
    const menuPageUpdated = await MenuPage.findOneAndUpdate(
      { id: id },
      { pageName, pageHidden },
      { new: true }
    );
    const menuPageContentUpdated = await MenuPageContent.findOneAndUpdate(
      { _id: menuPageUpdated.pageContent },
      { ...rest },
      { new: true }
    );
    return res.status(200).json({ message: "Page updated", updatedContent: { menuPageUpdated, menuPageContentUpdated, rest } });
  }catch(e){
    res.status(400).json({ message: "Page can't be updated", error: e });
  }
}

// Private function for deleting files
const removeFile = (file)=>{
  let filePath = path.resolve(__dirname, '../..','static','pages_img',file);
  //Remove uploaded file from 'temp' directory
  if (!fs.existsSync(filePath)) {
    console.log('The file does not exist');
  }
  //File will be removed
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

module.exports = {
  getMenuPages,
  getMenuPageContent,
  createPage,
  getFullPageContent,
  updatePage
};
