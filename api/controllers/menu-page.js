const { MenuPage, MenuPageContent } = require('./../helpers/db');
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

function createPage(req, res){
    const { pageName, pageHidden, parent, item, ...rest } = req.body;
      const id = createPageItemIdV4();
      const reference = createReferenceV5(parent, item);
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
  createPage
};
