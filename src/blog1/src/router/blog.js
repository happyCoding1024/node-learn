const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');
const { SuccessModule, ErrorModule } = require('../module/resModule');

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

    // 先用假数据，因为req.body 里面现在没有author
    const author = 'zhangsan'; // 假数据，在开发登录时再改成真实数据
    req.body.author = author;

    const result = newBlog(blogData);
    return result.then((data) => {
      return new SuccessModule(data);
    });
  }

  // 更新一篇博客
  if(method === 'POST' && req.path === '/api/blog/update') {
    const result = updateBlog(id, blogData);
    if (result) {
      // SuccessModule 中什么信息都没有传
      return new SuccessModule();
    } else {
      return new ErrorModule('update fail')
    }
  }

  // 删除一篇博客
  if(method === 'POST' && req.path === '/api/blog/delete') {
   const result = delBlog(id);
   if (result) {
     return new SuccessModule();
   } else {
     return new ErrorModule('delete fail');
   }
  }
};

module.exports = {
  handleBlogRouter
};