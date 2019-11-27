const querystring = require('querystring');
const { handleBlogRouter } = require('./src/router/blog');
const handleUserRouter = require('./src/router/user');

// 获取cookie 的过期时间
const getCookieExpires = () => {
  const d = new Date(); // 获取当前时间(13位毫秒数)
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000 )); // 将 d 的时间设置为当前时间加24小时
  console.log("d.toGMTString is", d.toGMTString());
  return d.toGMTString();
};

// session 数据
const SESSION_DATA = {};

// 用于处理 POST data
const getPostData = (req) => {
  const promise = new Promise((resolve, reject) => {
    if (req.method !== 'POST') {
      resolve({});
      return;
    }
    // 告诉服务端POST数据的类型是JSON格式，如果不是JSON格式暂时忽略,使用原生node暂时只考虑JSON格式
    if (req.headers['content-type'] !== 'application/json') {
      resolve({});
      return;
    }
    // 如果不是前两种情况，开始接收数据
    let postData = '';
    req.on('data', (chunk) => {
      // 再次提醒chunk是二进制的形式，一定要将其转换为字符串
      postData += chunk.toString();
    });
    req.on('end', () => {
      if (!postData) {
        resolve({});
        return;
      }
      resolve(
        JSON.parse(postData)
      )
    })
  });
  return promise;
};

const serverHandle = (req, res) => {
  // 设置返回格式 JSON
  res.setHeader('content-type', 'application/json');

  // 获取 path
  const url = req.url;
  // 第一次写时写成了 const req.path = url.split('?')[0]; req早就是定义好的了，为什么还要用const呢
  req.path = url.split('?')[0];

  // 解析 query, 返回一个对象，对象的属性是传入的参数名，值是参数值，就是在url中？后面的部分
  req.query = querystring.parse(url.split('?')[1]);

  // 解析 cookie
  req.cookie = {}; // 用于存放cookie
  const cookieStr = req.headers.cookie || ''; // 一个字符串
  // 下面的操作是对得到的cookie做一些处理，整理成对象的形式
  cookieStr.split(';').forEach(item => {
   // item 的形式是 k1=v1
    if (!item) {
      return;
    } else {
      const arr = item.split('=');
      const key = arr[0].trim(); // trim() 去掉空格
      const val = arr[1].trim();
      req.cookie[key] = val;
      console.log(key, val);
    }
  });

  // 解析session
  let needSetCookie = false; // 是否需要设置cookie
  let userId = req.cookie.userid;
  console.log('userId=', userId);
  if (userId) {
    if (!SESSION_DATA[userId]) {
      SESSION_DATA[userId] = {};
    }
    req.session = SESSION_DATA[userId];
  } else {
    // userId 是一个字符串只要保证不重复就可以
    needSetCookie = true;
    userId = `${Date.now()}_${Math.random()}`;
    SESSION_DATA[userId] = {};
    console.log('SESSION_DATA[userId] = ', SESSION_DATA[userId]);
    req.session = SESSION_DATA[userId];
  }


  // 处理 postData
  getPostData(req).then((postData) => {
    req.body = postData;
    // 处理 blog 路由
    const blogResult = handleBlogRouter(req, res);
    if (blogResult) {
      blogResult.then(blogData => {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; htppOnly; expires=${getCookieExpires()}`);
        }
        res.end(
          JSON.stringify(blogData)
        );
      });
      return;       // 一次请求一般只能是一个url，所以如果是blog请求，那么处理完blog请求之后就没必要再进行user的请求了。
    }

    // 处理 user 路由
    const userResult  = handleUserRouter(req, res);
    if (userResult) {
      userResult.then((userData)=> {
        if (needSetCookie) {
          res.setHeader('Set-Cookie', `userid=${userId}; path=/; htppOnly; expires=${getCookieExpires()}`);
        }
        res.end(
          JSON.stringify(userData)
        );
      });
      return;
    }

    // 未命中路由，返回404
    // 将状态码 404 写在res的header上
    res.writeHead(404, {"content-type": "text/plain"});
    res.write("404 Not Found\n");
    res.end(); // 这里面什么都不需要写，因为会显示res.writer里面的内容
  });


};
module.exports = serverHandle;