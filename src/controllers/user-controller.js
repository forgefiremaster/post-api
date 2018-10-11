'use-strict'

const ValidationContract = require('../validators/user-validator');
const repository = require('../repositories/user-repository');
const md5 = require('md5');
const authService = require('../service/auth-service');

exports.get = async(req, res, next) => {
  try {
    var data = await repository.get();
    return res.status(200).send(data);
  } catch(e) {
    return res.status(400).send({message : 'Error',data: e});
  } finally{
    console.log('GET user');
  }
};

exports.getByUsername = async(req, res, next) => {
  try {
    var data = await repository.getByUsername(req.params.username);
    return res.status(200).send(data);
  } catch (e) {
    return res.status(400).send({message : 'Error',data: e});
  } finally {
      console.log('GetByUsername user');
  }
};

exports.post = async (req, res, next) => {
  let contract = new ValidationContract();

  //Validadores
  contract.hasMinLen(req.body.username, 3 , 'O nome deve ter pelo menos 3 caracteres.');

  contract.hasMinLen(req.body.password, 10, 'A senha deve ter no minímo 10 caracteres.');

  contract.hasMaxLen(req.body.password, 20, 'A senha deve ter no máximo 20 caracteres.');

  if (req.body.email) {
    contract.isEmail(req.body.email, 'Este não é um e-mail válido.');
  }

  //Se os dados forem válidos
  if (!contract.isValid()) {
   res.status(400).send(contract.errors()).end();
   return;
  }

  try {
      await repository.create(
        {
          email : req.body.email,
          name : req.body.name,
          username : req.body.username,
          password : md5(req.body.password + global.SALT_KEY),
          facebook : req.body.facebook,
          phone : req.body.phone
        }
    );
      return res.status(201).send({message : 'Usuário criado!'});
    } catch (e) {
      return res.status(400).send({message : 'Error',data: e});
    } finally {
      console.log('Create user');
    }
};

exports.delete = async(req, res, next) => {
  try {
    const token = req.body.token || req.query.token || req.headers['authorization'];
    const data = authService.decodeToken(token);

    await repository.delete(data.id);
    return res.status(200).send({message : 'Ususario deletado com sucesso.'});
  } catch (e) {
    return res.status(500).send({message : 'Falha na requisição', data : e});
  } finally {
    console.log("delete user");
  }
};

exports.update = async (req, res, next) => {
  try {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.username, 3 , 'O nome deve ter pelo menos 3 caracteres.');

    if (!contract.isValid()) {
     res.status(400).send(contract.errors()).end();
     return;
    }

    const token = req.body.token || req.query.token || req.headers['authorization'];

    const data = await authService.decodeToken(token);

    await repository.update(data.id, {
        name : req.body.name,
        username : req.body.username,
        facebook : req.body.facebook,
        phone : req.body.phone
      });

    return res.status(201).send({message : 'Usuário atualizado com sucesso', data : data});
  } catch (e) {
    return res.status(400).send({message: 'Falha ao atualizar o Usuário',data:e});
  } finally {
    console.log('Update');
  }
};

exports.authenticate = async (req, res, next) => {
  try {
    const user = await repository.authenticate({
      username : req.body.username,
      password : md5(req.body.password + global.SALT_KEY)
    });

    if (!user) {
      res.status(401).send({
        message : 'Username ou senha inválido.'
      })
      return;
    }

    const token = await authService.generateToken({
      id : user._id,
      email : user.email,
      username : user.username
     });

    return res.status(201).send({token : token, data : {username : user.username, email : user.email}});
  } catch (e) {
    console.log(e);
    return res.status(500).send({message : 'Falha na requisição', data : e});
  } finally {
    console.log('authenticate user');
  }
};

exports.refreshToken = async (req, res, next) => {
  try {

    //recuperar token antes de criar um Cliente - primeiro garanta queo tken é válido
    const token = req.body.token || req.query.token || req.headers['authorization'];

    const data = await authService.decodeToken(token);

    const user = await repository.getById(data.id);

    if (!user) {
      res.status(401).send({
        message : 'Usuário não encontrado.'
      })
      return;
    }

    const tokenData = await authService.generateToken({
      id : user._id,
      email : user.email,
      username : user.username
     });

    return res.status(201).send({token : tokenData, data : {username : user.username, email : user.email}});
  } catch (e) {
    console.log(e);
    return res.status(500).send({message : 'Falha na requisição', data : e});
  } finally {
    console.log('refreshToken user');
  }
};

exports.follow = async (req, res, next) => {
  try {
    let contract = new ValidationContract();
    contract.isRequired(req.body.id,'Deve conter o id do usuário que deve ser seguido.');
    if (!contract.isValid()) {
     res.status(400).send(contract.errors()).end();
     return;
    }

    let token = req.body.token || req.query.token || req.headers['authorization'];
    let data = await authService.decodeToken(token);

    let eu = data.id;
    let ele = req.body.id;

    var callback = function(err) {
      if(err){
        return res.status(403).send({message : "Not found user "});
      }
      else {
        return res.status(200).send({message : "Following"});
      }
    };

    if (eu && ele) {
      await repository.follow(eu, ele, callback);
    }else {
      return res.status(403).send({message : "Not found user "});
    }

  } catch (e) {
    console.log(e);
    return res.status(503).send({message : e});
  } finally {
    console.log("follow user");
  }
}

exports.unfollow = async (req, res, next) => {
  try {
    let contract = new ValidationContract();
    contract.isRequired(req.body.id,'Deve conter o id do usuário que deve ser seguido.');
    if (!contract.isValid()) {
     res.status(400).send(contract.errors()).end();
     return;
    }

    let token = req.body.token || req.query.token || req.headers['authorization'];
    let data = await authService.decodeToken(token);

    let eu = data.id;
    let ele = req.body.id;

    var callback = function(err) {
      if(err){
        return res.status(403).send({message : "Not found user "});
      }
      else {
        return res.status(200).send({message : "Ufollowing"});
      }
    };

    if (eu && ele){
      await repository.unfollow( eu, ele, callback);
    }else {
      return res.status(403).send({message : "Not found user "});
    }

  } catch (e) {
    console.log(e);
    return res.status(503).send({message : e});
  } finally {
    console.log("follow user");
  }
}
