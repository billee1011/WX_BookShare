// pages/stock/stock.js
//加载插件
// var wxCharts = require('wxcharts.js');
var app = getApp()
Page({
    data: {},

    onLoad: function (options) {

        //建立连接
        wx.connectSocket({
            url: "ws://127.0.0.1:1234",
        })

        //连接成功
        wx.onSocketOpen(function () {
            wx.sendSocketMessage({
                data: 136,
            })
        })

        //接收数据
        wx.onSocketMessage(function (data) {
            // var objData = JSON.parse(data.data);
            console.log(data);
            
        })

        //连接失败
        wx.onSocketError(function () {
            console.log('websocket连接失败！');
        })
    },

    setValue:function(e){
        var that = this
        that.setData({
            value:e.detail.value
        })
        that.sendMessage()
    },

    sendMessage:function(){
        var that = this
        wx.sendSocketMessage({
            data: that.data.value,
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
        })
    }
})