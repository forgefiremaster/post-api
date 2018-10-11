'use-strict'

const jwt = require('jsonwebtoken');

exports.generateToken = async (data) => {
  return jwt.sign(data, global.SALT_KEY, { expiresIn:'1d'});
};

exports.decodeToken = async (token) => {
  var data = await jwt.verify(token, global.SALT_KEY);
  return data;
};


//Interceptadores
exports.authorize = function (req, res, next) {
  var token = req.body.token || req.query.token || req.headers['authorization'];

  if(!token){
    res.status(401).json({message : 'Sem autorização'});
  }else{
    jwt.verify(token, global.SALT_KEY, function(error, decoded){
      if(error){
        res.status(401).json({message : 'Token inválido'});
      }else {
        next();
      }
    });
  }
}

//função que define se usário é admin ou não
exports.isAdmin = function(req, res, next) {
  let token = req.body.token || req.headers['authorization'] || req.query.token;

  if (!token) {
    res.status(401).send({
      message : 'Token inválido'
    });
  } else {
    jwt.verify(token, global.SALT_KEY, function(error, decoded){
      if(error){
        res.status(400).send({
          message : 'Token inváĺido'
        });
      } else {
        if(decoded.roles.includes('admin')){
          next();
        }else {
          res.status(403).json({
            message : 'Esta funcionalidade é estritamente para administrador.'
          });
        }
      }
    });
  }
};
