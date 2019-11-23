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

module.exports = {
  getList,
  getDetail
};