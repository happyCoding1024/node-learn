var express = require('express');
var router = express.Router();
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');
const { SuccessModule, ErrorModule } = require('../module/resModule');

router.get('/list', function(req, res, next) {
  let author = req.query.author || ''; // 获取到传入的作者名，如果没有传入赋值为空字符串
  const keyword = req.query.keyword || '';
  // 加一个验证，必须登录之后才可以看到博客列表而且只能看到自己的博客列表
  // if (req.query.isadmin) {
  //   // 登录验证
  //   const loginCheckResult = loginCheck(req);
  //   if (loginCheckResult) {
  //     // 未登录
  //     return loginCheckResult;
  //   }
  //   // 已登录
  //   // 强制只能查自己的博客列表
  //   // 解释一下为什么下面这一条语句就能做到强制只能查询自己的博客列表，req.session.name是在用户登录时赋值的，登录时用户名是什么，它的值就是什么
  //   // 客户端是没有办法改的，将这个值直接赋给author，可以保证登录的那个人可以查看自己的但是查不了别人的，因为author始终是自己
  //   author = req.session.username;
  // }
  const result = getList(author, keyword); // getList 返回一个promise对象
  return result.then((listData) => {
    res.json(
      new SuccessModule(listData)
    )
  })
});

router.get('/detail', function(req, res, next) {
  res.json({
    errno: 0,
    data: 'ok'
  });
});

module.exports = router;