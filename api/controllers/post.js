const fs = require('fs');
const path = require('path');
const { Post, Comment } = require('./../helpers/db');

// Create new Post - in Admin
module.exports.createPost = async (request, response) => {
  const { id:userId } = request.user;
  const post = new Post({
    title: request.body.title,
    text: request.body.text,
    // Get the file path of an uploaded image by Multer
    imageUrl: `${request.file.filename}`,
    user: userId
  })
  try {
    await post.save();
    // Data saved in DB
    response.status(201).json({ message: "New post created" });
  } catch (e) {
    response.status(500).json(e);
  }
}

// Get all Posts in Admin and Public
module.exports.getPosts = async (request, response) => {
  const role = request.user ? request.user.role : undefined;
  try {
    let posts;
    //On admin side
    if((role && role === 'admin') || (role && role === 'moderator')){
      posts = await Post.find({}).populate('user');
      if(!posts.length){
        return response.status(400).json({ message: "No posts", posts: [] });
      }
      posts = posts.map( post =>{
        let newPost = {
          _id: post._id,
          views: post.views,
          comments: post.comments,
          title: post.title,
          date: post.date,
          user: {
            name: post.user.login,
            role: post.user.role
          }
        }
        return newPost;
      });
    }else{
    //On client side
      posts = await Post.find({});
      if(!posts.length){
        return response.status(200).json({ message: "No posts", posts: [] });
      }
    }
    // Sort posts in reverse order
    posts.sort(function(a,b){
      // Turn your strings into dates, and then subtract them
      // to get a value that is either negative, positive, or zero.
      return new Date(b.date) - new Date(a.date);
    });
    response.status(200).json({ message: "All posts", posts });
  } catch (e) {
    response.status(400).json({ message: "Error" , posts: [] });
  }
}

// Get Post by ID in Admin
module.exports.getAdminPostById = async (request, response) => {
  const id = request.params.id;
  if(!id) return response.status(400).json({ message: "Invalid post data" , post: {} });
  try {
    const post = await Post.findById(id).exec();
    if(post){
      return response.status(200).json({ message: "The post data" , post });
    }
    throw new Error("Something went wrong");
  } catch (e) {
    return response.status(400).json({ message: e.message, post: {} });
  }
}

module.exports.updatePost = async (req, res)=>{
  if(req.body.imagePostToDelete){
    //Remove previous image by name 'imagePostToDelete'
    removeFile(req.body.imagePostToDelete);
  }
  //Parse the JSON data from 'allData' field - it is an Object of all client data except image
  let body = JSON.parse(req.body.postData);
  const postUpdateData = {};
  let { title, text } = body;
  postUpdateData.title = title;
  postUpdateData.text = text;
  //Get 'id' of 'Post' Model
  const id = req.params.id;
  //'singleImage' is undefined because it comes through the Multer
  if(!req.body.singleImage){
    //If an image is sent, its file name is checked
    if(req.file){
      postUpdateData.imageUrl = req.file.filename;
    }
  }else{//'imagePostToDelete' has a name
    postUpdateData.imageUrl = req.body.imagePostToDelete;
  }
  try{
    //Update Models
    const postUpdated = await Post.findOneAndUpdate(
      { _id: id },
      { ...postUpdateData },
      { new: true }
    );
    return res.status(200).json({ message: "Post updated", postUpdated });
  }catch(e){
    res.status(400).json({ message: "Post can't be updated", error: e });
  }
}

// Delete Post by ID in Admin
module.exports.deletePost = async (request, response) => {
  const id = request.params.id;
  if(!id) return response.status(400).json({ message: "Wrong request" });
  try {
    const postWithComments = await Post.findById(id).populate('comments').exec();
    if(!postWithComments || !postWithComments.imageUrl){
      return response.status(400).json({ message: "Wrong request" });
    }
    //Delete the Post image
    removeFile(postWithComments.imageUrl);
    const commentIds = [];
    if(postWithComments.comments && !!postWithComments.comments.length){
      //Get the all Comment ids
      postWithComments.comments.forEach(el => {
        commentIds.push(el._id);
      });
    }
    //Removing data from Comment Model
    if(!!commentIds.length){
      await Comment.deleteMany({ _id: { $in : commentIds } });
    }
    //Delete the Post itself
    const postDeleted = await Post.deleteOne({ _id: id});
    if(postDeleted){
      return response.status(200).json({ message: "Post deleted", postId: id });
    }
  } catch (e) {
    return response.status(400).json({ message: e.message });
  }
}

// Get Post by ID on client side
module.exports.getClientPostById = (request, response) => {
  const id = request.params.id;
  if(!id) return response.status(400).json({ message: "Invalid post data" , post: null });
  try {
    Post.findById(id).populate('comments').exec((error, post) => {
      if(error){
        return response.status(400).json({ message: e.message, post: null });
      }
      if(post){
        return response.status(200).json({ message: "The post data" , post });
      }
    });
  } catch (e) {
    return response.status(400).json({ message: e.message, post: null });
  }
}

module.exports.addViewToPostById = async (request, response) => {
  const { id } = request.params;
  const update = {
    views: ++request.body.views
  }
  try {
    const postUpdated = await Post.findOneAndUpdate({ _id: id }, update, {
      new: true
    });
    if(postUpdated){
      // 204 - Success, without content creation
      return response.status(204).json();
    }
  } catch (e) {
    response.status(500).json(e);
  }
}

// Private function for deleting files
const removeFile = (file)=>{
  let filePath = path.resolve(__dirname, '../..','static','posts_img',file);
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
