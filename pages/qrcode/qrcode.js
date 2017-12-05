//qrcode.js
//获取应用实例
var app = getApp()
Page({
    data: {
        picUrl:null
    },

    onLoad: function (options) {
        var qrtype = options.type;
        wx.showLoading({
            title: '加载中',
        })
        var sharingId = options.sharingId + "@" + app.globalData.userId;//添加 userId 防止漏洞
        var that = this;
        that.setData({
            qrtype: qrtype
        })
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=createQRcode&sharingId=' + sharingId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    picUrl: "https://"+app.globalData.apiUrl+res.data
                })
                
            },
            fail: function () {
                wx.showToast({
                    title: '生成二维码失败，请重试',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })

        //定时器获取订单状态 
        var timename = setInterval(function(){
            wx.request({
                url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getScreenState&sharingId=' + options.sharingId).replace(/\s+/g, ""),
                success: function (res) {
                    if (qrtype == 1){
                        if(res.data[0]["if_return"]==1){
                            wx.showModal({
                                title: '提示',
                                content: '收书成功！对方支付即可得到收益了呦！',
                                showCancel:false,
                                confirmText:"知道了",
                                success:function(res){
                                    if(res.confirm){
                                        wx.navigateBack({
                                            delta:1
                                        })
                                        
                                    }
                                }
                            })
                            clearInterval(timename);
                            return;
                        }
                    } else if (qrtype == 0){
                        if (res.data[0]["if_loan"] == 1) {
                            wx.showModal({
                                title: '提示',
                                content: '借书成功，您现在可以看书了，不过要记得还书噢！',
                                showCancel: false,
                                confirmText: "知道了",
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.navigateBack({
                                            delta: 1
                                        })
                                        
                                    }
                                }
                            })
                            clearInterval(timename)
                            return;
                        }
                    }
                }
            })
        }, 2000);
    },

    onReady:function(){
        wx.hideLoading()
    },
    onShow:function(){
        
    },

    openCommentBorrower:function(){
        var that = this 
        wx.navigateTo({
            url: '../commentBorrower/commentBorrower?bookId=25',
        })
    }
})
