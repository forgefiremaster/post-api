'use-strict'

const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = require('mongodb').ObjectID;

exports.get = async () => {
  const res = await User.find({}, 'name username email phone facebook followers following')
  .populate('followers.user', 'name')
  .populate('following.user', 'name');
  return res;
}

exports.getById = async(id) => {
  const res = await User.findById(id);
  return res;
}

exports.getByUsername = async (username) => {
  const res = await User.findOne({username : username}, 'name username email phone facebook followers following');
  return res;
}

exports.create = async (data) => {
  let user = new User(data);
  await user.save();
}

exports.authenticate = async (data) => {
 const res = await User.findOne({
      username : data.username,
      password : data.password
   });
 return res;
}

exports.delete =  async (id) => {
  await User.findOneAndRemove(id);
};

exports.update = async (id, data) => {
  await User
      .findByIdAndUpdate(id, {
        $set: {
          username: data.username,
          name: data.name,
          phone : data.phone,
          facebook : data.facebook
        }
      });
}

exports.follow = async (id, follower, callback) => {


      await User.update(
        {
          "_id" : ObjectId(id),
          "followers.user" : {$nin: [ObjectId(follower)]}
         },
        {
         $addToSet : {
           "followers" : { user : follower }
         }
       }, (err, result) => {
        if (err){
          callback(err);
          return;
        }
      });

      await User.update(
        {
          "_id" : ObjectId(follower) ,
           "following.user" : {$nin: [ObjectId(id)]}
         },
        {
         $addToSet : {
           "following" : { user : id }
         }
       }, (err, result) => {
          if (err) {
            callback(err);
            return;
          } else {
            callback(null);
         }
      });

}

exports.unfollow = async (id, follower, callback) =>{
  await User.update({
    "_id" : ObjectId(id),
    "followers.user" : {$in: [ObjectId(follower)]}
   } , {
     $pull : {
       "followers" : { user : follower }
     }
   },(err, result) => {
    if (err){
      callback(err);
      return;
    }
  });

  await User.update({
    "_id" : ObjectId(follower) ,
     "following.user" : {$in: [ObjectId(id)]}
   } , {
     $pull : {
       "following" : { user : id }
     }
   }, (err, result) => {
     if (err) {
       callback(err);
       return;
     } else {
       callback(null);
     }
  });
}
