const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = async (author, keyword) => {
  let sql = `select * from blogs where 1=1`;
  if (author) {
    sql += ` and author = '${author}'`;
  }
  if (keyword) {
    sql += `and title like "%${keyword}%"`;
  }
  // 注意在 服务端程序中使用 数据库中的变量时一定要写在 '${}'中间，
  // 如果不是字符串那么引号可以不用写
  // 这个地方暂时不能使用 createtime 因为并没有往里面传数据
  // sql += `order by createytime desc`;
  //   sql += `order by '${createtime}' desc`;

  return await exec(sql);
};

const getDetail = async (id) => {
  const sql = `select * from blogs where id='${id}'`;
  const rows = await exec(sql)
  return rows[0]
  // return await exec(sql).then((rows) => {
  //   return rows[0]; // 因为rows返回的是一个数组，这里需要返回一个对象，rows中的每一项都是一个对象
  // });
};

const newBlog = async (blogData = {}) => {
  // blogData 是一个博客对象，包含title，content, author属性,应该上传到数据库，然后再返回，这里先不这样做，直接返回。
  const title = xss(blogData.title);
  console.log('xss title is ', title);
  const content = blogData.content;
  const author = blogData.author;
  const createTime = Date.now();

  const sql = `
    insert into blogs (title, content, createtime, author) 
    values ('${title}', '${content}', ${createTime}, '${author}');
    `;

  const insertData = await exec(sql)
  return insertData.insertId
  // return exec(sql).then((insertData) => {
  //   console.log('insertData: ', insertData );
  //   return {
  //     id: insertData.insertId
  //   }
  // });
};

const updateBlog = async (id, blogData = {}) => {
  // id 就是更新博客的id
  // blogData 是一个博客对象，包含 title, content 属性
  // 在这里仅仅先返回一个状态
  const title = blogData.title;
  const content = blogData.content;

  const sql = `
    update blogs set title='${title}',content='${content}'
    where  id=${id};
  `;

  const updateData = await exec(sql)
  if (updateData.affectedRows > 0) {
    return true;
  }
  return false;
  // return exec(sql).then((updateData) => {
  //   if (updateData.affectedRows > 0) {
  //     return true;
  //   }
  //   return false;
  // });
};

const delBlog = async (id, author) => {
  // id 就是要删除博客的id
  // 这个地方加上author 的作用在于防止恶意删除别人的文章，如果只有一个id
  // 那么就可以通过将url修改成别人博客地址的方式来删除别人的文章，加了author之后，
  // 完成登录功能之后author只能是自己的用户名。
  const sql = `
   delete from blogs where id ='${id}' and author = '${author}';
  `;

  const deleteData = await exec(sql)
  if (deleteData.affectedRows > 0) {
    return true;
  }
  return false;

  // return exec(sql).then((deleteData) => {
  //   if (deleteData.affectedRows > 0) {
  //     return true;
  //   }
  //   return false;
  // });






};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};