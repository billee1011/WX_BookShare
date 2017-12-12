import { $wuxPrompt } from '../../components/wux'
const sliderWidth = 70
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookListType: null,
        tabs: ['自己持有', '放在自营点'],
        activeIndex: '0',
        sliderOffset: 0,
        sliderLeft: 65,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        /**获取C2C的图书 type=3**/
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getC2CMyBookMoney&userId=' + app.globalData.userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res.data)
                if (res.data.length > 0){
                    that.setData({
                        c2cBookObj: res.data
                    })
                }else{
                    $wuxPrompt.init('msg1', {
                        title: '空空如也',
                        text: '您还没有上传过图书',
                        buttons: [
                            {
                                text: '自持图书上传'
                            }
                        ],
                        buttonClicked(index, item) {
                            wx.navigateTo({
                                url: '../operateShare/operateShare'
                            })
                        },
                    }).show()
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
        /**获取C2C的图书结束**/

        /**获取上传至自营点图书 */
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getB2CMyBookMoney&userId=' + app.globalData.userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data.length>0){
                    that.setData({
                        b2cBookObj: res.data,
                    })
                }else{
                    $wuxPrompt.init('msg2', {
                        title: '空空如也',
                        text: '您还没有上传至自营点',
                        buttons: [
                            {
                                text: '自营点上传'
                            }
                        ],
                        buttonClicked(index, item) {
                            wx.navigateTo({
                                url: '../uploadPilot/uploadPilot?donateType=0'
                            })
                        },
                    }).show()
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

    //切换tab
    tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
        })
    },

    //进入图书详情
    detail: function (event) {
        var bookId = event.currentTarget.dataset.bookid;
        var canShareId = event.currentTarget.dataset.canshareid;
        var book_type = event.currentTarget.dataset.type;//type 为1时自营点 为0时C2C
        //打开详情页
        //旧页面
        var that = this
        if (that.data.bookListType == 2) {
            wx.navigateTo({
                url: '../detailPay/detailPay?bookId=' + bookId + "&canShareId=" + canShareId + "&book_type=" + book_type,
            })
        } else {
            //新页面
            wx.navigateTo({
                url: '../detailPay/detailPay?bookId=' + bookId + "&canShareId=" + canShareId + "&book_type=" + book_type,
            })
        }


    },

    

    openMore:function(e){
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this 
        
        if (canShareId != that.data.currentCanShare){
            that.setData({
                currentCanShare: canShareId
            })
        }else{
            that.setData({
                currentCanShare: false
            })
        }
    },

    //编辑图书信息
    editKeepTime: function (e) {
        //编辑
        var canShareId = e.currentTarget.dataset.canshareid;
        var bookId = e.currentTarget.dataset.bookid;
        wx.navigateTo({
            url: '../editTime/editTime?canShareId=' + canShareId + "&bookId=" + bookId
        })
    },

    //下线图书
    downLine: function (e) {
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;
        wx.showModal({
            title: '提示',
            content: '您确定要下线吗？下线以后别人就看不到你的图书咯！',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: ( app.globalData.apiUrl + '?m=home&c=Api&a=downLine&canShareId=' + canShareId).replace(/\s+/g, ""),
                        header: {
                            'content-type': 'application/json',
                        },
                        success: function (res) {
                            if (res.data == "downLined") {
                                wx.showToast({
                                    title: '您已下线该图书，无需重复！',
                                    image: '../../images/warning.png',
                                    duration: 2000
                                })
                            } else if (res.data == "success") {
                                wx.showToast({
                                    title: '下线成功！',
                                    icon: 'success',
                                    duration: 2000
                                })
                                that.onLoad();

                            } else if (res.data == "fail") {
                                wx.showToast({
                                    title: '下线失败，请稍后重试！',
                                    image: '../../images/fail.png',
                                    duration: 2000
                                })
                            }
                        }
                    })
                }
            }
        })

    },

    //上线图书
    onLine: function (e) {
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;        
        wx.showModal({
            title: '提示',
            content: '上线成功，等着图书为您赚钱吧！',
            showCancel: false,
            confirmText: '知道啦',
            success: function (res) {
                if (res.confirm) {
                    wx.request({
                        url: ( app.globalData.apiUrl + '?m=home&c=Api&a=onLine&canShareId=' + canShareId).replace(/\s+/g, ""),
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            if (res.data == "onLined") {
                                wx.showToast({
                                    title: '您已上线该图书，无需重复！',
                                    image: '../../images/warning.png',
                                    duration: 2000
                                })
                            } else if (res.data == "success") {
                                wx.showToast({
                                    title: '上线成功！',
                                    icon: 'success',
                                    duration: 2000
                                })
                                that.onLoad();
                            } else if (res.data == "fail") {
                                wx.showToast({
                                    title: '上线失败，请稍后重试！',
                                    image: '../../images/fail.png',
                                    duration: 2000
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    retrieval:function(){
        wx.showModal({
            title: '提示',
            content: '此功能还未开放，敬请期待！',
            showCancel:false,
            confirmText:"我知道了"
        })
    }
})