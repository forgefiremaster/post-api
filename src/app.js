'use-strict'

//Pacote mvc
const express = require('express');

//Pacote JSON decode
const bodyParser = require('body-parser');

//Conexão com o mongo
const mongoose = require('mongoose');

//Criando o application
const app = express();

//carregando os models
const User = require('./models/User');
const Stream = require('./models/Stream');
const Post = require('./models/Post');

//Arquivo global de configuração
const config  = require('./config');

//Conectando com o banco de dados mongoDb
mongoose.connect(config.connectionString);

//Carregar as rotas
const indexRoute = require('./routes/index');
const userRoute = require('./routes/user-route');
const streamRoute = require('./routes/stream-route.js');
const postRoute = require('./routes/post-route.js');
const swaggerRoute = require('./routes/swagger-route.js')

//Implenta o swagger
//const swaggerUi = require('swagger-ui-express'), swaggerDocument = require('./swagger.json');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//Definindo o midleware com bodyParser para todas as requisições serem convertidas para Json, com limite
//de 5 megas no corpo da requisição, mas pode aumentar se queiser
app.use(bodyParser.json({
  limit : '10mb'
}));
app.use(bodyParser.urlencoded({ extends : false }));

//Habilitar CORS ->IMPORTANTE
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept, authorization');
  res.header('Access-Control-Allow-Methods','GET, POST, DELETE, PUT');
  next();
});

//Setando a rota em nossa api
app.use('/', indexRoute);
app.use('/user', userRoute);
app.use('/stream', streamRoute);
app.use('/post', postRoute);
//app.use('/api/v1', swaggerRoute);

module.exports = app;
