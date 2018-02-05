// pages/commonAuth/commonAuth.js
//toAuth.js 认证页面
//获取应用实例
var app = getApp()
var saveFormIds = require('../../utils/saveFormIds.js');
Page({
    data: {
        userInfo: {},
        loading: true,
        schoolIndex: 0,
        school: new Array("请选择", "河北工业大学"),
        schoolId: new Array("noSelect", "969"),
        cateisShow: false,//弹出框
        pictureFiles: null,
        hidden: false,

        //认证信息
        userName: null,
        phoneNumber: null,
        userSchool: null,
        userClass: null,
        studentCard: null,
        changePic: false, //是否切换了图片
    },
    onLoad: function () {
        var that = this;
        wx.setNavigationBarTitle({ title: '个人认证' });

        //等待认证获取详情
        wx.request({
            url: (app.globalData.apiUrl + '?m=home&c=User&a=getUserInfo&id=' + app.globalData.userId).replace(/\s+/g, ""),
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                app.globalData.userInfo = res.data[0];
                if (res.data[0]["authPic"]) {
                    that.setData({
                        pictureFiles: app.globalData.apiUrl + res.data[0]["authPic"],

                    })
                }
                that.setData({
                    userInfo: res.data[0],
                    userName: res.data[0]["userName"],
                    phoneNumber: res.data[0]["phoneNumber"],
                    userSchool: res.data[0]["userSchool"],
                    userClass: res.data[0]["userClass"],
                    studentCard: res.data[0]["studentCard"],
                    eMail: res.data[0]["eMail"]
                })


            }
        })

        wx.request({
            url: (app.globalData.apiUrl + '?m=home&c=Api&a=getPilotList').replace(/\s+/g, ""),
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    school: res.data.school,
                    schoolId: res.data.schoolId
                })
            }
        })
    },
    onReady: function () {
        this.setData({
            loading: false
        })
    },

    bindPickerSchoolChange: function (e) {
        //学校切换
        this.setData({
            schoolIndex: e.detail.value
        })
    },

    togglePtype: function () {
        //显示分类
        this.setData({
            cateisShow: !this.data.cateisShow
        })
    },

    chooseImage: function () {
        var that = this;
        //选择校园卡或者教工卡
        wx.chooseImage({
            count: 1,
            sizeType: 'compressed',
            success: function (res) {
                if (res.errMsg == "chooseImage:ok") {
                    that.setData({
                        pictureFiles: res.tempFilePaths[0],
                        hidden: true,
                        changePic: true
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

    setName: function (e) {
        //真实姓名
        var that = this;
        that.setData({
            userName: e.detail.value
        })
    },

    setMajor: function (e) {
        //专业班级
        var that = this;
        that.setData({
            userClass: e.detail.value
        })
    },

    setPhone: function (e) {
        //联系方式
        var that = this;
        that.setData({
            phoneNumber: e.detail.value
        })
    },
    setEMail: function (e) {
        //联系方式
        var that = this;
        that.setData({
            eMail: e.detail.value
        })
    },

    setCardId: function (e) {
        //学号
        var that = this;
        that.setData({
            studentCard: e.detail.value
        })
    },
    /*****************************详细认证方法 **********************************/
    toAuth: function (e,payId) {
        saveFormIds.save(e.detail.formId)
        //提交信息
        var that = this;
        var thatData = that.data;
        var schoolIndex = that.data.schoolIndex;

        if (!thatData.userName || !thatData.phoneNumber || !thatData.eMail) {
            wx.showToast({
                title: '你是不是忘记填了点什么！',
                image: '../../images/warning.png',
                duration: 2000
            })
            return;
        }
        
        wx.request({
            url: app.globalData.apiUrl + '/index.php?m=home&c=User&a=selfAuthDirect',
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            }, // 设置请求的 header
            data: {
                "ID": app.globalData.userId,
                'userName': that.data.userName,
                'phoneNumber': that.data.phoneNumber,
                'userSchool': that.data.schoolId[schoolIndex],
                'userClass': that.data.userClass,
                "studentCard": that.data.studentCard,
                "eMail": that.data.eMail,
                "payId":payId
            },
            success: function (res) {
                var data = res.data
                if (data == "success") {
                    app.globalData.certificationOk = 2;
                    wx.setStorageSync('certificationOk', 2);
                    
                    wx.showModal({
                        title: '提示',
                        content: '您认证通过，现在就可以借书了！',
                        showCancel: false,
                        confirmText: "好的",
                        success: function (res) {
                            if (res.confirm) {
                                wx.navigateBack({
                                    delta: 2
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '提交信息失败,请重试！',
                        showCancel: false,
                        confirmText: "我知道了",
                        success: function () {
                            return;
                        }
                    })
                }
            }
        })
        

    },

    //支付29.9押金，直接通过认证
    pay: function (e) {
        var that = this
        var thatData = that.data.orderDetail
        wx.request({
            url: (app.globalData.apiUrl + '?m=home&c=Pay&a=pay').replace(/\s+/g, ""),
            method: 'POST',
            data: {
                'total_fee': 0.01,
                'openid': app.globalData.openId,
                'body': app.globalData.userId+"普通用户认证"
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
                wx.requestPayment({
                    'appId': app.globalData.appId,
                    'timeStamp': res.data['timeStamp'],
                    'nonceStr': res.data['nonceStr'],
                    'package': res.data["package"],
                    'signType': 'MD5',
                    'paySign': res.data["paySign"],
                    'success': function (res1) {
                        if (res1.errMsg == "requestPayment:ok") {
                            wx.showModal({
                                title: '提示',
                                content: '支付成功',
                                confirmText: "知道了",
                                showCancel: false,
                                success: function (res2) {
                                    if (res2.confirm) {
                                        that.toAuth(e, res.data.out_trade_no);
                                    }
                                }
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '支付过程出现问题，请联系客服！',
                                confirmText: "知道了",
                                showCancel: false,
                                success: function (res) {
                                    if (res.confirm) {
                                        wx.setClipboardData({
                                            data: app.globalData.contractPhone,
                                            success: function (res) {
                                                wx.showToast({
                                                    title: '已复制号码到粘贴板',
                                                })
                                            }
                                        })
                                        wx.makePhoneCall({
                                            phoneNumber: app.globalData.contractPhone //联系客服
                                        })
                                    }
                                }
                            })
                        }
                    },
                    'fail': function (res) {
                        if (res.errMsg == "requestPayment:fail cancel") {
                            wx.showModal({
                                title: '提示',
                                content: '您取消了支付',
                                showCancel: false,
                                confirmText: "知道了",
                            })
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '支付过程中遇到问题，请点击下方联系工作人员！',
                                showCancel: false,
                                confirmText: "知道了",
                            })
                        }
                    }
                })
            },
            fail: function (err) {
                console.log(err)
            }
        })
    }
})
