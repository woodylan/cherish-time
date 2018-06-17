//app.js
App({
  onLaunch: function () {
    //域名
    this.globalData.domain = 'https://test-time.wugenglong.com/'

    // 登录
    wx.login({
      success: loginRes => {
        let _this = this;
        console.log(loginRes)
        let _code = loginRes.code
        wx.getUserInfo({
          success: function (userInfoRes) {
            var data = { 'code': _code, 'iv': userInfoRes.iv, 'encryptedData': userInfoRes.encryptedData}
            _this.postRequest(data)
            console.log(userInfoRes)
          }
        })
      }
    })
  
  },
  globalData: {
    userInfo: null
  },

  postRequest: function (inputData){
    wx.request({
      url: this.globalData.domain+'api/weapp/v1/user/login',
      data: { "data": JSON.stringify(inputData)},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      success: function(res) {
        console.log(res)
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})