//app.js
var CONFIG = require("./config");
App({
  globalData: {
    userInfo: null,
    auth: '',
    loginData: '',
  },

  postRequest: function(action, inputData, callback) {
    let _this = this;
    wx.request({
      url: CONFIG.API_URL + action,
      data: {
        "data": JSON.stringify(inputData)
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Auth: wx.getStorageSync('auth') || ''
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        callback(res.data);
        console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
})