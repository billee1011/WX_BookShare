// //login.js 登录
// //获取应用实例
var app = getApp()
Page({
    data: {
        phoneInfo: app.globalData.phoneInfo,
        changePic: false,
        libraryPic: app.globalData.advertiseUrl,
        userInfo: app.globalData.userInfo,
    },
    onLoad: function (options) {
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        var data = new Array();
        var userId = options.userId
        if (!userId || userId == null) {
            userId = app.globalData.userId;
        }
        /**获取C2C的图书 type=3**/
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getC2CMyBookMoney&userId=' + userId).replace(/\s+/g, ""),
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
                    title: '获取数据失败，请检查网络配置！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
            
        })
        /**获取C2C的图书结束**/

        /**获取上传至自营点图书 */
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getB2CMyBookMoney&userId=113').replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data.length > 0) {
                    for (var i in res.data) {
                        data.push(res.data[i]);
                    }

                }
                that.setData({
                    myLibrary: data
                })

            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请检查网络配置！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
        wx.hideLoading()
        this.getUserData()
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

    getUserData:function(){
        var that = this
        wx.getUserInfo({
            success: function (res) {
                if (res.errMsg =="getUserInfo:ok"){
                    that.setData({
                        userInfo: res.userInfo
                    })
                }
            }
        })
    },

    aldminishare: function (e) {
        var that = this;
        var page = this;
        var url = 'pages/library/library?userId=' + app.globalData.userId;
        var data = {};
        data = e.currentTarget.dataset
        data['path'] = url;
        console.log(data);

        if (that.data.pictureFiles) {
            wx.uploadFile({
                url:  app.globalData.apiUrl + '/index.php?m=home&c=Api&a=uploadMyLibraryPic',
                header: {
                    'content-type': "multipart/form-data"
                }, // 设置请求的 header
                filePath: that.data.pictureFiles,
                name: 'libraryPic',//app.globalData.userId+

                success: function (res) {
                    var picUrl =  app.globalData.apiUrl + res.data;
                    data.wares_image = picUrl;
                    // data.wares_logo = 'https://35978598.1949science.cn/Public/images/logo.png';
                    if (data) {
                        wx.showToast({
                            title: '分享生成中...',
                            icon: 'loading',
                            duration: 999999
                        })
                        wx.request({
                            url: 'https://shareapi.aldwx.com/Main/action/Template/Template/applet_htmlpng',
                            data: data,
                            method: 'POST',
                            success: function (data) {
                                if (data.data.code === 200) {
                                    wx.previewImage({
                                        urls: [data.data.data]
                                    })
                                }
                                console.log(data.data)
                                // 关闭loading
                                wx.hideLoading()
                            },
                            complete: function () {
                                wx.hideLoading()
                            },
                            fail: function () {
                                wx.hideLoading();
                            }
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '图片上传失败,请重试！',
                            showCancel: false,
                            confirmText: "我知道了",
                            success: function () {
                                return;
                            }
                        })
                    }
                }
            })
        } else {
            wx.showToast({
                title: '分享生成中...',
                icon: 'loading',
                duration: 999999
            })
            wx.request({
                url: 'https://shareapi.aldwx.com/Main/action/Template/Template/applet_htmlpng',
                data: data,
                method: 'POST',
                success: function (data) {
                    if (data.data.code === 200) {
                        wx.previewImage({
                            urls: [data.data.data]
                        })
                    }
                    // 关闭loading
                    wx.hideLoading()
                },
                complete: function () {
                    wx.hideLoading()
                },
                fail: function () {
                    wx.hideLoading();
                }
            })
        }


    },
    changePicture: function (e) {
        //长按切换照片
        var that = this;
        var index = e.target.dataset.index;
        wx.showActionSheet({
            itemList: ['更改图片', '删除'],
            success: function (res) {
                if (res.tapIndex == "0") {
                    wx.chooseImage({
                        count: 1,
                        sizeType: 'compressed',
                        success: function (res) {
                            if (res.errMsg == "chooseImage:ok") {
                                that.setData({
                                    pictureFiles: res.tempFilePaths[0],
                                    hidden: true,
                                    changePic: true,//切换了图片
                                })
                            } else {
                                wx.showToast({
                                    title: '选择照片失败，请重试',
                                    image: '../../images/fail.png',
                                    duration: 2000
                                })
                            }
                            // that.togglePtype()
                        }
                    })
                } else if (res.tapIndex == "1") {
                    that.setData({
                        pictureFiles: null,
                        hidden: false,
                        changePic: true,//切换了图片
                    })
                }
            },
            fail: function (res) {

            }
        })

    },
    chooseImage: function () {
        var that = this;
        //选择校园卡或者教工卡
        wx.chooseImage({
            count: 1,
            success: function (res) {
                if (res.errMsg == "chooseImage:ok") {
                    that.setData({
                        pictureFiles: res.tempFilePaths[0],
                        hidden: true
                    })
                } else {
                    wx.showToast({
                        title: '选择照片失败，请重试',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
                //that.togglePtype()
            }
        })
    },
});
