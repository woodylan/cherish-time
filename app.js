//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

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
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })
  },
  globalData: {
    userInfo: null
  },

  postRequest: function (inputData){
    wx.request({
      url: 'https://test-time.wugenglong.com/api/weapp/v1/user/login',
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