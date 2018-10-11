'use-strict'

const ValidationContract = require('../validators/stream-validator');
const repository = require('../repositories/stream-repository');
const authService = require('../service/auth-service');


exports.getById = async (req, res, next) => {
  try {
      return await res.status(200).send(repository.getById(req.body.id, req.body.idUser));
  } catch (e) {
    return await res.status(500).send({message : 'Erro na busca', data : e})
  } finally {
    console.log('getById stream');
  }
}

exports.post = async (req, res, next) => {
  try {
    let contract = new ValidationContract();

    //Validadores
    contract.isRequired(req.body.mime,'A extensão é obrigatória.');

    contract.isRequired(req.body.content, 'Sem conteúdo de arquivo.');

    //Se os dados forem válidos
    if (!contract.isValid()) {
     res.status(400).send(contract.errors()).end();
     return;
    }

    const token = req.body.token || req.query.token || req.headers['authorization'];
    const data = await authService.decodeToken(token);

    let item = await repository.create({
      mime : req.body.mime,
      publico : req.body.publico,
      user : data.id
    });

    let id = item._id;

    var base64Data = req.body.content.replace("data:image/png;base64,", "");

    var path = "/opt/file-post/" + id + req.body.mime;

    await require("fs")
    .writeFile(path, base64Data, 'base64', async function(err){
      if (err) {
        res.status(400).send(err).end();
        return;
      } else {
        await repository.update({
          id : id,
          mime : req.body.mime,
          publico : req.body.publico,
          user : data.id,
          dir : path,
          url : "nada por equnato!!!!"
        });

        return res.status(201).send({id});
      }
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({message : 'Error',data: e});
  } finally {
    console.log("Post stream");
  }

}
