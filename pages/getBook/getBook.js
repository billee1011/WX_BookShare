//index.js
//获取应用实例
var app = getApp()
import { $wuxPrompt } from '../../components/wux'
const sliderWidth = 96

Page({
    data: {
        returnBack: null
    },

    onLoad: function () {
        var that = this;
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getBook&ownerId=' + app.globalData.userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "noGet") {
                    $wuxPrompt.init('msg1', {
                        title: '空空如也',
                        text: '暂时没有人还书',
                    }).show()
                    that.setData({
                        returnBack: null
                    })
                } else {
                    if (res.data[0] == '' && res.data[1] == '') {
                        $wuxPrompt.init('msg1', {
                            title: '空空如也',
                            text: '暂时没有人还书',
                        }).show()
                    }
                    that.setData({
                        returnBack: res.data
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请检查网络配置！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    onShow: function () {
        this.onLoad();
    },

    //联系书主
    callOwner: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var openId = e.currentTarget.dataset.openid;
        var phoneNum = e.currentTarget.dataset.phonenum;
        wx.makePhoneCall({
            phoneNumber: phoneNum //仅为示例，并非真实的电话号码
        })
    },

    //升级后的扫码功能
    creatBorrowQRcode: function (e) {
        var that = this;
        var sharingId = e.currentTarget.dataset.sharingid;
        wx.navigateTo({
            url: '../qrcode/qrcode?sharingId=' + sharingId+"&type=1"
        })
    },

    //书主确认还书
    ownerAffirmReturn: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var that = this;
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getBookFun&sharingId=' + sharingId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "affirmed") {
                    wx.showToast({
                        title: '您已确认还书，无需重复操作',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: '确认成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '确认失败',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '确认失败',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },
    openMore: function (e) {
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this

        if (canShareId != that.data.currentCanShare) {
            that.setData({
                currentCanShare: canShareId
            })
        } else {
            that.setData({
                currentCanShare: false
            })
        }
    },   

})
