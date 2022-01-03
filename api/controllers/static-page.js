const { StaticPage } = require('./../helpers/db');

//For admin
async function getAllStaticPages(req, res){
  try{
    let allStaticPages = await StaticPage.find({});
    if(allStaticPages && allStaticPages.length > 0){
      allStaticPages = allStaticPages.map((staticPage) => {
        //Capitalize first letter
        let name = staticPage.name[0].toUpperCase()+staticPage.name.substr(1);
        return {
          name,
          header: staticPage.header,
          text: staticPage.text
        }
      });
      return res.status(200).json({ message: "All static", static: allStaticPages });
    }else if(allStaticPages && allStaticPages.length === 0){
      return res.status(200).json({ message: "All static", static: [] });
    }
    return res.status(400).json({ message: "All static absent", static: null });
  }catch(e){
    return res.status(400).json({ message: "All static absent", static: null });
  }
}
//For admin and public
async function getStaticPage(req, res){
  let { pageName: staticPageName } = req.params;
  if(!staticPageName) return res.status(400).json({ message: "Static is absent", static: null });
  try{
    staticPageName = staticPageName.trim().toLowerCase();
    const staticPage = await StaticPage.findOne({ name: staticPageName }).exec();
    if(staticPage){
      //Capitalize first letter
      let name = staticPage.name[0].toUpperCase()+staticPage.name.substr(1);
      return res.status(200).json({ message: "Static page", static: {
        name,
        header: staticPage.header,
        text: staticPage.text
      } });
    }else{
      return res.status(400).json({ message: "Static is absent", static: null });
    }
  }catch(e){
    return res.status(400).json({ message: "Static is absent", static: null });
  }
}
// For admin
async function createStaticPage(req, res){
  const { header, text } = req.body;
  let name = req.body.name.trim().toLowerCase();
  try{
    const staticPage = await StaticPage.findOne({ name });
    if(staticPage){
      return res.status(200).json({ message: "Static page already exists", static: {} });
    }
    const newStaticPage = new StaticPage({
      name,
      header,
      text
    });
    await newStaticPage.save();
    return res.status(200).json({ message: "Static page created", static: newStaticPage });
  }catch(e){
    return res.status(400).json({ message: "Static page isn't created", static: null });
  }
}

// For admin
async function updateStaticPage(req, res){
  const { header, text } = req.body;
  let name = req.body.name.trim().toLowerCase();
  if(!name) return res.status(400).json({ message: "Static is absent", static: null });
  try{
    const staticPage = await StaticPage.findOneAndUpdate(
      { name },
      { header, text },
      { new: true }
    );
    if(staticPage){
      return res.status(200).json({ message: "Static page created", static: staticPage });
    }
    return res.status(400).json({ message: "Static page isn't created", static: null });
  }catch(e){
    return res.status(400).json({ message: "Static page isn't created", static: null });
  }
}
// For admin
async function deleteStaticPage(req, res){
  let { name } = req.body;
    name = name.trim().toLowerCase();
  if(!name) return res.status(400).json({ message: "Static is absent", static: null });
  try{
    const staticPage = await StaticPage.findOneAndDelete({ name });
    if(staticPage){
      return res.status(200).json({ message: "Static page deleted", static: staticPage });
    }
    return res.status(400).json({ message: "Static page isn't deleted", static: null });
  }catch(e){
    return res.status(400).json({ message: "Static page isn't deleted", static: null });
  }
}

module.exports = {
  getAllStaticPages,
  getStaticPage,
  createStaticPage,
  updateStaticPage,
  deleteStaticPage
}
