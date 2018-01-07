// pages/location/location.js
var event = require('../../utils/event.js')
var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        sort_url: app.globalData.sort_url
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var locationArray = wx.getStorageSync("locationArray")
        that.setData({
            locationArray: locationArray,
            latitude: locationArray.latitude,
            longitude: locationArray.longitude,
            location: locationArray.name,
        })
        that.getPilot();

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
        console.log("hide")
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },


    checkboxChange: function (e) {
        var that = this;
        var selectData = e.detail.value;
        console.log(selectData)
        var array = {};
        var arrayData = selectData.split(',')
        array["pilot_id"]  = arrayData[0];
        array["longitude"] = arrayData[1];
        array["latitude"]  = arrayData[2];
        array["name"] = arrayData[3];
        that.setData({
            locationArray: array,
            location: array["name"]
        })
        wx.setStorageSync("locationArray", that.data.locationArray)
    },

    getPilot:function(){
        wx.showLoading({
            title: '加载中',
        })
        var that = this;
        var url = (app.globalData.apiUrl + '?m=home&c=Api&a=getPilot').replace(/\s+/g, "")
        wx.request({
            url: url,
            data: that.data.locationArray,
            method: "POST",
            header:{
                'content-type': 'application/x-www-form-urlencoded'
            },
            dataType: "json",
            success: function (res) {
                var dataObj = res.data
                if (res.data == "none") {
                    wx.showToast({
                        title: '暂无分类',
                        image: '../../images/warning.png',
                        duration: 2000
                    })
                } else {

                    // event.emit('Data', dataObj);
                    // for (var i in options) {
                    //     dataObj[options[i] - 1].checked = true;
                    // }
                    that.setData({
                        sortsArray: dataObj,
                    })

                }
                wx.hideLoading()
            }
        })
    },

    chooseLocation: function () {
        var that = this
        wx.chooseLocation({
            success: function (res) {
                that.setData({
                    latitude: res.latitude,
                    longitude: res.longitude,
                    location: res.name,
                    locationArray:res
                })
                wx.setStorageSync("locationArray", that.data.locationArray)
                that.getPilot()
            }
        })
    },
    goback: function () {
        var that = this
        wx.setStorageSync("locationArray", that.data.locationArray)
        wx.navigateBack({
            delta: 1
        })
    }
})