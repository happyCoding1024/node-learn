const http = require('http');
const slice = Array.prototype.slice;

class LikeExpress {
  constructor() {
    // 存放中间件的列表
    this.routes = {
      all: [],
      get: [],
      post: []
    }
  }

  // 分离出路径和中间件，info.path中存放路径，info.stack 中存放中间件
  register(path) {
    const info = {};
    if (typeof path === 'string') {
      info.path = path;
      // info.stack 存放所有的中间件
      // 如果第一个参数是路由在取中间件时就要从数组的第2个位置开始取
      // slice.call(arguments, 1) 的作用就是取arguments从第二个位置开始之后的所有元素都取出来并变成数组的形式。
      info.stack = slice.call(arguments, 1);
    } else {
      // 如果第一个参数不是一个路由，那么我们就假定第一个参数是一个根路由
      info.path === '/';
      info.stack = slice.call(arguments, 0);
    }
    return info;
  }

  use() {
    // 实际使用时，参数是通过use传递进来的
    // 将所有的参数传入到register函数中
    const info = this.register.apply(this, arguments);
    // info 是一个对象，info.path 中存放的是路径，info.stack 中存放的是中间件
    this.routes.all.push(info);

  }

  get() {
    const info = this.register.apply(this, arguments);
    this.routes.get.push(info);

  }

  post() {
    const info = this.register.apply(this, arguments);
    this.routes.post.push(info);
  }

  match(method, url) {
    let stack = [];
    if (url === '/favicon.ico') {
      return stack;
    }
    // 获取routes
    let curRoutes = [];
    curRoutes = curRoutes.concat(this.routes.all);
    curRoutes = curRoutes.concat(this.routes[method]);

    curRoutes.forEach(routeInfo => {
      // url='/api/get-cookie' routeInfo.path='/'
      // url='/api/get-cookie' routeInfo.path='/api'
      // url='api/get-cookie' routeInfo.path='/api/get-cookie'
      if (url.indexOf(routeInfo.path) === 0) {
        stack = stack.concat(routeInfo.stack);
      }
    });
    return stack;
  }

  callback() {
    return (req, res) => {
      res.json = (data) => {
        res.setHeaderValue('Content-type', 'application/json');
        res.end(
          JSON.stringify(data)
        );
      };
      const url = req.url;
      const method = req.method.toLowerCase();
      // 找到需要执行的中间件
      const resultList = this.match(method, url);
    }
  }

  // express 中listen的作用不仅仅是监听端口，还要创建服务器服务器
  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }
}

// 工厂函数
module.exports = () => {
  return new LikeExpress()
};
