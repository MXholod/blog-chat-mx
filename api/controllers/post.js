const { Post } = require('./../helpers/db');

// Create new Post - in Admin
module.exports.createPost = async (request, response) => {
  const post = new Post({
    title: request.body.title,
    text: request.body.text,
    // Get the file path of an uploaded image by Multer
    imageUrl: `${request.file.filename}`
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
  try {
    const posts = await Post.find({});
    if(!posts.length){
      return response.status(200).json({ message: "No posts", posts: [] });
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

// Get Post by ID in Admin and Public
module.exports.getPostById = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id)
    // bindings between models
    post.populate('comments').exec((error, post) => {
      response.status(200).json(post)
    })
  } catch (e) {
    response.status(500).json(e)
  }
}

// Update Post by ID in Admin
module.exports.updatePostById = async (request, response) => {
  const $set = {
    title: request.body.title,
    text: request.body.text
  }
  try {
    const post = await Post.findOneAndUpdate({
      _id: request.params.id
    }, { $set }, { 'new': true })
    response.status(200).json(post)
  } catch (e) {
    response.status(500).json(e)
  }
}

// Delete Post by ID in Admin
module.exports.deletePostById = async (request, response) => {
  try {
    await Post.deleteOne({ _id: request.params.id})
    response.status(200).json({ message: 'Post removed' })
  } catch (e) {
    response.status(500).json(e)
  }
}

module.exports.addViewToPostById = async (request, response) => {
  const $set = {
    views: ++request.body.views
  }
  try {
    await Post.findOneAndUpdate({ _id: request.params.id }, { $set })
    // 204 - Success, without content creation
    response.status(204).json({ message: 'Views incremented' })
  } catch (e) {
    response.status(500).json(e)
  }
}
