'use-strict'

const ValidationContract = require('../validators/post-validator');
const repository = require('../repositories/post-repository');
const streamRepository = require('../repositories/stream-repository');
const authService = require('../service/auth-service');


exports.post = async (req, res, next) => {
  try {
    let contract = new ValidationContract();
    contract.isRequired(req.body.items,'Deve conter ao menos um item.');

    if (!contract.isValid) {
      res.status(400).send(contract.errors()).end();
      return;
    }

    const token = req.body.token || req.query.token || req.headers['authorization'];
    const data = await authService.decodeToken(token);

    let item = await repository.create({
      title : req.body.title,
      description : req.body.description,
      tags : req.body.tags,
      items : req.body.items,
      location : req.body.location,
      user : data.id,
      publico : req.body.publico
    });

    return res.status(200).send(item);
  } catch (e) {
    console.log(e);
    return res.status(400).send({message : 'Error',data: e});
  } finally {
    console.log('post Post');
  }
}

exports.getPostLessThanOrEqual = async (req, res, next) => {
  try {
    let contract = new ValidationContract();
    contract.isRequired(req.body.data,'A data é obrigatŕoria.');
    contract.isIsoDateValid(req.body.data, 'Formato de data incorreto.')

    if(!contract.isValid()){
      return res.status(400).send(contract.errors()).end();
    }

    const token = req.body.token || req.query.token || req.headers['authorization'];
    const data = await authService.decodeToken(token);

    let posts = await repository.getPostLessThanOrEqualDate(data.id, req.body.data);
    return res.status(200).send(posts);
  } catch (e) {
    console.log(e);
    return res.status(400).send({message : 'Error',data: e});
  } finally {
    console.log('post Post');
  }
}
