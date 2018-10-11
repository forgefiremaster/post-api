'use-strict'

const mongoose = require('mongoose');
const Post = mongoose.model('Post');

const User = mongoose.model('User');

exports.getPostLessThanOrEqualDate = async(id, date) => {

  var posts = [];

  let user = await User.findById(id);

  for (var i = 0;i < user.following.length; i++) {
    posts = await Post.find({
      user : user.following[i].user
    }, 'title description tags items location publico createDate user likes')
    .sort({'createDate' : 'descending'});
  }
  
  return posts;
}

exports.getPostGreaterThanOrEqualDate = async(userId, date) => {

}

exports.getById = async(id) => {
  const res = await Post.findOne({id : id}, 'title description tags items location publico createDate user likes');
  return res;
}

exports.create = async(data) => {
  let post = new Post(data);
  return await post.save(post);
}
