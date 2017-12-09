var app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookListType: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        that.setData({
            bookListType: options.bookListType,
            owenerId: options.userId
        })
        var dataId, typeVal;
        dataId = options.userId ? options.userId : app.globalData.userId
        typeVal = options.typeVal ? options.typeVal : options.bookListType
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getSystemBookList&userId=' + dataId + "&type=" + typeVal).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    bookObj: res.data
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
        }else{
            //新页面
            wx.navigateTo({
                url: '../detail1/detail1?bookId=' + bookId + "&canShareId=" + canShareId + "&book_type=" + book_type,
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
})