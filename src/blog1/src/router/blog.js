const { getList, getDetail } = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../module/resModule');

const handleBlogRouter = (req, res) => {
  const method = req.method; // GET or POST
  // 这个地方的path和url的计算和user中的有重复，为了代码优化可以在app.js中，这样写
  // const req.path = url.split('?')[0];
  // const url = req.url;
  // const path = url.split('?')[0];

  // 获取博客列表
  if(method === 'GET' && req.path === '/api/blog/list') {
    const author = req.query.author || ''; // 获取到传入的作者名，如果没有传入赋值为空字符串
    const keyword = req.query.keyword || '';
    const listData = getList(author, keyword); // 获取传入的author和keyword相匹配的博客列表
    return new SuccessModel(listData);
  }

  // 获取博客详情
  if(method === 'GET' && req.path === '/api/blog/detail') {
    const id = req.query.id;
    const data = getDetail(id);
    return new SuccessModel(data);
  }

  // 新建一篇博客
  if(method === 'POST' && req.path === '/api/blog/new') {
    return {
      msg: '这是新建博客的接口'
    }
  }

  // 更新一篇博客
  if(method === 'POST' && req.path === '/api/blog/update') {
    return {
      msg: '这是更新博客的接口'
    }
  }

  // 删除一篇博客
  if(method === 'POST' && req.path === '/api/blog/delete') {
    return {
      msg: '这是删除博客的接口'
    }
  }
};

module.exports = handleBlogRouter;