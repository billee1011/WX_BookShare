// pages/withDraw/withDraw.js
var app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        //获取当前用户的余额
        wx.showLoading({
            title: '余额加载中',
        })
        var that = this
        var url = ('https://' + app.globalData.apiUrl + '?m=home&c=User&a=getIntegral&userId=' + app.globalData.userId).replace(/\s+/g, "");
        wx.request({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (res) {
                if (res.data[0]["result"] == "success") {
                    that.setData({
                        integral: res.data[0]["integral"]
                    })
                    wx.hideLoading()
                } else {
                    wx.showLoading({
                        title: '余额加载失败',
                    })
                }
            }
        })

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    withDrawValue: function (e) {
        var that = this
        that.setData({
            withDrawValue: e.detail.value
        })
    },

    withDraw: function () {

        var that = this

        if (!that.data.withDrawValue || that.data.withDrawValue == 0 || that.data.withDrawValue==null){
            wx.showModal({
                title: '提示',
                content: '您还没有输入金额！',
                showCancel: false,
                confirmText: "知道了",
            })
            return;
        }

        //金额限制
        if (that.data.withDrawValue > that.data.integral) {
            wx.showModal({
                title: '提示',
                content: '您提现金额超出了余额！',
                showCancel: false,
                confirmText: "知道了",
            })
            return ;
        }

        var that = this
        var url = ('https://' + app.globalData.apiUrl + '?m=home&c=Pay&a=withDraw').replace(/\s+/g, "");
        wx.request({
            url: url,
            method: "POST",
            header:{    
                'content-type': 'application/x-www-form-urlencoded'
            },
            data:{
                'user_id': app.globalData.userId,
                'money': that.data.withDrawValue
            },
            dataType: "json",
            success: function (res) {
                if (res.data == "success") {
                    wx.showModal({
                        title: '提示',
                        content: '您已提交提现申请，审核通过后24小时内会将钱提现至“微信”零钱中',
                        showCancel: false,
                        confirmText: "好的",
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 1
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '您提交提现申请失败，请稍后再试！',
                        showCancel: false,
                        confirmText: "好的",
                    })
                }
            }
        })
    }
})