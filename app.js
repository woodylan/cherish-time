//app.js
var CONFIG = require("./config");
App({
  globalData: {
    userInfo: null,
    auth: ''
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
            var data = { 'code': _code, 'iv': userInfoRes.iv, 'encryptedData': userInfoRes.encryptedData }
            _this.postRequest(CONFIG.ACTION.USER.LOGIN, data, function (res) {
              wx.removeStorageSync('auth');
              wx.setStorageSync('auth', res.data.auth);
            })
          }
        })
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