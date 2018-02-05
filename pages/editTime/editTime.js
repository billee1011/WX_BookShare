//bookMan.js 图书管理
//获取应用实例
var app = getApp()
var utils = require('../../utils/util.js');
var event = require('../../utils/event.js')
Page({
    data: {
        canShareId: null,
        loading: true,
        bookInfo: null,
        keepTime: null,

        stars: [0, 1, 2, 3, 4],
        normalSrc: '../../images/normal.png',
        selectedSrc: '../../images/selected.png',
        halfSrc: '../../images/half.png',
        key1: 3,//评分
        bookName:''
    },
    //事件处理函数
    onLoad: function (options) {
        var that = this;
        var canShareId = options.canShareId;
        var bookId = options.bookId;
        that.setData({
            canShareId: canShareId,
            bookId: bookId
        })
        wx.request({
            url: (app.globalData.apiUrl + '?m=home&c=Api&a=getEditInfo&canShareId=' + canShareId + "&userId=" + app.globalData.userId).replace(/\s+/g, ""),
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data[0]["result"] == "success") {
                    if (res.data[0]["age"]) {
                        //对年龄的数据处理
                        var age = utils.htmldecode(res.data[0]["age"]);
                        if (age) {
                            age = age.split(",")
                        }
                        res.data[0]["age"] = age;
                    }
                    that.setData({
                        bookInfo: res.data[0],
                        loading: false,
                        keepTime: res.data[0].keep_time,
                        location: res.data[0].location,
                        longitude: res.data[0].longitude,
                        latitude: res.data[0].latitude,
                        index: res.data[0].age,
                        key1: res.data[0].book_content,
                        card_content: res.data[0].card_content,
                        bookId: res.data[0].book_id,
                        ageObject: res.data[0].ageObject.fullData,
                        age: res.data[0]["age"],
                        imageList:res.data[0]["morePic"],
                        canSharePicIds: res.data[0]["morePicId"]
                    })

                } else {
                    wx.showToast({
                        title: '获取数据失败，请重试！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }

            }
        })

        //绑定监听
        event.on('ageDataChanged', this, function (data) {
            var that = this;
            that.setData({
                age: data
            })
        })
    },
    onReady: function () {

    },

    //修改适龄
    //打开适龄页面
    openAges: function () {
        var that = this
        var data = that.data.age;
        var url = "../ageSelect/ageSelect";
        if (data) {
            for (var i in data) {
                if (i == 0) {
                    url += "?selected" + i + "=" + data[i];
                } else {
                    url += "&selected" + i + "=" + data[i];
                }

            }
        }
        wx.navigateTo({
            url: url,
        })
    },

    //设置时间
    setDays: function (e) {
        var that = this;
        that.setData({
            keepTime: e.detail.value
        })
    },

    //保存修改
    saveKeepTime: function (e) {
        var canShareId = e.currentTarget.dataset.canshareid;
        var that = this;
        var arrayValue = JSON.stringify(that.data.age);
        wx.request({
            url: (app.globalData.apiUrl + '?m=home&c=Api&a=editKeepTime&canShareId=' + canShareId + "&book_id=" + that.data.bookId + "&user_id=" + app.globalData.userId + "&book_content=" + that.data.key1 + "&card_content=" + that.data.card_content + "&location=" + that.data.location + "&latitude=" + that.data.latitude + "&longitude=" + that.data.longitude + "&age=" + arrayValue+"&bookName="+that.data.bookName).replace(/\s+/g, ""),
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data == "success") {
                    wx.showToast({
                        title: '修改成功！',
                        icon: 'success',
                        duration: 4000,
                        success: function () {
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                    })

                } else {
                    wx.showToast({
                        title: '修改失败，请重试！',
                        image: '../../images/fail.png',
                        duration: 2000
                    })
                }

            }
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

    //设置书评内容
    setContent: function (e) {
        var that = this;
        that.setData({
            card_content: e.detail.value//书评内容
        })
    },

    //选择图片
    chooseImage: function () {
        var that = this
        wx.chooseImage({
            sizeType:'compressed',
            success: function (res) {
                wx.showModal({
                    title: '提示',
                    content: '是否上传您选中的图片？',
                    success: function (res1) {
                        if (res1.confirm) {
                            var imageList = that.data.imageList;
                            var tempFilePaths = res.tempFilePaths;
                            var c = imageList.concat(tempFilePaths);
                            that.setData({
                                imageList: c
                            })
                            wx.showLoading({
                                title: '上传中',
                            })
                            app.uploadimg({
                                url: app.globalData.apiUrl + '/index.php?m=home&c=Api&a=uploadBookDetailPic',//这里是你图片上传的接口
                                path: tempFilePaths,//这里是选取的图片的地址数组,
                                formData: {
                                    'can_share_id': that.data.canShareId
                                },
                            });
                            wx.hideLoading()
                            wx.showModal({
                                title: '提示',
                                content: '上传成功！',
                                showCancel: false
                            })
                            
                        }
                    }
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

    //长按更换图片或删除
    openAction:function(e){
        var that = this
        var index = e.currentTarget.dataset.index;
        var canSharePicId = e.currentTarget.dataset.cansharepicid;
        var imageList = that.data.imageList; 
        var canSharePicIds = that.data.canSharePicIds;
        if (canSharePicId!='none'){
            var itemListArray = new Array('更换图片', '删除');
        } else if (canSharePicId !='undefined'){
            var itemListArray = new Array('更换封面');
        }else{
            return;
        }
        wx.showActionSheet({
            itemList: itemListArray,
            count:1,
            success:function(res){
                if(res.tapIndex == 0){
                    //更换图片 接口updateCanSharePic
                    wx.chooseImage({
                        sizeType: 'compressed',
                        success: function (res) {
                            wx.showModal({
                                title: '提示',
                                content: '是否上传您选中的图片？',
                                success: function (res1) {
                                    if (res1.confirm) {
                                        var tempFilePath = res.tempFilePaths[0];
                                        imageList[index] = (tempFilePath);
                                        that.setData({
                                            imageList: imageList
                                        })
                                        wx.showLoading({
                                            title: '上传中',
                                        })
                                        app.uploadimg({
                                            url: app.globalData.apiUrl + '/index.php?m=home&c=Api&a=updateCanSharePic',//这里是你图片上传的接口
                                            path: res.tempFilePaths,//这里是选取的图片的地址数组,
                                            formData: {
                                                'canSharePicId': canSharePicId
                                            },
                                        });
                                        wx.hideLoading()
                                        wx.showModal({
                                            title: '提示',
                                            content: '更新成功！',
                                            showCancel: false
                                        })
                                    }
                                }
                            })
                        }
                    })
                    
                }else if(res.tapIndex == 1){
                    //删除图片
                    wx.request({
                        url: (app.globalData.apiUrl + '?m=home&c=Api&a=deleteCanSharePic&canSharePicId=' + canSharePicId).replace(/\s+/g, ""),
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            if (res.data == "success") {
                                wx.showModal({
                                    title: '提示',
                                    content: '删除成功！',
                                    showCancel:false
                                })
                                console.log(imageList)
                                delete imageList[index]
                                delete canSharePicIds[index]
                                console.log(imageList)
                                //imageList = imageList.slice(index,1);
                                that.setData({
                                    imageList: imageList,
                                    canSharePicIds: canSharePicIds
                                })
                            } else {
                                wx.showModal({
                                    title: '提示',
                                    content: '删除失败，请重试！',
                                    showCancel: false
                                })
                            }

                        }
                    })
                }
            }
        })
    },

    //修改书名
    setBookName:function(e){
        var that= this
        that.setData({
            bookName: e.detail.value
        })
    },
})
