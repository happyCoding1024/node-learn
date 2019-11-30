const express = require('express');

// 本次 http 请求的实例
const app = express();

// app.use 第一个参数的路由没有写，表示任何路由时都会执行
app.use((req, res, next) => {
  console.log('请求开始...', req.method, req.url);
  next(); // 如果是 get请求，执行都next之后表示向下会找符合条件的app.use，和app.get去执行，注意app.post不会执行，因为是get请求。
});

app.use((req, res, next) => {
  // 假设在处理 cookie
  req.cookie = {
    userId: 'abc123'
  };
  console.log('req.cookie = ', req.cookie);
  next();
});

app.use((req, res, next) => {
  // 假设处理 post data
  // 异步(因为是 req.on('data')的方式来读取数据）
  // 模拟异步
  setTimeout(() => {
    req.body = {
      a: 100,
      b: 200
    };
    console.log('req.body = ', req.body);
    next();
  });
});

// 使用 use 时表示无论是post还是get都会处理参数中的路由
app.use('/api', (req, res, next) => {
  console.log('处理 /api 路由');
  next();
});

app.get('/api', (req, res, next) => {
  console.log('get /api 路由');
  next();
});

app.post('/api', (req, res, next) => {
  console.log('post /api 路由');
  next();
});

// 模拟登陆验证
function loginCheck(req, res, next) {
  console.log('模拟登陆成功');
  setTimeout(() => {
    next()
  });
}

// 模拟登陆失败后不会再继续执行获取cookie的函数，因为没有next()
// function loginCheck(req, res, next) {
//   setTimeout(() => {
//     console.log('模拟登录失败');
//     res.json({
//       errno: -1,
//       msg: 'login fail'
//     })
//   });
// }

// 注意没有执行next
// 这种写法很有用，loginCheck 是一个中间件，在验证成功后再继续执行第二个中间件(第三个参数)，失败后就不再执行了。少了登录验证if的判断了。
// 而且哪一步需要登录验证操作的直接将loginCheck函数写在参数里就行，方便易维护
app.get('/api/get-cookie', loginCheck, (req, res, next) => {
  console.log('get /api/get-cookie');
  res.json({
    errno: 0,
    data: req.cookie
  });
});

// 注意没有执行next
app.post('/api/get-post-data', (req, res, next) => {
  console.log('post /api/get-post-data');
  res.json({
    errno: 0,
    data: req.body
  });
});

app.use((req, res, next) => {
  console.log('处理 404');
  res.json({
    errno: -1,
    msg: '404 not found'
  })
});

app.listen(3000, () => {
  console.log('listening port 3000');
});