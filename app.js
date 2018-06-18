//app.js
var CONFIG = require("./config");
App({
  globalData: {
    userInfo: null,
    auth: '',
    loginData: '',
  },

  onLaunch: function () {
    // 登录
    wx.login({
      success: loginRes => {
        let _this = this;
        console.log(loginRes)
        let _code = loginRes.code
        wx.getUserInfo({
          success: function (userInfoRes) {
            _this.globalData.loginData = { 'code': _code, 'iv': userInfoRes.iv, 'encryptedData': userInfoRes.encryptedData }
            // var data = { 'code': _code, 'iv': userInfoRes.iv, 'encryptedData': userInfoRes.encryptedData }
            _this.isLogin()
          }
        })
      }
    })
  },

  isLogin: function (data) {
    console.log(wx.getStorageSync('auth'))
    if (wx.getStorageSync('auth')) {
      this.checkAuth();
    } else {
      this.login()
    }
  },

  login: function () {
    //登录
    var data = this.globalData.loginData
    console.log(data)
    this.postRequest(CONFIG.ACTION.USER.LOGIN, data, function (res) {
      wx.removeStorageSync('auth');
      wx.setStorageSync('auth', res.data.auth);
    })
  },

  checkAuth: function () {
    var data = {
      'auth': wx.getStorageSync('auth')
    }
    let _this = this
    this.postRequest(CONFIG.ACTION.USER.CHECK_AUTH, data, function (res) {
      if (res.code != 0) {
        //登录
        _this.login()
      }
    })
  },

  postRequest: function (action, inputData, callback) {
    let _this = this;
    wx.request({
      url: CONFIG.API_URL + action,
      data: { "data": JSON.stringify(inputData) },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Auth: wx.getStorageSync('auth') || ''
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function (res) {
        callback(res.data);
        console.log(res)
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
})