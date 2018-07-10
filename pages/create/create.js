// pages/create/create.js
const app = getApp()
var CONFIG = require("../../config");
Page({
  data: {
    timeType: 2,
    colorList: [
      ['#fc9e9a', '#fed89c'],
      ['#eda1c1', '#fab2ac'],
      ['#eaa3fc', '#faa9e0'],
      ['#9ce0fb', '#9efcee'],
      ['#64b3f4', '#c2e59c'],
      ['#acfba9', '#cffba1'],
      ['#abecd6', '#fbed96'],
      ['#99e1e5', '#b8dff0'],
      ['#fc6076', '#ff9a44'],
      ['#90aeff', '#92e6e6'],
      ['#dad4ec', '#f3e7e9'],
    ],
    radioSelect: ['#fc9e9a', '#fed89c'],
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

  dataToInt: function(val) {
    return val.replace(/-/g, '');
  },

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var inputData = e.detail.value
    var data = {
      'name': inputData.name,
      'type': this.data.timeType,
      'date': this.dataToInt(inputData.date),
      'color': this.data.radioSelect
    }
    let _this = this;
    app.postRequest(CONFIG.ACTION.TIME.CREATE, data, function(res) {
      console.log(res)
      wx.navigateBack({
        delta: 1
      })
    })
  },
})