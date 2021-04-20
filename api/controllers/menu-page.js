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

module.exports = {
  getMenuPages,
  getMenuPageContent,
  createPage
};
