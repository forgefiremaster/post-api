'use-strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  mime : {
    type : String,
    required : true
  },
  url : {
    type : String,
    required : false
  },
  dir : {
    type : String,
    required : false
  },
  publico : {
    type : Boolean,
    required : true,
    default : true
  },
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  }
});

module.exports = mongoose.model('Stream', schema);
