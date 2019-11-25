const { exec } = require('../db/mysql');

const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1`;
  if (author) {
    sql += ` and author = '${author}'`;
  }
  if (keyword) {
    sql += `and title like "%${keyword}%"`;
  }
  sql += `order by createtime desc`;

  return exec(sql);
};

const getDetail = (id) => {
  const sql = `select * from blogs where id='${id}'`;
  return exec(sql).then((rows) => {
    return rows[0]; // 因为rows返回的是一个数组，这里需要返回一个对象，rows中的每一项都是一个对象
  });
};

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含title，content, author属性,应该上传到数据库，然后再返回，这里先不这样做，直接返回。
  const title = blogData.title;
  const content = blogData.content;
  const author = blogData.author;
  const createTime = Date.now();

  const sql = `
    insert into blogs (title, content, createtime, author) 
    values ('${title}', '${content}', ${createTime}, '${author}');
    `;
  return exec(sql).then((insertData) => {
    console.log('insertData: ', insertData );
    return {
      id: insertData.insertId
    }
  });
};

const updateBlog = (id, blogData = {}) => {
  // id 就是更新博客的id
  // blogData 是一个博客对象，包含 title, content 属性
  // 在这里仅仅先返回一个状态
  return true;
};

const delBlog = (id) => {
  // id 就是要删除博客的id
  return true;
};

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
};