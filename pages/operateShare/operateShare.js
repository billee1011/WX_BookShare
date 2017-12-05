//operateShare.js 关于我们
var event = require('../../utils/event.js')
//获取应用实例
var app = getApp()
Page({
    data: {
        loading: false,
        bookInfo: {},
        disabled: false,
        uploadDays: 10,//默认上传天数
        location: null,//地理名称
        longitude: null,//经度,
        latitude: null,//纬度,
        disabled2:false,

        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        key1: 5,//评分

        index: 0,
        damageArray: ['全新', '八成新以上', '六成新以上'],
        damageIndex:1,

        //刚开始自己上传图书隐藏
        modalFlag:true
    },
    //事件处理函数
    onLoad: function (options) {
        var isbn = options.isbn;
        var that = this;
        if (isbn){
            that.getDouBanApi(isbn);
            that.setData({
                disabled2:true
            })
        }
        var url = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getSorts').replace(/\s+/g, "")
        wx.request({
            url: url,
            method: "GET",
            dataType: "json",
            success: function (res) {
                if (res.data == "none") {
                    wx.showToast({
                        title: '暂无分类',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                } else {
                    that.setData({
                        sortsIDArray: res.data["ID"],
                        sortsNameArray: res.data["sort_name"]
                    })
                }
            }
        })
        
        //绑定监听
        event.on('DataChanged', this, function (data) {
            var that = this;
            var sumSort = "";
            for(var i=0;i<data.length;i++){
                var index = data[i];
                sumSort = sumSort + that.data.sortsArray[index - 1].sort_name + " "
            }
            this.setData({
                sumSort: sumSort,
                selectData: data,
                selectDataStr: JSON.stringify(data)
             })
        })

        //绑定监听
        event.on('ageDataChanged', this, function (data) {
            var that = this;
            var sumAge = "";
            for (var i = 0; i < data.length; i++) {
                var index = data[i];
                sumAge = sumAge + that.data.ageArray[index-1]["age"] + " "
            }
            this.setData({
                sumAge: sumAge,
                selectAgeData: data,
                selectAgeDataStr: JSON.stringify(data)
            })
        })
        
        event.on('Data', this, function (data) {
            this.setData({
                sortsArray: data,
            });
        })

        event.on('ageData', this, function (data) {
            this.setData({
                ageArray: data,
            });
        })        
    },
    onReady: function () {

    },
    //移除绑定监听
    onUnload: function () {
        event.remove('DataChanged', this);
        event.remove('Data', this);
        event.remove('ageDataChanged', this);
        event.remove('ageData', this);
    },

    //扫码
    screenISBN: function () {
        var that = this;
        that.setData({
            loading: true
        })
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                if (res.scanType == "EAN_13") {
                                    //条形码
                                    var isbnCode = res.result;
                                    that.getDouBanApi(isbnCode);

                                } else {
                                    wx.showToast({
                                        title: '条形码有误！',
                                        image: '../../images/fail.png',
                                    })
                                }
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '获取数据失败，请至手动添加图书！',
                                    showCancel: false,
                                    confirmText: "前去填写",
                                    success: function (res) {
                                        if (res.confirm) {
                                            that.setData({
                                                modalFlag: false
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    utils.checkSettingStatu();
                }
            }
        })

        that.setData({
            loading: false
        })

    },

    //请求豆瓣api
    getDouBanApi: function (isbnCode){
        var that = this;
        wx.request({
            url: ('https://api.douban.com/v2/book/isbn/' + isbnCode).replace(/\s+/g, ""),
            header: {
                'content-type': 'json'
            },
            success: function (res) {
                if (res.data.msg == "book_not_found") {
                    wx.showToast({
                        title: '',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                    wx.showModal({
                        title: '提示',
                        content: '没有此图书信息，请至手动添加！',
                        showCancel:false,
                        confirmText:"前去填写",
                        success:function(res){
                            if(res.confirm){
                                that.setData({
                                    modalFlag:false
                                })
                            }
                        }
                    })
                } else {
                    var bookData = res.data;
                    that.setData({
                        bookInfo: res.data,
                        disabled: true,
                    })
                    bookData.author = bookData.author[0] ? bookData.author[0]:'未知';
                    bookData.translator = bookData.translator[0] ? bookData.author[0] : '未知';
                    bookData.tags = JSON.stringify(bookData.tags)
                    var price = bookData.price;
                    price = price.replace(/[^0-9|.]/ig, "")
                    wx.request({
                        url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author + "&translator=" + bookData.translator + "&introduction=" + (bookData.summary) + "&book_image=" + bookData.image + "&book_sort=" + (bookData.tags) + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=" + bookData.author_intro + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + parseInt(price) + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle).replace(/\s+/g, ""),
                        method: "GET",
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            that.setData({
                                bookId: res.data.id,
                            })
                        },
                        fail: function () {
                            wx.showToast({
                                title: '上传失败，请稍后重试！',
                                image: '../../images/fail.png',
                                duration: 2000
                            })
                        }
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '信息加载失败，请重试',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    //选择破损
    bindDamageChange: function (e) {
        console.log(e)
        this.setData({
            damageIndex: e.detail.value
        })
    },

    //设置借出时间
    setDays: function (e) {
        var that = this;
        that.setData({
            uploadDays: e.detail.value
        })
    },

    //选择位置
    chooseLocation: function () {
        var that = this
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    location: res.name
                })
            }
        })
    },

    shareBook: function () {
        var that = this;
        var index = that.data.index;
        
        if (!that.data.location) {
            wx.showToast({
                title: '您还没有选择地址！',
                image: '../../images/warning.png',
                duration: 2000
            })
            return;
        }

        if (!that.data.selectDataStr) {
            wx.showToast({
                title: '您还没有选择分类！',
                image: '../../images/warning.png',
                duration: 2000
            })
            return;
        }

        if (!that.data.selectAgeDataStr) {
            wx.showToast({
                title: '您还没有选择适龄！',
                image: '../../images/warning.png',
                duration: 2000
            })
            return;
        }

        wx.request({
            url: ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=shareBook&ownerId=' + app.globalData.userId + "&bookId=" + that.data.bookId + "&keep_time=" + that.data.uploadDays + "&location=" + that.data.location + "&longitude=" + that.data.longitude + "&latitude=" + that.data.latitude + "&card_content=" + that.data.card_content + "&book_content=" + that.data.key1 + "&age=" + that.data.selectAgeDataStr + "&price=" + parseInt(that.data.bookInfo.price) + "&sort=" + that.data.selectDataStr + "&damage=" + that.data.damageIndex).replace(/\s+/g, ""),//之前的单个分类sortsIDArray[sortsIndex]
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "have shared") {
                    wx.showToast({
                        title: '已经分享过，无需再分享！',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                } else if (res.data == "success"){
                    wx.showModal({
                        title: '提醒',
                        content: '分享成功，有人借阅您的图书您就会得到收益噢！',
                        showCancel:false,
                        confirmText:"我知道了",
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta:1
                                })
                            }
                        }
                    })
                }else{
                    wx.showToast({
                        title: '分享失败',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }

            },
            fail: function () {
                wx.showToast({
                    title: '分享失败，请稍后重试！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    //继续分享
    continueShare: function () {
        var that = this;
        that.setData({
            loading: false,
            bookInfo: null,
            disabled: false,
            uploadDays: 10,//默认上传天数
            location: null,//地理名称
            longitude: null,//经度,
            latitude: null,//纬度
        })
    },

    /**
    * 书评
     */
    selectLeft1: function (e) {
        var key1 = e.currentTarget.dataset.key
        if (this.data.key1 == 0.5 && e.currentTarget.dataset.key == 0.5) {
            //只有一颗星的时候,再次点击,变为0颗
            key1 = 0;
        }
        this.setData({
            key1: key1
        })

    },
    //点击左边,整颗星
    selectRight1: function (e) {
        var key1 = e.currentTarget.dataset.key
        this.setData({
            key1: key1
        })
    },
    //选择器
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value
        })
    },

    setContent:function(e){
        var that = this;
        that.setData({
            card_content: e.detail.value//书评内容
        })
    },

    //打开分类页面
    openSorts: function () {
        var that = this
        var data = that.data.selectData;
        var url = "../sorts/sorts";
        for (var i in data) {
            if (i == 0) {
                url += "?selected" + i + "=" + data[i];
            } else {
                url += "&selected" + i + "=" + data[i];
            }

        }
        wx.navigateTo({
            url: url,
        })
    },

    //打开适龄页面
    openAges: function () {
        var that = this
        var data = that.data.selectAgeData;
        var url = "../ageSelect/ageSelect";
        for (var i in data) {
            if (i == 0) {
                url += "?selected" + i + "=" + data[i];
            } else {
                url += "&selected" + i + "=" + data[i];
            }

        }
        wx.navigateTo({
            url: url,
        })
    },

    //设置图书名称
    setBookName:function(e){
        var that = this
        console.log(that.data.bookInfo)
        var bookInfo = {};
        bookInfo = that.data.bookInfo;
        bookInfo['title'] = e.detail.value
        that.setData({
            bookInfo: bookInfo
        })
    },

    //设置作者
    setWriter: function (e) {
        var that = this
        var bookInfo = that.data.bookInfo;
        bookInfo.author = new Array()
        bookInfo.author[0] = e.detail.value
        that.setData({
            bookInfo: bookInfo
        })
    },

    //设置ISBN
    setISBN: function (e) {
        var that = this
        var bookInfo = that.data.bookInfo;
        bookInfo.isbn13 = e.detail.value
        that.setData({
            bookInfo: bookInfo
        })
    },

    //设置Price
    setPrice: function (e) {
        var that = this
        var bookInfo = that.data.bookInfo;
        bookInfo.price = e.detail.value
        that.setData({
            bookInfo: bookInfo
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
    modalOk:function(){
        var that = this
        var bookInfo = that.data.bookInfo;
        if (!bookInfo.title || !bookInfo.author || !bookInfo.isbn13 || !bookInfo.price){
            wx.showModal({
                title: '提示',
                content: '您还有信息没有填写！',
                showCancel: false,
                confirmText: "我知道了",
            })
            return ;
        }
        if (!that.data.pictureFiles){
            wx.showModal({
                title: '提示',
                content: '您没有还有上传图片！',
                showCancel: false,
                confirmText: "我知道了",
            })
            return;
        }
        bookInfo.author = bookInfo.author[0] ? bookInfo.author[0] : '未知';
        wx.showToast({
            title: '上传图书信息中！',
            icon: 'loading',
            duration: 999999
        })
        wx.uploadFile({
            url: 'https://' + app.globalData.apiUrl + '/index.php?m=home&c=Api&a=selfUploadBook',
            header: {
                'content-type': "multipart/form-data"
            }, // 设置请求的 header
            filePath: that.data.pictureFiles,
            formData: bookInfo,
            name: 'bookPic',
            success: function (res) {
                if (res.data) {
                    that.setData({
                        bookId:res.data,
                        modalFlag:true
                    })
                    wx.showToast({
                        title: '上传图书成功',
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '上传失败,请重试！',
                        showCancel: false,
                        confirmText: "我知道了",
                        success: function () {
                            return;
                        }
                    })
                }
            },
            complete:function(){
                wx.hideLoading()
            }
        })
    }
})
