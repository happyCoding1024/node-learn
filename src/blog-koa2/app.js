const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger') // 注意它并不起到日志的作用，只是将console.log 控制台的输出格式变得更易阅读
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')

const index = require('./routes/index')
const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

const { REDIS_CONF } = require('./config/db')

// error handler
onerror(app)

// middlewares
// bodyparser是处理postdata的
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
// 和前端有关
app.use(require('koa-static')(__dirname + '/public'))
// 和前端有关
app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next() // 执行另一个中间件
  const ms = new Date() - start // 执行这个中间件所花费的时间
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 日志
const ENV = process.env.NODE_ENV;
console.log('ENV', ENV);
if (ENV !== 'production') {
  // 开发环境
  // 默认的输出位置，即控制台，这样就是我们为什么会在控制台看到内容的原因
  app.use(morgan('dev', {
    stream: process.stdout
  }));
} else {
  // 线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log');
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  });
  app.use(morgan('combined', {
    stream: writeStream
  }));
}



// session 部分要在注册路由之前写，因为像bolg中需要用到 session中的数值
app.keys = ['WJiol#23123_'] // 和express中配置session中的secret类似

app.use(session({
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  },

  // 配置 redis
  // 利用 stream 的概念理解，store是source，redisStore是desc，
  // 将session 中store 中的内容流入 redis中存储，配置redis时当然需要地址，端口等信息
  store: redisStore({
    //all: '127.0.0.1:6379' // 这个应该是根据开发环境定的
    all: `${REDIS_CONF.host}:${REDIS_CONF.host}.port` // 从配置中获取redis的地址和端口
  })
}))


// routes
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), user.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
