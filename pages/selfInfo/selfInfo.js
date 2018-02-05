//selfInfo.js 个人信息
//获取应用实例
var app = getApp()
var saveFormIds = require('../../utils/saveFormIds.js');
Page({
    data: {
       userInfo: {},
       loading:true,
       babySex:0,
       sex: new Array("小王子", "小公主"),
       
       //孩子年龄
       babyBirth: new Date().getFullYear() + '-' + (new Date().getMonth()+1) + '-' + new Date().getDate(),
       startDate:'2005-01-01',
       endDate:new Date()
    },
    onLoad: function () {
        var that = this;
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=User&a=getUserInfo&id=' + app.globalData.userId).replace(/\s+/g, ""),
            header:{
                'content-type':'application/json'
            },
            success: function (res) {
                that.setData({
                    userInfo : res.data[0],
                    babyName : res.data[0]["babyName"],
                    babySex : res.data[0]["babySex"] ? res.data[0]["babySex"]:0,
                    babyBirth: res.data[0]["babyBirth"] ? res.data[0]["babyBirth"] : new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
                })
                
            }
        })
        this.setData({
            loading: false
        })
    },

    onShow:function(){
        this.onLoad();
    },

    //设置宝贝姓名
    setBabyName:function(e){
        this.setData({
            babyName: e.detail.value
        })
    },

    //设置宝贝的性别
    setBabySex:function(e){
        //切换宝贝性别
        this.setData({
            babySex: e.detail.value
        })
    },

    //设置宝贝的出生日期
    setBirth:function(e){
        this.setData({
            babyBirth: e.detail.value
        })
    },

    //修改个人信息
    alertInfo:function(e){
        var that = this
        saveFormIds.save(e.detail.formId);
        wx.request({
            url: (app.globalData.apiUrl + '?m=home&c=User&a=alertBabyInfo&id=' + app.globalData.userId + '&babyName=' + that.data.babyName+'&babySex='+that.data.babySex+"&babyBirth="+that.data.babyBirth).replace(/\s+/g, ""),
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data == "success"){
                    wx.showModal({
                        title: '提醒',
                        content: '修改宝贝信息成功！',
                        showCancel:false,
                        success:function(res){
                            if(res.confirm){
                                wx.navigateBack({
                                    delta:1
                                })
                            }
                        }
                    })
                }else{
                    wx.showModal({
                        title: '提醒',
                        content: '修改失败，请重试！',
                        showCancel: false
                    })
                }

            }
        })
    }
})
