var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // 解析 cookie 用到
var logger = require('morgan'); // 记录日志用到
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redisClient = require('./db/redis');
const fs = require('fs');



// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev', {
//     stream: process.stdout
//   }
// ));
// 日志
const ENV = process.env.NODE_ENV;
console.log('ENV', ENV);
if (ENV !== 'production') {
  // 开发环境
  // 默认的输出位置，即控制台，这样就是我们为什么会在控制台看到内容的原因
  app.use(logger('dev', {
    stream: process.stdout
  }));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(logger('combined', {
    stream: writeStream
  }));
}

app.use(express.json()); // 类似于blog1中的 getPostData,通过这一步的处理之后就可以使用req.body来获取值
app.use(express.urlencoded({ extended: false })); // 在blog1中的getPostData中只考虑了JSON格式，这是不完善的，这里考虑了其它格式的PostData，经过处理之后可以通过req.body来访问
app.use(cookieParser()); // 通过这一步的处理之后就可以使用 req.cookies. 这种形式来访问cookie中的内容了
app.use(express.static(path.join(__dirname, 'public'))); // public 对应一些静态文件，后端不需要太关心

// session
const sessionStore = new RedisStore({
  client: redisClient,
});
app.use(session({
  secret: 'WJiol#23123_', // 类似于加密时的密匙
  cookie: {
    path: '/', // 默认配置
    httpOnly: true, // 默认配置
    maxAge: 24 * 60 * 60 * 1000 // maxAge是一个生效时间，这里的表示24小时
  },
  store: sessionStore // 以前没有store，redis会存到内存中，现在有了store，session会存到redis中
}));

// app.use('/', indexRouter); // 和 blog1 中的 handleBlogRouter 作用类似，处理的路径是根目录
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render(' err.log');
});

module.exports = app;
