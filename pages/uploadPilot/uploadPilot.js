//uploadPilot.js 自营点上传图书
var event = require('../../utils/event.js')
import { $wuxBackdrop } from '../../components/wux'
//获取应用实例
var app = getApp()
var sourceType = [['camera'], ['album'], ['camera', 'album']]
var sizeType = [['compressed'], ['original'], ['compressed', 'original']]
Page({
    data: {
        bookInfo: {},
        hidden: 0,
        step: 1,
        cateisShow: false,
        array: ['无限制', '3-5岁', '6-9岁', '10-12岁'],
        arrayValue: ['0', '1', '2', '3'],
        ageIndex: 0,
        sortsIDArray: null,//获取图书分类
        sortsNameArray: null,//获取图书分类
        sortsIndex: 0,

        //上传图片
        imageList: [],
        imageListIndex: 0,
        sourceTypeIndex: 2,
        sourceType: ['拍照', '相册', '拍照或相册'],

        sizeTypeIndex: 2,
        sizeType: ['压缩', '原图', '压缩或原图'],

        countIndex: 3,
        count: [1, 2, 3, 4],

        //破损程度
        damageArray: ['全新', '八成新以上', '六成新以上'],
        damageIndex: 1,

        //刚开始自己上传图书隐藏
        modalFlag: true
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this;
        // that.$wuxBackdrop = $wuxBackdrop.init();
        // that.retain()
        that.setData({
            donateType: options.donateType
        })
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

        var can_share_id = wx.getStorageSync('can_share_id')
        var qrcodeId = wx.getStorageSync('qrcodeId')
        var price = wx.getStorageSync('price')
        var bookInfo = wx.getStorageSync('bookInfo')
        var hidden = wx.getStorageSync('hidden')
        var bookId = wx.getStorageSync('bookId')
        if (qrcodeId) {
            wx.showModal({
                title: '提醒',
                content: '您上一次上传的' + bookInfo.title + '还未扫描书柜，是否继续？',
                cancelText: "残忍拒绝",
                cancelColor: "#E21918",
                confirmText: "现在就去",
                success: function (res) {
                    if (res.confirm) {
                        that.setData({
                            hidden: hidden,
                            price: price,
                            qrcodeId: qrcodeId,
                            bookInfo: bookInfo,
                            can_share_id: can_share_id
                        })
                    } else {
                        //根据qrcodeId删除之前上传的
                        var url3 = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=deleteByQrcodeId&qrcodeId=' + qrcodeId).replace(/\s+/g, "");

                        wx.request({
                            url: url3,
                            method: "GET",
                            success: function (res) {
                                if (res.data == "success") {
                                    that.clearStorageSelf();
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }
                            }
                        })

                    }
                }
            })
        } else if (can_share_id) {
            var that = this;
            wx.showModal({
                title: '提醒',
                content: '您上一次上传的' + bookInfo.title + '还未扫描书后二维码，是否继续？',
                cancelText: "残忍拒绝",
                cancelColor: "#E21918",
                confirmText: "现在就去",
                success: function (res) {
                    if (res.confirm) {
                        that.setData({
                            hidden: hidden,
                            price: price,
                            qrcodeId: qrcodeId,
                            bookInfo: bookInfo,
                            can_share_id: can_share_id,
                            bookId: bookId
                        })
                        that.deleteByCanShareId()
                    } else {
                        that.setData({
                            can_share_id: can_share_id,
                        })
                        //根据can_share_id删除之前上传的
                        that.deleteByCanShareId();
                        that.clearStorageSelf();
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                }
            })
        }

        //绑定监听
        event.on('DataChanged', this, function (data) {
            var that = this;
            var sumSort = "";
            var selectDataStr = '';
            for (var i = 0; i < data.length; i++) {
                var index = data[i];
                sumSort = sumSort + that.data.sortsArray[index - 1].sort_name + " ";
                selectDataStr = selectDataStr + data[i] + ",";
            }
            this.setData({
                sumSort: sumSort,
                selectData: data,
                selectDataStr: selectDataStr
            })
        })

        //绑定监听
        event.on('ageDataChanged', this, function (data) {
            var that = this;
            var sumAge = "";
            for (var i = 0; i < data.length; i++) {
                var index = data[i];
                sumAge = sumAge + that.data.ageArray[index - 1]["age"] + " "
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
    //移除绑定监听
    onUnload: function () {
        event.remove('DataChanged', this);
        event.remove('Data', this);
    },
    //清除缓存
    clearStorageSelf: function () {
        //清除缓存
        wx.removeStorageSync('can_share_id');
        wx.removeStorageSync('qrcodeId');
        wx.removeStorageSync('price');
        wx.removeStorageSync('bookInfo');
        wx.removeStorageSync('hidden');
        wx.removeStorageSync('bookId');
    },

    //根据can_share_id删除can_share表中的信息
    deleteByCanShareId: function () {
        var that = this
        var url = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=deleteByCanShareId&can_share_id=' + that.data.can_share_id).replace(/\s+/g, "");
        wx.request({
            url: url,
            method: "GET",
            success: function (res) {
                if (res.data == "fail") {
                    wx.showToast({
                        title: '操作失败，请重试',
                    })
                    return;
                }
            }
        })
    },

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    //选择破损
    bindDamageChange: function (e) {
        this.setData({
            damageIndex: e.detail.value
        })
    },

    // 扫描书后的isbn
    screenBook: function (e) {
        var that = this
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
                                    wx.request({
                                        url: ('https://api.douban.com/v2/book/isbn/' + isbnCode).replace(/\s+/g, ""),
                                        header: {
                                            'content-type': 'json'
                                        },
                                        success: function (res) {
                                            if (res.data.msg == "book_not_found") {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '没有此图书信息，请至手动添加！',
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
                                            } else {
                                                that.setData({
                                                    bookInfo: res.data,
                                                })
                                                var bookData = that.data.bookInfo;
                                                bookData.author = bookData.author[0] ? bookData.author[0] : '未知';
                                                bookData.translator = bookData.translator[0] ? bookData.translator[0] : '未知';
                                                bookData.tags = JSON.stringify(bookData.tags)
                                                var price = bookData.price;
                                                price = price.replace(/[^0-9|.]/ig, "")
                                                that.setData({
                                                    price: price
                                                })
                                                wx.setStorageSync("bookInfo", res.data)
                                                var data = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=uploadBookInfo&book_name=' + bookData.title + "&writer=" + bookData.author + "&translator=" + bookData.translator + "&introduction=" + (bookData.summary) + "&book_image=" + bookData.image + "&book_sort=" + (bookData.tags).substring(0, 300) + "&ISBN10=" + bookData.isbn10 + "&book_press=" + bookData.publisher + "&publish_date=" + bookData.pubdate + "&web_url=" + bookData.url + "&rating=" + bookData.rating.average + "&writer_intro=123" + "&image_large=" + bookData.images.large + "&image_medium=" + bookData.images.medium + "&image_small=" + bookData.images.small + "&ISBN13=" + bookData.isbn13 + "&pages=" + bookData.pages + "&price=" + price + "&rating_max=" + bookData.rating.max + "&rating_min=" + bookData.rating.min + "&raters_num=" + bookData.rating.numRaters + "&subtitle=" + bookData.subtitle).replace(/\s+/g, "");

                                                wx.request({
                                                    url: data,
                                                    method: "GET",
                                                    success: function (res) {
                                                        console.log(res.data)
                                                        that.setData({
                                                            bookId: res.data.id,
                                                            hidden: 1
                                                        })
                                                        wx.showToast({
                                                            title: '上传图书成功！'
                                                        })

                                                    },
                                                    fail: function () {
                                                        wx.showToast({
                                                            title: '上传图书信息失败！',
                                                            image: '../../images/fail.png',
                                                            duration: 2000
                                                        })
                                                    }
                                                })

                                            }
                                        },
                                    })
                                } else {
                                    wx.showToast({
                                        title: '条形码有误！',
                                        image: '../../images/fail.png',
                                    })
                                }
                            } else {
                                wx.showToast({
                                    title: '获取数据失败，请稍后重试！',
                                    image: '../../images/fail.png',
                                })
                            }
                        }
                    })
                } else {
                    utils.checkSettingStatu();
                }
            }
        })

    },

    //扫描与书主绑定的二维码
    screenQRcode: function (e) {
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                var qrcodeId = res.result.substring(69);
                                if (!qrcodeId) {
                                    wx.showToast({
                                        title: '重新扫描二维码',
                                        image: '../../images/warning.png',
                                        duration: 2000
                                    })
                                    return;
                                }
                                var url1 = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=sharePilotBook&ownerId=' + app.globalData.userId + "&bookId=" + that.data.bookId + "&keep_time=" + app.globalData.pilotKeepTime).replace(/\s+/g, "")
                                wx.request({
                                    url: url1,
                                    method: "GET",
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                        console.log(res.data)
                                        if (res.data[0]["result"] == "have shared") {
                                            wx.showToast({
                                                title: '已经分享过，无需再分享！',
                                                image: '../../images/warning.png',
                                                duration: 2000
                                            })
                                        } else if (res.data[0]["result"] == "success") {
                                            that.setData({
                                                can_share_id: res.data[0]["can_share_id"],
                                            })
                                            //暂时存在storage里！！！！！！！！！！！！！！！！！！！！！
                                            wx.setStorageSync("bookId", that.data.bookId)
                                            wx.setStorageSync("can_share_id", that.data.can_share_id)
                                            wx.setStorageSync("price", that.data.price)
                                            wx.setStorageSync("hidden", 1)
                                            var url2 = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=insertPilot&user_id=' + app.globalData.userId + "&qrcode_id=" + qrcodeId + "&can_share_id=" + that.data.can_share_id + "&donateType=" + that.data.donateType).replace(/\s+/g, "")
                                            wx.request({
                                                url: url2,
                                                method: "GET",
                                                header: {
                                                    'content-type': 'application/json'
                                                },
                                                success: function (res) {
                                                    if (res.data == "had screen") {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '该二维码已被使用，请更换二维码',
                                                            confirmText:"我知道了",
                                                            showCancel:false
                                                        })
                                                    } else if (res.data == "success") {
                                                        that.setData({
                                                            hidden: 2
                                                        })
                                                        //暂时存在storage里！！！！！！！！！！！！！！！！！！！！！
                                                        wx.setStorageSync("qrcodeId", qrcodeId);
                                                        wx.setStorageSync("hidden", 2)
                                                        wx.showToast({
                                                            title: '扫描贴码成功！'
                                                        })
                                                    } else {
                                                        wx.showToast({
                                                            title: '上传失败，请稍后重试！',
                                                            image: '../../images/fail.png',
                                                            duration: 2000
                                                        })
                                                    }
                                                },
                                                fail: function () {
                                                    wx.showToast({
                                                        title: '上传失败，请稍后重试！',
                                                        image: '../../images/fail.png',
                                                        duration: 2000
                                                    })
                                                }
                                            })
                                        } else {
                                            wx.showToast({
                                                title: '分享失败，请稍后重试！',
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


                            } else {
                                wx.showToast({
                                    title: '获取数据失败，请稍后重试！',
                                    image: '../../images/fail.png',
                                })
                            }
                        }
                    })
                } else {
                    utils.checkSettingStatu();
                }
            }
        })

    },

    //扫描柜子二维码
    bookcase: function (e) {
        var that = this
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    //已授权 扫描ISBN
                    wx.scanCode({
                        success: (res) => {
                            if (res.errMsg == "scanCode:ok") {
                                //扫描成功
                                var array = res.result.split("@bookcase");
                                if (array.length < 2) {
                                    wx.showToast({
                                        title: '扫描二维码出错！',
                                        image: '../../images/fail.png',
                                    })
                                    return;
                                }
                                var url3 = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=updateOwner&pilot_id=' + array[0] + "&can_share_id=" + that.data.can_share_id + "&price=" + that.data.price + "&user_id=" + app.globalData.userId + "&bookcase_qrcode=" + res.result).replace(/\s+/g, "");

                                wx.request({
                                    url: url3,
                                    method: "GET",
                                    header: {
                                        'content-type': 'application/json'
                                    },
                                    success: function (res) {
                                        if (res.data == "success") {
                                            //清除缓存
                                            that.clearStorageSelf();

                                            wx.showModal({
                                                title: '提醒',
                                                content: '扫描书柜成功，敬请收益!',
                                                showCancel: false,
                                                success: function (res) {
                                                    if (res.confirm) {
                                                        that.togglePtype();

                                                    }
                                                }
                                            })
                                        } else {
                                            wx.showToast({
                                                title: '扫描书柜失败！',
                                                image: '../../images/fail.png',
                                                duration: 2000
                                            })
                                        }
                                    },
                                    fail: function () {
                                        wx.showToast({
                                            title: '扫描书柜失败！',
                                            image: '../../images/fail.png',
                                            duration: 2000
                                        })
                                    }
                                })

                            } else {
                                wx.showToast({
                                    title: '扫描书柜二维码出错！',
                                    image: '../../images/fail.png',
                                })
                            }
                        }
                    })
                } else {
                    utils.checkSettingStatu();
                }
            }
        })

    },

    //选择适龄
    bindAgeChange: function (e) {
        this.setData({
            ageIndex: e.detail.value
        })
    },

    //选择分类
    bindSortsChange: function (e) {
        // this.setData({
        //     sortsIndex: e.detail.value
        // })
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

    setContent: function (e) {
        this.setData({
            cardContent: e.detail.value
        })
    },

    //上传图片
    sourceTypeChange: function (e) {
        this.setData({
            sourceTypeIndex: e.detail.value
        })
    },
    sizeTypeChange: function (e) {
        this.setData({
            sizeTypeIndex: e.detail.value
        })
    },
    countChange: function (e) {
        this.setData({
            countIndex: e.detail.value
        })
    },
    chooseImage: function () {
        var that = this
        wx.chooseImage({
            sourceType: sourceType[this.data.sourceTypeIndex],
            sizeType: sizeType[this.data.sizeTypeIndex],
            count: this.data.count[this.data.countIndex],
            success: function (res) {
                var imageList = that.data.imageList;
                var tempFilePaths = res.tempFilePaths;
                var c = imageList.concat(tempFilePaths);
                that.setData({
                    imageList: c
                })
            }
        })
    },
    previewImage: function (e) {
        var current = e.target.dataset.src
        wx.previewImage({
            current: current,
            urls: this.data.imageList
        })
    },

    completeInfo: function () {
        //提交信息
        var that = this;
        var thatData = that.data;
        var ageIndex = that.data.ageIndex;
        var sortsIndex = that.data.sortsIndex;
        if (!thatData.cardContent) {
            wx.showModal({
                title: '提醒',
                content: '您还没有填写书评，填写书评可能会吸引更多人借阅呦',
                confirmText: "填写",
                cancelText: "算了",
                success: function (res) {
                    if (res.confirm) {
                        return;
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }

        wx.request({
            url: ('https://' + app.globalData.apiUrl + '/index.php?m=home&c=Api&a=changeAgeSorts&can_share_id=' + thatData.can_share_id + "&book_id=" + thatData.bookId + "&user_id=" + app.globalData.userId + "&age=" + that.data.selectAgeDataStr + "&sort=" + thatData.selectDataStr + "&card_content=" + thatData.cardContent + "&book_content=5" + "&damage="+thatData.damageIndex).replace(/\s+/g, ""),
            method: "GET",
            dataType: "text",
            success: function (res) {
                if (res.data == "success") {
                    wx.showModal({
                        title: '提醒',
                        content: '更新图书信息成功!',
                        showCancel: false,
                        success: function (res) {
                            if (res.confirm) {
                                // wx.reLaunch({
                                //     url: '../detailPay/detailPay?bookId=' + that.data.bookId + '&canShareId=' + that.data.can_share_id+'&book_type=1'
                                // })
                                wx.navigateBack({
                                    delta:1
                                })
                            }
                        }
                    })
                } else {
                    wx.showToast({
                        title: '更新图书信息失败！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }
            },
            fail: function () {
                wx.showToast({
                    title: '扫描书柜失败！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
        // console.log(that.data.imageList);
        app.uploadimg({
            url: 'https://' + app.globalData.apiUrl + '/index.php?m=home&c=Api&a=uploadBookDetailPic',//这里是你图片上传的接口
            path: that.data.imageList,//这里是选取的图片的地址数组,
            formData: {
                'can_share_id': that.data.can_share_id
            },
        });

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

    //粘贴二维码按钮
    pasteQrcode: function () {
        var that = this
        that.setData({
            hidden:3
        })
        wx.setStorageSync("hidden", 3)
    },

    //设置图书名称
    setBookName: function (e) {
        var that = this
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
    setSummary: function (e) {
        var that = this
        var bookInfo = that.data.bookInfo;
        bookInfo.summary = e.detail.value
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

    modalChooseImage: function () {
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

    //打开openModal
    openModal: function () {
        var that = this;
        that.setData({
            modalFlag: false
        })
    },

    modalOk: function () {
        var that = this
        var bookInfo = that.data.bookInfo;
        if (!bookInfo.title || !bookInfo.author || !bookInfo.summary || !bookInfo.price) {
            wx.showModal({
                title: '提示',
                content: '您还有信息没有填写！',
                showCancel: false,
                confirmText: "我知道了",
            })
            return;
        }
        if (!that.data.pictureFiles) {
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
                        bookId: res.data,
                        modalFlag: true,
                        hidden:1
                    })
                    wx.showModal({
                        title: '提示',
                        content: '上传图书成功',
                        showCancel:false,
                        confirmText:"好的"
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
            complete: function () {
                wx.hideLoading()
            }
        })
    },

    modalCancel: function () {
        var that = this;
        that.setData({
            modalFlag: true
        })
    }
})
