var app = getApp()

// pages/newAuth/newAuth.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        apiUrl: app.globalData.apiUrl,
        agree:true,//默认选中我已详细阅读并同意协议
    },

    //打开教职工认证页面
    openTeacherAuth:function(){
        var that = this;
        if (that.data.agree == false) {
            wx.showModal({
                title: '提示',
                content: '请勾选同意下方的服务协议，即可认证哦！',
                showCancel: false
            })
            return;
        }
        wx.navigateTo({
            url: '../toAuth/toAuth',
        })
    },

    //打开普通用户认证
    openCommonAuth:function(){
        var that = this;
        if(that.data.agree == false){
            wx.showModal({
                title: '提示',
                content: '请勾选同意下方的服务协议，即可认证哦！',
                showCancel:false
            })
            return ;
        }
        wx.navigateTo({
            url: '../commonAuth/commonAuth',
        })
    },

    haveAgree:function(e){
        var that = this;
        that.setData({
            agree: !that.data.agree
        })
    },

    //打开协议
    openAgreement:function(){
        wx.navigateTo({
            url: '../agreement/agreement',
        })
    }

})