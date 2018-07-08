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
    currentMaskColor: "#FF6666", //遮罩层颜色
    currentMaskItem: {
      color: "#FF6666",
      createTime: 1530803261,
      date: 20181001,
      days: 87,
      name: "国庆",
      remark: "旅游去咯",
      type: 1
    }, //当前遮罩层数据
    dataCount: 0, //列表数据数量
    isEnd: false, //是否到底
    currentPage: 1, //当前页码
    lastPage: 1, //总共有多少页
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
        _this.getTimeData(1)
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
              _this.getTimeData(1)
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
  getTimeData: function(currentPage) {
    if (wx.getStorageSync('auth')) {
      let _this = this;
      var inputData = {
        "currentPage": currentPage,
      }
      app.postRequest(CONFIG.ACTION.TIME.LIST, inputData, function(res) {
        _this.setData({
          timeList: _this.data.timeList.concat(res.data.list),
          dataCount: res.data.count,
          currentPage: res.data.currentPage,
          lastPage: res.data.lastPage,
        })
      })
    }
  },

  //删除
  _del: function(e) {
    var _this = this;
    var id = e.currentTarget.dataset.id
    console.log(id)

    _this.data.timeList.forEach((val, index, arr) => {
      if (id == val.id) {
        arr.splice(index, 1)
      }
    });

    _this.setData({
      timeList: _this.data.timeList
    })

    var data = {
      'id': id,
    }
    app.postRequest(CONFIG.ACTION.TIME.DELETE, data, function(res) {
      console.log(res)
    })
  },

  //下拉刷新
  onPullDownRefresh: function() {
    console.log('下拉刷新');
    this.getTimeData(1),
      wx.stopPullDownRefresh()
  },

  //上拉加载
  onReachBottom() {
    console.log('上拉加载');
    console.log(this.data.currentPage);
    if (!this.loading && this.data.currentPage < this.data.lastPage) {
      this.getTimeData(this.data.currentPage + 1)
    }
  },
})