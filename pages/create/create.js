// pages/create/create.js
const app = getApp()
var CONFIG = require("../../config");
Page({
  data: {
    timeType: 2,
    radioItems: ['#e84e40', '#548fe9', '#996699', '#993399', '#CCCCCC', '#99CC66', '#FF6666', '#FFCC00', '#CCCC33', '#996633', '#669933'],
    radioSelect: '#e84e40',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(option) {
    this.setData({
      timeType: option.type,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

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

  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var inputData = e.detail.value
    var data = {
      'name': inputData.name,
      'type': inputData.type,
      'date': inputData.date,
      'color': '#03a9f4'
    }
    var data = e.detail.value
    let _this = this;
    app.postRequest(CONFIG.ACTION.TIME.CREATE, data, function(res) {
      console.log(res)
      _this.setData({
        timeList: res.data.list
      })
    })
  },
})