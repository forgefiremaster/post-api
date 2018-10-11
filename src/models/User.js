'use-strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  name : {
    type : String,
    required : true
  },
  username : {
    type : String,
    required : true,
    unique : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  phone : {
    type : String,
    required : false
  },
  facebook : {
    type : String,
    required : false
  },
  followers : [
    {
        user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false
      }
    }
  ],
  following : [
    {
    user : {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required : false
    }
  }
]
});

module.exports = mongoose.model('User', schema);
