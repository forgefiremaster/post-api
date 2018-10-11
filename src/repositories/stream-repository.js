'use-strict'

const mongoose = require('mongoose');
const Stream = mongoose.model('Stream');

exports.getById = async (id, userId) => {
  const res = await Stream.findOne(
    {
      id : id,
      user : userId
    }, 'mime url dir publico');
  return res;
}

exports.create = async (data) => {
  let stream = new Stream(data);
  return await stream.save(stream);
}

exports.update = async (data) => {
  await Stream
      .findByIdAndUpdate(data.id, {
        $set: {
          mime: data.mime,
          dir: data.dir,
          user : data.user,
          publico : data.publico,
          url : data.url
        }
      });
}
