var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');
const { SuccessModule, ErrorModule } = require('../module/resModule');
const  loginCheck = require('../middleware/loginCheck');

// 获取列表
router.get('/list', (req, res, next) => {
  let author = req.query.author || ''; // 获取到传入的作者名，如果没有传入赋值为空字符串
  const keyword = req.query.keyword || '';
  // 加一个验证，必须登录之后才可以看到博客列表而且只能看到自己的博客列表
  if (req.query.isadmin) {
    // 进入管理员界面，登录验证
    if (req.session.username == null) {
      // 未登录
      res.json(
        new ErrorModule('please login first')
      );
      return;
    }
    // 已登录
    // 强制只能查自己的博客列表
    // 解释一下为什么下面这一条语句就能做到强制只能查询自己的博客列表，req.session.name是在用户登录时赋值的，登录时用户名是什么，它的值就是什么
    // 客户端是没有办法改的，将这个值直接赋给author，可以保证登录的那个人可以查看自己的但是查不了别人的，因为author始终是自己
    author = req.session.username;
  }
  const result = getList(author, keyword); // getList 返回一个promise对象
  return result.then((listData) => {
    res.json(
      new SuccessModule(listData)
    )
  })
});

// 获取详情
router.get('/detail', (req, res, next) => {
  const result = getDetail(req.query.id);
  return result.then(data => {
    res.json(
      new SuccessModule(data)
    )
  });
});

// 新建博客
router.post('/new', loginCheck, (req, res, next) => {
  const author = req.session.username;
  req.body.author = author;
  const result = newBlog(req.body);
  return result.then((data) => {
    res.json(
      new SuccessModule(data)
    );
  });
});

// 更新博客
router.post('/update', loginCheck, (req, res, next) => {
  const result = updateBlog(req.query.id, req.body);
  return result.then((val) => {
    if (val) {
      res.json(
        new SuccessModule()
      )
    } else {
      res.json(
        new ErrorModule('update fail')
      )
    }
  });
});

// 删除博客
router.post('/del', loginCheck, (req, res, next) => {
  const author = req.session.username;
  // 在删除文章的时候校验一下作者，只有登录的作者本人才可以删除自己的文章
  const result = delBlog(req.query.id, author);
  return result.then((val) => {
    if (val) {
      res.json(
        new SuccessModule()
      );
    } else {
      res.json(
        new ErrorModule('delete fail')
      );
    }
  });
});


module.exports = router;