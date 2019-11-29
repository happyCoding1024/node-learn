var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser'); // 解析 cookie 用到
var logger = require('morgan'); // 记录日志用到

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json()); // 类似于blog1中的 getPostData,通过这一步的处理之后就可以使用req.body来获取值
app.use(express.urlencoded({ extended: false })); // 在blog1中的getPostData中只考虑了JSON格式，这是不完善的，这里考虑了其它格式的PostData，经过处理之后可以通过req.body来访问
app.use(cookieParser()); // 通过这一步的处理之后就可以使用 req.cookies. 这种形式来访问cookie中的内容了
app.use(express.static(path.join(__dirname, 'public'))); // public 对应一些静态文件，后端不需要太关心

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
  res.render(' error');
});

module.exports = app;
