'use-strict'

//Importando pacotes
const http = require('http'); //servidor http
const debug = require('debug') ('node-str:server'); //pacode para debugar
const app = require('../src/app')

//Definindo a porta de comunicação do servidor
const port = normalizaPort(process.env.PORT || '4000');
//setando a porta em nossa app
app.set('port' ,port);

//Criando o sercidor
const server = http.createServer(app);

//Definindo um ouvinte para a rota
server.listen(port);

//Tratando eventos de erros no evento On do servidor
server.on('error', onError);

//Tratando evento debung
server.on('listening', onListening);

console.log('API RUNNING ' + port);

function normalizaPort(val){
  const port = parseInt(val, 10);

  if(isNaN(port)){
    return val;
  }

  if(port >= 0){
    return port;
  }

  return false;
}

function onError(error){
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening(){
  const addr = server.address();
  const bind = typeof addr === 'string'
  ? 'pipe ' + address : 'port ' + addr.port;

  debug('Listening' + bind);
}
