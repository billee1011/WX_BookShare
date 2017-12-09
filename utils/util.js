var app = getApp();
function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//date类型转 2017/09/22
function formatTimeToDay(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' '
}

//时间字符串转date类型
function getDate(strDate) {
    var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
        function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
    return date;
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function formatLocation(longitude, latitude) {
    if (typeof longitude === 'string' && typeof latitude === 'string') {
        longitude = parseFloat(longitude)
        latitude = parseFloat(latitude)
    }

    longitude = longitude.toFixed(2)
    latitude = latitude.toFixed(2)

    return {
        longitude: longitude.toString().split('.'),
        latitude: latitude.toString().split('.')
    }
}

module.exports = {
    formatTime: formatTime,
    formatTimeToDay: formatTimeToDay,
    getDate: getDate,
    // 是否为空对象
    isEmptyObject: function (e) {

        var t;

        for (t in e)

            return !1;

        return !0

    },

    // 检测授权状态
    checkSettingStatu: function (cb) {

        var that = this;
        var param = cb;
        // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒

        wx.getSetting({

            success: function success(res) {
                var authSetting = res.authSetting;
                if (that.isEmptyObject(authSetting)) {

                    console.log('首次授权');

                } else {

                    console.log('不是第一次授权', authSetting);

                    // 没有授权的提醒

                    if (authSetting['scope.userInfo'] === false) {
                        wx.clearStorage();

                        wx.showModal({

                            title: '用户未授权',

                            content: '如需正常使用功能，请按确定并在授权管理中选中“用户信息”，然后点按确定。最后再重新进入小程序即可正常使用。',

                            showCancel: false,

                            success: function (res) {
                                if (res.confirm) {

                                    wx.openSetting({

                                        success: function success(res) {
                                            if (res.authSetting["scope.userInfo"]) {
                                                //这里是授权成功之后 填写你重新获取数据的js
                                                app.globalData.authSettingUserInfo == true;
                                                // that.getUserData(param);
                                                if (param != null) {
                                                    if (param.route == 'pages/self/self') {
                                                        wx.showModal({
                                                            title: '提示',
                                                            content: '授权成功！',
                                                            success: function (res) {
                                                                // utils.getUserData(param);
                                                                // var t2 = window.setTimeout("hello()", 3000);//使用字符串执行方法
                                                                // param.onLoad();
                                                                wx.showLoading({
                                                                    title: '信息加载中',
                                                                })

                                                                while(true){
                                                                    console.log(param.data.userInfo);
                                                                    if(param.data.userInfo){
                                                                        wx.hideLoading()
                                                                        param.onLoad();
                                                                        break ;
                                                                    }
                                                                }

                                                                
                                                                
                                                            }
                                                        })
                                                    }
                                                }
                                            }
                                        }

                                    });

                                } else if (res.confirm == false && res.cancel == false) {
                                    //Android点击蒙层关闭情况
                                    if (param != null) {
                                        if (param.route == 'pages/self/self') {
                                            return;
                                        }
                                    }
                                    wx.navigateBack({
                                        delta: 1
                                    })

                                }

                            }

                        })

                    }

                }

            }

        });

    },

    //获取个人信息
    getUserData: function (el) {
        var param = el;
        wx.login({
            success: function (res) {
                if (res.code) {
                    //请求access_token
                    if (!wx.getStorageSync('openId') || !wx.getStorageSync('userId')) {
                        wx.request({
                            url:  getApp().globalData.apiUrl + '?m=home&c=User&a=getSessionKey&code=' + res.code,
                            success: function (res) {
                                var resData = res;
                                wx.setStorageSync('session_key', res.data.session_key)
                                wx.setStorageSync('openId', res.data.openid)

                                //获取个人信息
                                wx.getUserInfo({
                                    success: function (res) {
                                        var res = JSON.parse(res.rawData);//eval('(' + res.rawData + ')');
                                        //创建账号到数据库
                                        var url = ( getApp().globalData.apiUrl + '?m=home&c=User&a=regiser&avatarUrl=' + res.avatarUrl + "&city=" + res.city + "&country=" + res.country + "&gender=" + res.gender + "&nickName=" + res.nickName + "&province=" + res.province + "&openId=" + resData.data.openid).replace(/\s+/g, "");
                                        wx.request({
                                            url: url,
                                            success: function (res) {
                                                if (res.data[0]["certificationOk"] == 0) {
                                                    param.showNotification('', '', "您还没有认证，请前往个人中心认证!");
                                                } else if (res.data[0]["certificationOk"] == 3) {
                                                    param.showNotification('', '', "认证被驳回，请重新上传信息！");
                                                }
                                                wx.setStorageSync('userId', res.data[0]["ID"])
                                                wx.setStorageSync('userInfo', res.data[0])
                                                wx.setStorageSync('certificationOk', res.data[0]["certificationOk"])


                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }


                    if (wx.getStorageSync('certificationOk') != 2 && wx.getStorageSync('userId')) {
                        var url = ( app.globalData.apiUrl + '?m=home&c=User&a=getcertification&id=' + wx.getStorageSync('userId')).replace(/\s+/g, "")
                        wx.request({
                            url: url,
                            method: "GET",
                            dataType: "json",
                            success: function (res) {
                                wx.setStorageSync('certificationOk', res.data)
                            }
                        })
                    }

                    getApp().globalData.session_key = wx.getStorageSync('session_key')
                    getApp().globalData.openId = wx.getStorageSync('openId')
                    getApp().globalData.userId = wx.getStorageSync('userId')
                    getApp().globalData.userInfo = wx.getStorageSync('userInfo')
                    getApp().globalData.certificationOk = wx.getStorageSync('certificationOk')

                    param.setData({
                        userInfo: getApp().globalData.userInfo,
                        certificationOk: getApp().globalData.certificationOk,
                    })

                } else {
                    getApp().globalData.userId = null;
                }
            }
        });
    },

    //获取当前用户是否有未完成的订单
    getNonePay: function () {
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=New&a=getNoneReturn&userId=' + app.globalData.userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json',
            },
            success: function (res) {
                if (res.data) {
                    wx.navigateTo({
                        url: '../pay/pay?sharingId=' + res.data[0].sharingId,
                    })
                }
            }
        })
    }
}


