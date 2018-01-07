// map.js
var app = getApp()
Page({
    data: {
        markers: [{
            iconPath: "/resources/others.png",
            id: 0,
            latitude: 23.099994,
            longitude: 113.324520,
            width: 50,
            height: 50
        }],
        polyline: [{
            points: [{
                longitude: 113.3245211,
                latitude: 23.10229
            }, {
                longitude: 113.324520,
                latitude: 23.21229
            }],
            color: "#FF0000DD",
            width: 2,
            dottedLine: true
        }],
        controls: [{
            id: 1,
            iconPath: '/resources/location.png',
            position: {
                left: 0,
                top: 300 - 50,
                width: 50,
                height: 50
            },
            clickable: true
        }]
    },
    onLoad:function(){
        var that = this
        that.getPilot();
    },
    regionchange(e) {
        console.log(e.type)
    },
    markertap(e) {
        console.log(e.markerId)
    },
    controltap(e) {
        console.log(e.controlId)
    },
    getPilot:function(){
        // wx.showLoading({
        //     title: '加载中',
        // })
        var that = this;
        var url = (app.globalData.apiUrl + '?m=home&c=Api&a=getPilotMap').replace(/\s+/g, "")
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
                        markers: dataObj,
                    })

                }
                wx.hideLoading()
            }
        })
    },
})