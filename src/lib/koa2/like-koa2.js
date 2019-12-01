const http = require('http');

// 组合中间件
function compose(middleWareList) {
  return function (ctx) {
    // 中间件调用
    function dispatch(i) {
      const fn = middleWareList[i];
      try { // 当前运行的中间件有可能是有错误的所以要捕获一下错误
        // 问题：fn() 运行后已经是一个promise为什么还要加一个 Promise.resolve?
        // 因为不能保证 fn() 返回的是一个 promise，koa中虽然规定 中间件都是 async 函数(async函数会返回 promise)
        // 但是就算不是 async 函数也不会报错，但是这时候返回的就不一定是一个promise了。
        return Promise.resolve(
          fn(ctx, dispatch.bind(null, i+1)) // promise，通过 i+1这种方式指向下一个中间件，和 express 中的 stack.shift()的方式是一个道理。
        );
      } catch(err) {
          return Promise.reject(err);
      }
    }
    return dispatch(0); // 立即执行第一个中间件
  }
}

class  LikeKoa2 {
  constructor() {
    // 中间件列表
    this.middlewareList = []
  }

  use(fn) {
    this.middlewareList.push(fn);
    return this; // 写上这条语句之后可以实现链式调用，比如app.use(f).use(f)
  }

  createContext(req, res) {
    const ctx = {
      req,
      res
    };
    ctx.query = req.query;
    return ctx;
  }

  handleRequest(ctx, fn) {
    return fn(ctx)
  }

  callback() {
    const fn = compose(this.middlewareList); // 获取第一个中间件
    return (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    }
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

module.exports = LikeKoa2;