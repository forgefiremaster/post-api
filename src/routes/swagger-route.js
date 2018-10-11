'use-strict'

//Pacote mvc
const express = require('express');
//definindo a rota baseado no express MVC
const router = express.Router();

//Definindo rotas
//GET
const route = router.get('/', (req, res, next) =>{
  res.status(200).send({
    title : "Node Store API",
    version: "0.0.1"
  });
});

module.exports = router;
