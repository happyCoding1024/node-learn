var express = require('express');
var app = express();

app.use((req, res, next) => {
  console.log("app.use ran");
  next();
});

app.get('/api/get-cookie', function(req, res){
  res.send('hello world');
});

app.listen(3000);