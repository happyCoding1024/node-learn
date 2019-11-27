const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');
const { SuccessModule, ErrorModule } = require('../module/resModule');

// 定义一个统一的登录验证函数，在更新博客，新建博客等操作之前，如果处于未登录的状态则不能进行相应的操作
let loginStatus = false;
const loginCheck = (req) => {
  // 只有登录了之后，req.session.username 才会有值
  console.log('req.session.username = ', req.session.username);
  if (req.session.username) {
    loginStatus = true;
  }
  return loginStatus;
};

const handleBlogRouter = (req, res) => {
  const method = req.method; // GET or POST
  const id = req.query.id;
  const blogData = req.body;
  // 这个地方的path和url的计算和user中的有重复，为了代码优化可以在app.js中，这样写
  // const req.path = url.split('?')[0];
  // const url = req.url;
  // const path = url.split('?')[0];

  // 获取博客列表
  if(method === 'GET' && req.path === '/api/blog/list') {

    const author = req.query.author || ''; // 获取到传入的作者名，如果没有传入赋值为空字符串
    const keyword = req.query.keyword || '';
    const result = getList(author, keyword); // getList 返回一个promise对象

    return result.then((listData) => {
      return new SuccessModule(listData);
    }, (err) => {
      console.log(err);
    } )
  }

  // 获取博客详情
  if(method === 'GET' && req.path === '/api/blog/detail') {
    const result = getDetail(id);
    return result.then(data => {
      return new SuccessModule(data);
    });
  }

  // 新建一篇博客
  if(method === 'POST' && req.path === '/api/blog/new') {
    // 如果未登录，则提示首先要登录
    if(loginCheck(req) === false) {
      console.log('please login first');
      return ;
    }

    // 先用假数据，因为req.body 里面现在没有author
    const author = req.session.username; // 假数据，在开发登录时再改成真实数据
    req.body.author = author;
    const result = newBlog(blogData);
    return result.then((data) => {
      return new SuccessModule(data);
    });
  }

  // 更新一篇博客
  if(method === 'POST' && req.path === '/api/blog/update') {
    // 如果未登录，则提示首先要登录
    if(loginCheck(req) === false) {
      console.log('please login first');
      return;
    }
    const result = updateBlog(id, blogData);
    return result.then((val) => {
      if (val) {
        return new SuccessModule();
      } else {
        return new ErrorModule('update fail')
      }
    });
  }

  // 删除一篇博客
  // 如果未登录，则提示首先要登录
  if(loginCheck(req) === false) {
    console.log('please login first');
    return;
  }
  if(method === 'POST' && req.path === '/api/blog/delete') {
    const author = req.session.username;
    // 在删除文章的时候加上作者防止找到别人的进行删除
    const result = delBlog(id, author);
    return result.then((val) => {
       if (val) {
         return new SuccessModule();
       } else {
         return new ErrorModule('delete fail');
       }
   });
  }
};

module.exports = {
  handleBlogRouter
};