const router = require('koa-router')()
const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog } = require('../controller/blog');
const { SuccessModule, ErrorModule } = require('../module/resModule');
const  loginCheck = require('../middleware/loginCheck');

router.prefix('/api/blog')

// 获取博客列表
router.get('/list',  async function (ctx, next) {
  let author = ctx.query.author || ''; // 获取到传入的作者名，如果没有传入赋值为空字符串
  const keyword = ctx.query.keyword || '';
  // 加一个验证，必须登录之后才可以看到博客列表而且只能看到自己的博客列表
  if (ctx.query.isadmin) {
    // 进入管理员界面，登录验证
    if (ctx.session.username == null) {
      // 未登录
      ctx.body = new ErrorModule('未登录')
      return;
    }
    // 已登录
    // 强制只能查自己的博客列表
    // 解释一下为什么下面这一条语句就能做到强制只能查询自己的博客列表，req.session.name是在用户登录时赋值的，登录时用户名是什么，它的值就是什么
    // 客户端是没有办法改的，将这个值直接赋给author，可以保证登录的那个人可以查看自己的但是查不了别人的，因为author始终是自己
    author = ctx.session.username;
  }

  const listData = await getList(author, keyword)
  ctx.body = new SuccessModule(listData)

  // const result = getList(author, keyword); // getList 返回一个promise对象
  // return result.then((listData) => {
  //   res.json(
  //     new SuccessModule(listData)
  //   )
  // })
})

// 获取详情
router.get('/detail',  async function (ctx, next) {

  const data = await getDetail(ctx.query.id)
  ctx.body = new SuccessModule(data)

  // const result = getDetail(ctx.query.id);
  // return result.then(data => {
  //   res.json(
  //     new SuccessModule(data)
  //   )
  // });
})

// 新建博客
router.post('/new', loginCheck, async function (ctx, next) {
  const author = ctx.session.username;
  ctx.request.body.author = author;
  const data = await newBlog(ctx.request.body)
  ctx.body = new SuccessModule(data)
  // const result = newBlog(req.body);
  // return result.then((data) => {
  //   res.json(
  //     new SuccessModule(data)
  //   );
  // });
})

// 更新博客
router.post('/update', loginCheck, async function (ctx, next) {

  const val = await updateBlog(ctx.query.id, ctx.request.body)
  if (val) {
    ctx.body = new SuccessModule()
  } else {
    ctx.body = new ErrorModule('update fail')
  }

  // const result = updateBlog(req.query.id, req.body);
  // return result.then((val) => {
  //   if (val) {
  //     res.json(
  //       new SuccessModule()
  //     )
  //   } else {
  //     res.json(
  //       new ErrorModule('update fail')
  //     )
  //   }
  // });
})

// 删除博客
router.post('/del',loginCheck, async function (ctx, next) {
  const author = ctx.session.username;
  // 在删除文章的时候校验一下作者，只有登录的作者本人才可以删除自己的文章
  const val = await delBlog(ctx.query.id, author)
  if (val) {
    ctx.body = new SuccessModule()
  } else {
    ctx.body = new ErrorModule('update fail')
  }
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})

module.exports = router
