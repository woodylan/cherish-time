// pages/create/create.js
const app = getApp()
var CONFIG = require("../../config");
Page({
  data: {
    timeType: 2,
    radioItems: ['#e84e40', '#548fe9', '#996699', '#993399', '#CCCCCC', '#99CC66', '#FF6666', '#FFCC00', '#CCCC33', '#996633', '#669933'],
    radioSelect: '#e84e40',
    inputName: '',
    inputRemark: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    this.setData({
      timeType: option.type,
    });
  },

  selectRadio: function(e) {
    this.setData({
      radioSelect: e.currentTarget.dataset.text
    })
  },

  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },

  //输入名称事件
  onInputName(e) {
    this.setData({
      inputName: e.detail.value
    });
  },

  //输入备注事件
  onInputRemark(e) {
    this.setData({
      inputRemark: e.detail.value
    });
  },

  dataToInt:function(val){
    return val.replace(/-/g, '');
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var inputData = e.detail.value
    var data = {
      'name': inputData.name,
      'type': inputData.type,
      'date': this.dataToInt(inputData.date),
      'color': inputData.color
    }
    let _this = this;
    app.postRequest(CONFIG.ACTION.TIME.CREATE, data, function(res) {
      console.log(res)
      wx.navigateTo({ url:'/pages/index/index'})
      // _this.setData({
      //   timeList: res.data.list
      // })
    })
  },
})