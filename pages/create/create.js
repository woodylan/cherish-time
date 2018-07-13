// pages/create/create.js
const app = getApp()
var CONFIG = require("../../config");
Page({
  data: {
    timeType: 2,
    colorList: [
      ['#fc9e9a', '#fed89c'],
      ['#eda1c1', '#fab2ac'],
      ['#90aeff', '#92e6e6'],
      ['#dad4ec', '#f3e7e9'],
      ['#ff9a9e', '#fad0c4'],
      ['#a1c4fd', '#c2e9fb'],
      ['#a3bded', '#6991c7'],
      ['#d9afd9', '#97d9e1'],
      ['#f794a4', '#fdd6bd'],
      ['#86A8E7', '#91EAE4'],
      ['#ee9ca7', '#ffdde1'],
      ['#acb6e5', '#86fde8'],
      ['#77A1D3', '#79CBCA'],
      ['#02AAB0', '#00CDAC'],
      ['#CC95C0', '#DBD4B4'],
      ['#757F9A', '#D7DDE8'],
      ['#EC6F66', '#F3A183'],
    ],
    radioSelect: ['#fc9e9a', '#fed89c'],
    inputName: '',
    inputRemark: '',
    isButtonDisabled: false, //是否隐藏提交按钮
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
    //隐藏提交按钮
    this.setData({
      isButtonDisabled: true
    })
    var inputData = e.detail.value
    var data = {
      'name': inputData.name,
      'type': this.data.timeType,
      'date': this.dataToInt(inputData.date),
      'color': this.data.radioSelect,
      'remark': this.data.inputRemark
    }
    let _this = this;
    app.postRequest(CONFIG.ACTION.TIME.CREATE, data, function(res) {
      wx.navigateBack({
        delta: 1
      })
    })
  },
})