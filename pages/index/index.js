//index.js
//获取应用实例
const app = getApp()
var CONFIG = require("../../config");

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    array: ['倒数日', '累计日'],
    showView: false,
    timeList: [
      { 'name': '出生' }
    ]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    showView: (options.showView == "true" ? true : false)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    // console.log(this.globalData.auth);
    this.getTimeData();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onChangeShowState: function () {
    var that = this;
    that.setData({
      showView: (!that.data.showView)
    })
  },
  closeFullScreen: function () {
    var that = this;

    that.setData({
      showView: (false)
    })
  },

  //选择器
  bindPickerChange: function (e) {
    let _type = 1; //默认倒计时
    if (e.detail.value == 1) {
      _type = 2; //累计日
    }
    wx.navigateTo({
      url: '/pages/create/create?type=' + _type
    });
  },

  //获取列表
  getTimeData: function () {
    let _this = this;
    app.postRequest(CONFIG.ACTION.TIME.LIST, {}, function (res) {
      _this.setData({
        timeList: res.data.list
      })
    })
  },
})