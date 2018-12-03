#!/usr/bin/env node
'use strict';

const Hapi = require('hapi');
const filepaths = require('filepaths');
const hapiBoomDecorators = require('hapi-boom-decorators');

const config = require('./config');

async function createServer() {
  // Инициализируем сервер
  const server = await new Hapi.Server(config.server);

  await server.register([
    hapiBoomDecorators
  ]);

  // Загружаем все руты из папки ./src/routes/
  let routes = filepaths.getSync(__dirname + '/src/routes/');
  for(let route of routes)
    server.route( require(route) );
  
  // Запускаем сервер
  try {
    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
  } catch(err) { // если не смогли стартовать, выводим ошибку
    console.log(JSON.stringify(err));
  }

  // Функция должна возвращать созданый сервер, зачем оно нужно, расскажу далее
  return server;
}

createServer();