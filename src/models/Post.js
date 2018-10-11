'use-strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  title : {
    type : String,
    required: false
  },
  description : {
    type : String,
    required : false
  },
  tags : [{
    type : String,
    required : false
  }],
  createDate: {
    type: Date,
    required: true,
    default : Date.now
  },
  items : [
    {
      stream : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stream',
        required : true
      }
    }
  ],
  location : [{
    lat : {
      type : Number,
      required : true
    },
    lng : {
      type : Number,
      required : true
    }
  }],
  user : {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required : true
  },
  publico : {
    type : Boolean,
    required : true,
    default : true
  },
  likes : [
    {
      user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : false
      }
    }
  ]
});

module.exports = mongoose.model('Post', schema);
