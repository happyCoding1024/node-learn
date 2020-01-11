const http = require('http');

http.createServer(function (request, response) {
  console.log('request come', request.url);
  response.writeHeader(200, {
    'Access-Control-Allow-Origin': 'http://localhost:63342'
  });
  response.end('123');
}).listen(8888);

console.log('server listening on 8888');