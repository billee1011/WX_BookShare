// pages/pay/pay.js
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
        var that = this
        var sharingId = options.sharingId;
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=New&a=getNoneReturnDetail&sharingId=' + sharingId + "&userId=" + app.globalData.userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                that.setData({
                    orderDetail: res.data[0],
                    ownerId: options.ownerId
                })
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

    //图片加载
    imageLoad: function (e) {
        console.log(e)
        var $width = e.detail.width,    //获取图片真实宽度
            $height = e.detail.height,
            ratio = $width / $height;    //图片的真实宽高比例
        var viewHeight = 500,           //设置图片显示宽度，左右留有16rpx边距
            viewWidth = 500 * ratio;    //计算的高度值
        var marginLeftWidth = (750 * 0.97 - viewWidth) / 2;
        var image = this.data.images;
        //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
        image = {
            width: viewWidth,
            height: viewHeight,
            marginLeftWidth: marginLeftWidth
        }
        this.setData({
            images: image
        })
    },

    //支付
    pay: function () {
        var that = this
        var thatData = that.data.orderDetail
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Pay&a=pay').replace(/\s+/g, ""),
            method: 'POST',
            data: {
                'total_fee': thatData.realMoney ? thatData.realMoney:thatData.money,
                'openid': app.globalData.openId,
                'body': "借阅《" + thatData.book_name + "》" + thatData.days+"天所花费金额"
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                console.log(res.data)
                wx.requestPayment({
                    'appId': app.globalData.appId,
                    'timeStamp': res.data['timeStamp'],
                    'nonceStr': res.data['nonceStr'],
                    'package': res.data["package"],
                    'signType': 'MD5',
                    'paySign': res.data["paySign"],
                    'success': function (res) {
                        var sharingId = that.data.orderDetail.sharingId;
                        wx.request({
                            url: ( app.globalData.apiUrl + '?m=home&c=New&a=hadPayed&sharingId=' + sharingId + "&can_share_id=" + that.data.orderDetail.can_share_id + "&money=" + that.data.orderDetail.money).replace(/\s+/g, ""),
                            method: "GET",
                            header: {
                                'content-type': 'application/json',
                            },
                            success: function (res) {
                                if (res.data == "success") {
                                    wx.showModal({
                                        title: '提示',
                                        content: '支付成功',
                                        confirmText: "知道了",
                                        showCancel: false,
                                        success: function (res) {
                                            if (res.confirm) {
                                                wx.navigateBack({
                                                    delta: 2
                                                })
                                            }
                                        }
                                    })
                                } else {
                                    wx.showModal({
                                        title: '提示',
                                        content: '支付过程出现问题，请联系客服！',
                                        confirmText: "知道了",
                                        showCancel: false,
                                        success: function (res) {
                                            if (res.confirm) {
                                                wx.setClipboardData({
                                                    data: app.globalData.contractPhone,
                                                    success: function (res) {
                                                        wx.showToast({
                                                            title: '已复制号码到粘贴板',
                                                        })
                                                    }
                                                })
                                                wx.makePhoneCall({
                                                    phoneNumber: app.globalData.contractPhone //联系客服
                                                })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    },
                    'fail': function (res) {
                        console.log('fail:' + JSON.stringify(res));
                        if (res.errMsg =="requestPayment:fail cancel"){
                            wx.showModal({
                                title: '提示',
                                content: '您选择了取消支付，请前往“借书人”->“更多”->“待支付”支付',
                                showCancel:false,
                                confirmText:"知道了",
                            })
                        }else{
                            wx.showModal({
                                title: '提示',
                                content: '支付过程中遇到问题，请点击下方联系工作人员！',
                                showCancel: false,
                                confirmText: "知道了",
                            })
                        }
                    }
                })
            },
            fail: function (err) {
                console.log(err)
            }
        })

        // var can_share_id = that.data.orderDetail.can_share_id;
        // var sharingId = that.data.orderDetail.sharingId;
        // wx.request({
        //     url: ( app.globalData.apiUrl + '?m=home&c=New&a=hadPayed&can_share_id=' + can_share_id + "&sharingId=" + sharingId+ "&money=" + that.data.orderDetail.money + "&ownerId=" + that.data.ownerId).replace(/\s+/g, ""),
        //     method: "GET",
        //     header: {
        //         'content-type': 'application/json',
        //     },
        //     success: function (res) {
        //         if (res.data == "success") {
        //             wx.showModal({
        //                 title: '提示',
        //                 content: '支付成功',
        //                 confirmText: "知道了",
        //                 showCancel: false,
        //                 success: function (res) {
        //                     if (res.confirm) {
        //                         wx.navigateBack({
        //                             delta: 2
        //                         })
        //                     }
        //                 }
        //             })
        //         } else {
        //             wx.showModal({
        //                 title: '提示',
        //                 content: '支付过程出现问题，请联系客服！',
        //                 confirmText: "知道了",
        //                 showCancel: false,
        //                 success: function (res) {
        //                     if (res.confirm) {
        //                         wx.setClipboardData({
        //                             data: app.globalData.contractPhone,
        //                             success: function (res) {
        //                                 wx.showToast({
        //                                     title: '已复制号码到粘贴板',
        //                                 })
        //                             }
        //                         })
        //                         wx.makePhoneCall({
        //                             phoneNumber: app.globalData.contractPhone //联系客服
        //                         })
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // })
    },
})