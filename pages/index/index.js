//index.js
//获取应用实例
const app = getApp()
var CONFIG = require("../../config");

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
      color: ['#fc9e9a', '#fed89c'],
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

    offset: 0, // 内容区域滑动的位移
    start: 0, // 手指触屏的开始位置
    move: 0, // 手指移动的位置
    btnWidth: 280, // 按钮的宽度 
    lock: false, // 限制模块右滑
    now: 0, //为标记滑动位置设置的变量
    slideList: [], //编辑每个卡片的偏移量
  },

  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    });
    //获取用户信息
    this.getUserInfo()
    wx.hideLoading();
  },

  onGotUserInfo: function(e) {
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
      },
      fail: res => {
        this.setData({
          isShowAuthorization: true
        })
      }
    })
  },

  //选择器
  bindPickerChange: function(event) {
    let _type = event.currentTarget.dataset.type; //默认倒计时
    console.log(_type)
    wx.navigateTo({
      url: '/pages/create/create?type=' + _type
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

  //获取列表
  getTimeData: function(currentPage = 1, isRefresh = false) {
    let _this = this;

    var inputData = {
      "currentPage": currentPage,
    }
    app.postRequest(CONFIG.ACTION.TIME.LIST, inputData, function(res) {
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

      _this.initdata(timeList)
    })
  },

  //删除
  _del: function(e) {
    var _this = this;
    var id = e.currentTarget.dataset.id

    _this.data.timeList.forEach((val, index, arr) => {
      if (id == val.id) {
        arr.splice(index, 1)
      }
    });

    _this.setData({
      timeList: _this.data.timeList
    })

    this.initdata(_this.data.timeList)
    this._showNotData(_this.data.timeList)

    var data = {
      'id': id,
    }
    app.postRequest(CONFIG.ACTION.TIME.DELETE, data, function(res) {
      console.log(res)
    })
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
    console.log(this.data.currentPage);
    if (this.data.currentPage < this.data.lastPage) {
      this.getTimeData(this.data.currentPage + 1, true)
    }
  },

  //修改偏移量数组
  initdata: function(timeList) {
    var slideList = []
    for (var i = 0; i < timeList.length; i++) {
      slideList[i] = 0
    }
    this.setData({
      slideList: slideList
    })
  },

  //修改指定元素的偏移量
  fitSlideListData: function(index, offset) {
    var slideList = this.data.slideList
    for (var i = 0; i < slideList.length; i++) {
      if (i == index) {
        slideList[i] = offset
      } else {
        slideList[i] = 0
      }
    }

    this.setData({
      slideList: slideList
    })
  },

  // 手指开始滑动
  handstart(e) {
    var that = this;
    that.data.start = e.changedTouches[0].clientX
  },
  // 手指滑动过程
  handmove(e) {
    var that = this;
    var index = e.target.dataset.index
    var offset = that.data.slideList[index]
    var start = that.data.start
    var width = that.data.btnWidth
    var lock = that.data.lock
    var move = that.data.move = e.changedTouches[0].clientX
    if (move - start < 0 || lock) {
      if (move - start < 0) {
        that.data.now++
      } else {
        that.data.now = 0
      }

      var offset = that.data.now == 0 ? (move - start) * ratio : (move - start) * ratio - width;
      that.fitSlideListData(index, offset)
      that.setData({
        start: start,
        move: move,
      })
    }
  },

  // 手指结束滑动，然后抬起
  handend(e) {
    var that = this;
    var width = that.data.btnWidth
    var index = e.target.dataset.index
    var offset = that.data.slideList[index]
    if (offset < 0) {
      if (that.properties.like) {
        width = 280
      }

      that.fitSlideListData(index, -width)
      that.setData({
        btnWidth: width,
      })
      that.data.lock = true
    } else {
      that.fitSlideListData(index, 0)
      that.data.lock = false
      that.data.now = 0
    }
  },

  showPopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.show();
  },
  hidePopup() {
    let popupComponent = this.selectComponent('.J_Popup');
    popupComponent && popupComponent.hide();
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


})