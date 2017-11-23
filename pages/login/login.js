// //login.js 登录
// //获取应用实例
var app = getApp()
Page({
    data: {
        phoneInfo: app.globalData.phoneInfo,
    },
    onLoad:function(options){
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        var data = new Array();
        var userId = options.userId
        if (!userId || userId ==null){
            userId = app.globalData.userId;
        }
        /**获取C2C的图书 type=3**/
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getC2CMyBookMoney&userId=' + userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                data = res.data;
                if (res.data.length > 0) {
                    that.setData({
                        c2cBookObj: res.data
                    })
                }

            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
        /**获取C2C的图书结束**/

        /**获取上传至自营点图书 */
        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getB2CMyBookMoney&userId=113').replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data.length > 0) {
                    for(var i in res.data){
                        data.push(res.data[i]);
                    }
                    
                }
                that.setData({
                    myLibrary: data
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
        wx.hideLoading()

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
                url: '../detail/detail?bookId=' + bookId + "&canShareId=" + canShareId + "&book_type=" + book_type,
            })
        } else {
            //新页面
            wx.navigateTo({
                url: '../detailPay/detailPay?bookId=' + bookId + "&canShareId=" + canShareId + "&book_type=" + book_type,
            })
        }


    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "快来我的图书馆借书吧!",
            desc: "我的图书馆里有很多好书,快来看看吧!",
            path: '/pages/library/library?userId=' + app.globalData.userId
        }
    }
});
