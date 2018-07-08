// components/slide-delete/slide-delete.js
const winW = wx.getSystemInfoSync().screenWidth; // 屏幕宽度
const ratio = 750 / winW //px && rpx 单位转换 (乘于 这个属性是 px 转换成 rpx)

Component({
    // 组件外的样式
    externalClasses: ['del-class','like-class'],

    // 组件的属性列表
    properties: {
        // 是否显示喜欢按钮
        like: {           // 属性名
            type: Boolean,  // 类型（必填）,String, Number, Boolean, Object, Array, null（表示任意类型）
            value: false  // 属性初始值（可选），如果未指定则会根据类型选择一个
        }
    },

    // 组件的初始数据
    data: {
        offset: 0, // 内容区域滑动的位移
        start: 0,  // 手指触屏的开始位置
        move: 0,   // 手指移动的位置
        btnWidth: 140,  // 按钮的宽度 
        lock: false,   // 限制模块右滑
        now: 0         //为标记滑动位置设置的变量
    },

    // 组件的方法列表
    methods: {
        // 手指开始滑动
        handstart (e) {
            var that = this;
            that.data.start = e.changedTouches[0].clientX
        },
        // 手指滑动过程
        handmove (e) {
            var that = this;
            var offset = that.data.offset
            var start = that.data.start
            var width = that.data.btnWidth
            var lock = that.data.lock
            var move = that.data.move = e.changedTouches[0].clientX
            if (move - start < 0 || lock){
                if (move - start < 0){
                    that.data.now++
                }else{
                    that.data.now=0
                }
                that.setData({
                    start: start,
                    move: move,
                    offset: that.data.now == 0 ? (move - start) * ratio : (move - start) * ratio - width
                })
            }
            // console.log(that.data.offset)
        },
        // 手指结束滑动，然后抬起
        handend (e) {
            var that = this;
            var width = that.data.btnWidth
            // console.log(that.data.offset)
            if (that.data.offset < 0) {
                if (that.properties.like){
                    width = 280
                }
                that.setData({
                    btnWidth: width,
                    offset: -width
                })
                that.data.lock = true
            } else {
                that.setData({
                    offset: 0
                })
                that.data.lock = false
                that.data.now = 0
            }
        },

        // 删除
        _del () {
            this.triggerEvent('delete') //触发删除回调
            this.setData({              //为了让模块内容部分滑动到原点
                offset: 0
            })
        },

        // 喜欢
        _like () {
            this.triggerEvent('like') //触发删除回调
            this.setData({              //为了让模块内容部分滑动到原点
                offset: 0
            })
        },
    }
})
