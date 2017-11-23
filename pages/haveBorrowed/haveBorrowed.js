import { $wuxPrompt } from '../../components/wux'
const sliderWidth = 70
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: ['进行中', '已完成','已取消/拒绝'],
        activeIndex: '0',
        sliderOffset: 0,
        sliderLeft: 0,
        phoneInfo: app.globalData.phoneInfo,
        bookData:new Array()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.setNavigationBarTitle({ title: "已借图书" })
        var that = this;
        that.getSystemInfo()
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getHaveBorrowed&userId=' + app.globalData.userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                var data = res.data[0];
                for(var i in res.data[1]){
                    data.push(res.data[1][i]);
                }
                that.setData({
                    bookData: data,
                })
                
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.onLoad();
    },

    //获取系统详情
    getSystemInfo() {
        const that = this
        wx.getSystemInfo({
            success(res) {
                that.setData({
                    sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
                })
            }
        })
    },

    //切换tab
    tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
        })
    },

    /*******************C2C JS START***************/
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
            url: '../qrcode/qrcode?sharingId=' + sharingId
        })
    },

    //借书完成
    finishBorrow: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var that = this;
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=finishBorrow&sharingId=' + sharingId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "finished") {
                    wx.showToast({
                        title: '您已确认借书，无需重复操作',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                } else if (res.data == "success") {
                    wx.showToast({
                        title: '确认借书成功',
                        icon: 'success',
                        duration: 2000
                    })
                } else if (res.data == "fail") {
                    wx.showToast({
                        title: '确认借书失败',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '确认借书失败',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },
    /*******************自营点 JS START*********************/
    cancelBorrow: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        wx.navigateTo({
            url: '../cancelReason/cancelReason?sharingId=' + sharingId + "&canShareId=" + canShareId + "&type=0",//type = 0 为借书人自己取消
        })
    },

    pilotBorrowIn: function (e) {
        var sharingId = e.currentTarget.dataset.sharingid;
        var canShareId = e.currentTarget.dataset.canshareid;
        wx.navigateTo({
            url: '../pilotBorrowIn/pilotBorrowIn?sharingId=' + sharingId + "&canShareId=" + canShareId,
        })
    },


    //查看更多
    openMore: function (e) {
        var sharingid = e.currentTarget.dataset.sharingid;
        var that = this

        if (sharingid != that.data.currentSharingId) {
            that.setData({
                currentSharingId: sharingid
            })
        } else {
            that.setData({
                currentSharingId: false
            })
        }
    },
})