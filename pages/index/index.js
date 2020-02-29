//index.js
//获取应用实例
const app = getApp()
var CONFIG = require("../../config");
let interstitialAd = null

const winW = wx.getSystemInfoSync().screenWidth; // 屏幕宽度
const ratio = 750 / winW //px && rpx 单位转换 (乘于 这个属性是 px 转换成 rpx)

Page({
  data: {
    isShowNotData: false, //是否显示没有数据
    userInfo: {},
    isShowAuthorization: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    timeList: [],
    isShowMask: false,
    currentMaskColor: ['#fc9e9a', '#fed89c'], //遮罩层颜色
    currentMaskItem: {
      id: "TIME_ID",
      color: ['#fc9e9a', '#fed89c'],
      createTime: 1530803261,
      date: 20181001,
      days: 87,
      name: "国庆",
      remark: "旅游去咯",
      type: 1,
      sentence: {
        id: '111',
        content: '答案很长，我准备用一生的时间来回答，你准备要听了吗？',
        author: '林徽因',
        book: ''
      }
    }, //当前遮罩层数据
    dataCount: 0, //列表数据数量
    isEnd: false, //是否到底
    currentPage: 1, //当前页码
    lastPage: 1 //总共有多少页
  },

  onLoad: function(options) {
    console.log("初始化广告")
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-02d086c8e85e53f8'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }

    //获取用户信息
    this.getUserInfo()

    console.log("展示广告")
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
  },

  onShow: function() {
    this.getTimeData()

    wx.showShareMenu({
      withShareTicket: true
    })
  },

  onGotUserInfo: function(e) {
    wx.showLoading({
      title: '加载中',
    });
    this.getUserInfo()
    app.globalData.userInfo = e.detail.userInfo

    this.setData({
      userInfo: app.globalData.userInfo,
      isShowAuthorization: false
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
    app.postRequest(CONFIG.ACTION.USER.CHECK_AUTH, data, false, function(res) {
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
            app.postRequest(CONFIG.ACTION.USER.LOGIN, data, false, function(res) {
              wx.removeStorageSync('auth');
              wx.setStorageSync('auth', res.data.auth);
              _this.getTimeData()
            })

            this.setData({
              userInfo: res.userInfo,
              isShowAuthorization: false
            })
          },
          fail: res => {
            this.setData({
              isShowAuthorization: true
            })
          }
        })
      },
      fail: res => {
        this.setData({
          isShowAuthorization: true
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

          _this.setData({
            isShowAuthorization: false
          })
        } else {
          _this.setData({
            isShowAuthorization: true
          })
        }

        wx.hideLoading()
      },
      fail: res => {
        this.setData({
          isShowAuthorization: true
        })

        wx.hideLoading()
      }
    })
  },

  //选择器
  bindPickerChange: function(event) {
    wx.navigateTo({
      url: '/pages/create/create'
    });
  },

  //显示遮罩层
  showMask: function(event) {
    console.log(event.currentTarget.dataset.item);

    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: event.currentTarget.dataset.item.color[0],
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

  //修改默认数据
  changeCurrentMaskItemData: function(data) {
    //todo 下拉刷新列表
    var currentMaskItem = this.data.currentMaskItem

    Object.keys(data).forEach(function(key) {
      if (currentMaskItem.hasOwnProperty(key)) {
        currentMaskItem[key] = data[key]
      }
    });

    this.setData({
      currentMaskItem: currentMaskItem,
      currentMaskColor: currentMaskItem.color
    })
  },

  //获取列表
  getTimeData: function(currentPage = 1, isRefresh = false) {
    let _this = this;

    var inputData = {
      "currentPage": currentPage,
      "perPage": 20
    }
    app.postRequest(CONFIG.ACTION.TIME.LIST, inputData, true, function(res) {
      var timeList = []
      if (isRefresh === true) {
        timeList = _this.data.timeList.concat(res.data.list);
      } else {
        timeList = res.data.list
      }

      _this.setData({
        timeList: timeList,
        dataCount: res.data.count,
        currentPage: res.data.currentPage,
        lastPage: res.data.lastPage,
        isEnd: res.data.currentPage == res.data.lastPage,
      })

      //是否显示空数据流
      _this._showNotData(timeList)
    })
  },

  //删除
  deleteEvent: function(e) {
    var _this = this;
    var id = e.detail.timeId

    wx.showModal({
      title: '确定删除？',
      content: '是否确定删除该时间卡片',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')

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
          app.postRequest(CONFIG.ACTION.TIME.DELETE, data, true, function(res) {
            console.log(res)
          })

          //关闭遮罩层
          _this.hideMask()
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    this._showNotData(_this.data.timeList)
  },

  //编辑事件
  editEvent(e) {
    var urlData = this.param(e.detail);
    wx.navigateTo({
      url: '/pages/create/create?' + urlData
    });
  },

  //下拉刷新
  onPullDownRefresh: function() {
    //显示顶部刷新图标
    wx.showNavigationBarLoading();
    console.log('下拉刷新');
    this.getTimeData();

    //隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },

  //上拉加载
  onReachBottom() {
    console.log('上拉加载');
    if (this.data.currentPage < this.data.lastPage) {
      this.getTimeData(this.data.currentPage + 1, true)
    }
  },

  //控制显示空数据流
  _showNotData: function(timeList) {
    var isShowNotData = false;
    if (timeList.length == 0) {
      isShowNotData = true
    }

    this.setData({
      isShowNotData: isShowNotData
    })
  },

  //对象序列化成url格式
  param: function(json) {
    if (!json) return ''
    return this.cleanArray(Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' +
        encodeURIComponent(json[key])
    })).join('&')
  },

  cleanArray: function(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
      if (actual[i]) {
        newArray.push(actual[i])
      }
    }
    return newArray
  }


})