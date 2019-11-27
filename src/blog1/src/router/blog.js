const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');
const { SuccessModule, ErrorModule } = require('../module/resModule');

// 定义一个统一的登录验证函数，在更新博客，新建博客等操作之前，如果处于未登录的状态则不能进行相应的操作
// loginCheck 主要是拦截没有登录的用户，对于已经登录的用户可以不返回东西
const loginCheck = (req) => {
  // 只有登录了之后，req.session.username 才会有值
  if (!req.session.username) {
    return Promise.resolve(
      new ErrorModule('login fail, please login first')
    )
  }
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

    let author = req.query.author || ''; // 获取到传入的作者名，如果没有传入赋值为空字符串
    const keyword = req.query.keyword || '';

    // 加一个验证，必须登录之后才可以看到博客列表而且只能看到自己的博客列表
    if (req.query.isadmin) {
      // 登录验证
      const loginCheckResult = loginCheck(req);
      if (loginCheckResult) {
        // 未登录
        return loginCheckResult;
      }
      // 已登录
      // 强制只能查自己的博客列表
      // 解释一下为什么下面这一条语句就能做到强制只能查询自己的博客列表，req.session.name是在用户登录时赋值的，登录时用户名是什么，它的值就是什么
      // 客户端是没有办法改的，将这个值直接赋给author，可以保证登录的那个人可以查看自己的但是查不了别人的，因为author始终是自己
      author = req.session.username;
    }

    const result = getList(author, keyword); // getList 返回一个promise对象
    return result.then((listData) => {
      return new SuccessModule(listData);
    }, (err) => {
      console.log(err);
    })
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
    const loginCheckResult = loginCheck(req);
    // 如果 loginCheckResult 有值说明没有登录
    console.log('req.session.username', req.session.username);
    if(loginCheckResult) {
      return loginCheckResult;
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
    const loginCheckResult = loginCheck(req);
    // 如果 loginCheckResult 有值说明没有登录
    if(loginCheckResult) {
      return loginCheckResult;
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
  if(method === 'POST' && req.path === '/api/blog/del') {

    // 如果未登录，则提示首先要登录
    const loginCheckResult = loginCheck(req);
    // 如果 loginCheckResult 有值说明没有登录
    if(loginCheckResult) {
      return loginCheckResult;
    }

    const author = req.session.username;
    // 在删除文章的时候校验一下作者，只有登录的作者本人才可以删除自己的文章
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