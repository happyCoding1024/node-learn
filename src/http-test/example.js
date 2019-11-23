const http = require('http');
const querystring = require('querystring');

// 服务器
const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;
  const path = url.split('?')[0];
  console.log(path); // path = 'a=1'
  // path1 = [Object: null prototype] { a: '1' }
  const path1 = querystring.parse(url.split('?')[1]);
  console.log(path1);
  const query = querystring.parse(url.split('?')[1]);
  // 设置返回结果的格式：JSON
  res.setHeader('content-type', 'application/json'); // text/html

  // 返回的数据
  const resData = {
    method,
    url,
    path,
    query
  };

  // 返回
  if(method === 'GET') {
    res.end(
      // 不管上面设置的Header设置的是什么类型，这里返回的肯定是一个字符串
      // 要不然怎么传输呢，只是客户端接收到这个字符串之后按照Header中设置的类型去解析
      JSON.stringify(resData)
    );
  }

  if(method === 'POST') {
    let postData = '';
    req.on('data', (chunk) => {
      // 再次提醒chunk是二进制的形式，一定要将其转换为字符串
      postData += chunk.toString();
    });
    req.on('end', () => {
      resData.postData = postData;
      res.end(
        // JSON.stringify(JS对象) 将一个 JS 对象转换为 JSON 字符串（本质上就是一个字符串）
        JSON.stringify(resData)
      )
    });
  }
});

// 监听端口
server.listen(8000, () => {
  console.log('listening 8000 port');
});