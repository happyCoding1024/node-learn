const getList = (author, keyword) => {
  // 先返回假数据（格式是正确的）
  return [
    {
      id: 1,
      title: '标题A',
      content: '内容A',
      createTime: '1574517954498', // 时间是毫秒的格式
      auThor: 'zhangsan'
    },
    {
      id: 2,
      title: '标题B',
      content: '内容B',
      createTime: '1574517978410', // 时间是毫秒的格式
      auThor: 'lisi'
    }

  ]
};

const getDetail = (id) => {
   return {
     id: 1,
     title: '标题A',
     content: '内容A',
     createTime: '1574517954498', // 时间是毫秒的格式
     auThor: 'zhangsan'
   };
};

const newBlog = (blogData = {}) => {
  // blogData 是一个博客对象，包含title，content属性,应该上传到数据库，然后再返回，这里先不这样做，直接返回。
  return {
    id: 3, // 表示新建博客，插入到数据表里面的 id
  }
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