const fs = require('fs');
const path = require('path');
const jwtDecode = require('jwt-decode');
const { MenuPage, MenuPageContent, isValidId } = require('./../helpers/db');
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
      const { title, pageHeader, singleImage, date, views, likes } = currentPageContent.pageContent;
      // We send 'likeState' to the client as response
      let likeState = true;
      //User authenticated
      if(req.params.jwt !== undefined){
        let jwtDecoded = jwtDecode(req.params.jwt) || {};
        //Difine current time
        const currentTime = new Date().getTime() / 1000;
        const expired = jwtDecoded.exp || 0;
        //Access Token is valid
        if(currentTime < expired){
          let userId = jwtDecoded.id;
          //Check is the page liked
          const index = likes.findIndex(id => {
            return String(id) === String(userId);
          });
          //If a person has not liked the post yet
          if(index === -1){
            //The page is not liked
            likeState = false;
          }
        }
      }
      const newPageContent = { title,pageHeader,singleImage,date,views,likes,likeState };
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
    return res.status(200).json({ message: "Page updated", imageName: menuPageContentUpdated.singleImage });
  }catch(e){
    res.status(400).json({ message: "Page can't be updated", error: e });
  }
}

async function deleteImage(req, res){
  if(!req.params.collectionId || !req.params.imgName){
    return res.status(400).json({ message: "Image doesn't exist", deletedImage: false });
  }
  try{
    //Remove previous image by name 'imgName'
    removeFile(req.params.imgName);
    //Get id of the bound Model
    const menuPageContent = await MenuPage.findOne({
      id: req.params.collectionId
    }).populate('pageContent');
    //Erase image name to empty string
    const menuPageContentUpdated = await MenuPageContent.findOneAndUpdate(
      { _id: menuPageContent.pageContent },
      { singleImage: '' },
      { new: true }
    );
    if(menuPageContentUpdated){
      res.status(200).json({ message: "Deleted image ", deletedImage: true });
    }else{
      res.status(400).json({ message: "Image doesn't exist", deletedImage: false });
    }
  }catch(e){
    res.status(400).json({ message: "Image doesn't exist", deletedImage: false });
  }
}

async function deletePageData(req, res){
  let { ids: idsMainCollection } = req.body;
  try{
    const boundModelsResult = await MenuPage.find({'id': { $in: idsMainCollection } }).populate('pageContent');
    const idsBoundCollection = [];
    const imagesBoundCollection = [];
    //Find and copy IDs from the bound Model into the array
    boundModelsResult.forEach((mainDoc)=>{
      if(mainDoc.pageContent._id){
        //Add '_id' to array
        idsBoundCollection.push(mainDoc.pageContent._id);
        //Add 'singleImage' to array
        if(mainDoc.pageContent.singleImage !== ''){
          imagesBoundCollection.push(mainDoc.pageContent.singleImage);
        }
      }
    });
    //Removing images from the Server
    if(!!imagesBoundCollection.length){
      let i = 0;
      do{
        removeFile(imagesBoundCollection[i]);
        i++;
      }while(imagesBoundCollection.length > i)
    }
    //Removing data from the Models
    const delete1 = await MenuPage.deleteMany({ id: { $in : idsMainCollection } });
    const delete2 = await MenuPageContent.deleteMany({ _id: { $in : idsBoundCollection } });
    if(delete1.deletedCount === delete2.deletedCount){
      return res.status(200).json({ message: "Ok" });
    }
    res.status(404).json({ message: "Bad" });
  }catch(e){
    res.status(404).json({ message: "Bad" });
  }
}

// Private function for deleting files
const removeFile = (file)=>{
  let filePath = path.resolve(__dirname, '../..','static','pages_img',file);
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

async function addViewToPage(req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  let { reference, views } = req.params;
  try {
    const currentPage = await MenuPage.findOne({ reference });
    const viewAddedToPage = await MenuPageContent.findOneAndUpdate({
      _id: currentPage.pageContent
    },{ views: ++views }, { new: true });
    //
    if(viewAddedToPage){
      return res.status(200).json({ message: "Amount of views", views: viewAddedToPage.views });
    }
  } catch (e) {
    res.status(500).json(e);
  }
}

async function changeLikeState(req, res){
  const { id: _id } = req.user;
  const referencePage = req.params.reference;
  //'isValidId' checks if '_id' is mongoose id: mongoose.Types.ObjectId.isValid(_id)
  if(!isValidId(_id)) return res.status(404).send('There is no page');
  try{
    //Get likes from related document collection
    const pageWithContent = await MenuPage.find({
      reference: referencePage
    }).populate('pageContent');
    //
    if(!pageWithContent.length) return res.status(404).json({ message: "Page is absent" });
    //Check if user is already liked the page
    let likes = pageWithContent[0].pageContent.likes;
    //Check is the page liked
    const index = likes.findIndex(id => {
      return String(id) === String(_id);
    });
    // We send 'likeState' to the client as response
    let likeState = false;
    //If a person has not liked the page yet
    if(index === -1){
      likes.push(_id);
      //The page is liked
      likeState = true;
    }else{
      //Remove person's like
      likes = likes.filter(id => {
        return String(id) !== String(_id);
      });
    }
    //Like updated in the array of likes
    //The 'page' beneath is instead of this - { likes: (page.likes + 1) }
    const pageUpdated = await MenuPageContent.findByIdAndUpdate(
      { _id: pageWithContent[0].pageContent._id },
      { likes },
      { new: true });
    if(pageUpdated){
      return res.status(200).json({ message: "Likes state changed", likeState });
    }
  }catch(e){
    res.status(404).json({ message: "Can't find the page", error: e });
  }
}

module.exports = {
  getMenuPages,
  getMenuPageContent,
  createPage,
  getFullPageContent,
  updatePage,
  deleteImage,
  deletePageData,
  addViewToPage,
  changeLikeState
};
