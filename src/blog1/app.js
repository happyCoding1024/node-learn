const handleBlogRouter = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

const serverHandle = (req, res) => {
  // 设置返回格式 JSON
  res.setHeader('content-type', 'application/json');

  // 获取 path
  const url = req.url;
  // 第一次写时写成了 const req.path = url.split('?')[0];
  req.path = url.split('?')[0];

  // 处理 blog 路由
  const blogData = handleBlogRouter(req, res);
  if (blogData) {
    res.end(
      JSON.stringify(blogData)
    );
    // 一次请求一般只能是一个url，所以如果是blog请求，那么处理完blog请求之后就没必要再进行user的请求了。
    return;
  }

  // 处理 user 路由
  const userData = handleUserRouter(req, res);
  if (userData) {
    res.end(
      JSON.stringify(userData)
    );
    return;
  }

  // 为命中路由，返回404
  // 将状态码 404 写在res的header上
  res.writeHead(404, {"content-type": "text/plain"});
  res.write("404 Not Found\n");
  res.end(); // 这里面什么都不需要写，因为会显示res.writer里面的内容
};
module.exports = serverHandle;