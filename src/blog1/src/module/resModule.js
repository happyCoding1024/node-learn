class BaseMoule {
  constructor(data, message) {
    // 传入的data应该是一个对象，message应该是一个字符串
    // 下面个if的作用是为了当只传入一个字符串时程序也能正常运行
    if (typeof data === 'string') {
      this.message = data;
      data = null;
      message = null;
    }
     if (data) {
       this.data = data;
     }
     if (message) {
       this.message = message;
     }
  }
}

class SuccessModel extends BaseMoule {
  constructor(data, success) {
    super(data, success);
    this.errno = 0;
  }
}

class ErrorModule extends BaseMoule {
  constructor(data, message) {
    super(data, message);
    this.errno = -1;
  }
}

module.exports = {
  SuccessModel,
  ErrorModule
};