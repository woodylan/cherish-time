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
    timeList: [],
    isShowMask: false,
    currentMaskColor: "", //遮罩层颜色
    currentMaskItem: {} //当前遮罩层数据
  },

  onLoad: function(options) {
    //获取用户信息
    this.getUserInfo()
  },

  onGotUserInfo: function(e) {
    this.getUserInfo()
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: app.globalData.userInfo,
      hasUserInfo: true
    })
  },

  isLogin: function(data) {
    var auth = wx.getStorageSync('auth')
    if (auth) {
      return true;
    } else {
      return false;
    }
  },

  checkAuth: function() {
    let _this = this
    var data = {
      'auth': wx.getStorageSync('auth')
    }
    app.postRequest(CONFIG.ACTION.USER.CHECK_AUTH, data, function(res) {
      if (res.code != 0) {
        //登录
        _this.login()
      } else {
        _this.getTimeData()
      }
    })
  },

  login: function() {
    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    let _this = this
    wx.login({
      success: LoginRes => {
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.globalData.userInfo = res.userInfo

            var data = {
              'code': LoginRes.code,
              'iv': res.iv,
              'encryptedData': res.encryptedData
            }

            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            app.postRequest(CONFIG.ACTION.USER.LOGIN, data, function(res) {
              wx.removeStorageSync('auth');
              wx.setStorageSync('auth', res.data.auth);
              _this.getTimeData()
            })

            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }
    })
  },

  getUserInfo: function() {
    let _this = this
    // 获取用户信息
    wx.getSetting({
      success: settingRes => {
        console.log(settingRes.authSetting['scope.userInfo'])
        if (settingRes.authSetting['scope.userInfo']) {
          if (_this.isLogin() == false) {
            console.log('登录')
            _this.login()
          } else {
            _this.checkAuth()
          }

          this.setData({
            hasUserInfo: true
          })
        }
      }
    })
  },

  //选择器
  bindPickerChange: function(e) {
    let _type = 1; //默认倒计时
    if (e.detail.value == 1) {
      _type = 2; //累计日
    }
    wx.navigateTo({
      url: '/pages/create/create?type=' + _type
    });
  },

  //显示遮罩层
  showMask: function(event) {
    console.log(event.currentTarget.dataset.item);

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: event.currentTarget.dataset.item.color,
    })

    this.setData({
      currentMaskItem: event.currentTarget.dataset.item,
      currentMaskColor: event.currentTarget.dataset.item.color,
      isShowMask: (!this.data.isShowMask),
      maskStatus: 'show'
    })
  },

  //隐藏遮罩层
  hideMask: function(event) {
    this.setData({
      maskStatus: 'hide',
      isShowMask: false,
    })

    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    })
  },

  //获取列表
  getTimeData: function() {
    if (wx.getStorageSync('auth')) {
      let _this = this;
      app.postRequest(CONFIG.ACTION.TIME.LIST, {}, function(res) {
        _this.setData({
          timeList: res.data.list
        })
      })
    }
  },

})