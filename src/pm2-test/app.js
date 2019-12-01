const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('content-type', 'application/json');
  res.end(
    JSON.stringify({
      errno: 0,
      msg: 'pm2 test server 2'
    })
  );
});

server.listen(8000, () => {
  console.log('server is listening on port 8000');
});