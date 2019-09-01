// components/countdown/countdown.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    timeId: String,
    days: String,
    date: String,
    originDate: String,
    timeType: Number,
    timeName: String,
    remark: String,
    color: Array,
    sentence: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //删除
    _del: function(e) {
      //调用父级的事件
      this.triggerEvent('delete', {
        timeId: this.data.timeId
      })
    },

    _edit() {
      this.triggerEvent('edit', {
        id: this.data.timeId,
        date: this.data.date,
        originDate: this.data.originDate,
        type: this.data.timeType,
        name: this.data.timeName,
        remark: this.data.remark,
        color: this.data.color,
      })
    }
  }
})