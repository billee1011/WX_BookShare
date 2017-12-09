var app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        // wx.request({
        //     url: ( app.globalData.apiUrl + '?m=home&c=Pay&a=getPay').replace(/\s+/g, ""),
        //     method: 'POST',
        //     data: {
        //         bookingNo: that.data.sharingId,  /*订单号*/
        //         total_fee: that.data.bookInfo.price,   /*订单金额*/
        //         openid: app.globalData.openId,
        //         sign:"2123123",
        //     },
        //     header: {
        //         'content-type': 'application/json'
        //     },
        //     success: function (res) {
        //         wx.requestPayment({
        //             'timeStamp': JSON.stringify(Date.parse(new Date())),
        //             'nonceStr': '123123dsdasdasdas',
        //             'package': 'prepay_id=123',
        //             'signType': 'MD5',
        //             'paySign': '12324123',
        //             'success': function (res) {
        //                 console.log(res);
        //             },
        //             'fail': function (res) {
        //                 console.log('fail:' + JSON.stringify(res));
        //             }
        //         })
        //     },
        //     fail: function (err) {
        //         console.log(err)
        //     }
        // })
    },

    pay:function(){
        var that = this
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Pay&a=pay').replace(/\s+/g, ""),
            method: 'POST',
            data: {
                total_fee: 1,   /*订单金额*/
                openId: "oWTnu0CyhnBeafnFu4WCfECkf2rs",
                body:"刘鑫测试"
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log(res);
                wx.requestPayment({
                    'timeStamp': res.data['out_trade_no'],
                    'nonceStr': res.data['nonceStr'],
                    'package': res.data["package"],
                    'signType': 'MD5',
                    'paySign': res.data["paySign"],
                    'success': function (res) {
                        console.log("支付成功，要处理的内容");
                    },
                    'fail': function (res) {
                        console.log('fail:' + JSON.stringify(res));
                    }
                })
            },
            fail: function (err) {
                console.log(err)
            }
        })
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

    //当前时间戳
    getNowTime:function(){
        return JSON.stringify(Date.parse(new Date()));
    },

    //生成随机的32位字符串
    makeRandomChar:function(){

    }




























    // paysignjs: function (appid, nonceStr, package1, signType, timeStamp) {
    //     var ret = {
    //         appId: appid,
    //         nonceStr: nonceStr,
    //         package1: package1,
    //         signType: signType,
    //         timeStamp: timeStamp
    //     };
    //     var string1 = raw1(ret);
    //     string1 = string1 + '&key=' + key;
    //     console.log(string1);
    //     var crypto = require('crypto');
    //     return crypto.createHash('md5').update(string1, 'utf8').digest('hex');
    // },

    // raw1: function (args) {
    //     var keys = Object.keys(args);
    //     keys = keys.sort()
    //     var newArgs = {};
    //     keys.forEach(function (key) {
    //         newArgs[key] = args[key];
    //     });

    //     var string = '';
    //     for (var k in newArgs) {
    //         string += '&' + k + '=' + newArgs[k];
    //     }
    //     string = string.substr(1);
    //     return string;
    // },

    // paysignjsapi: function (appid, attach, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type) {
    //     var ret = {
    //         appid: appid,
    //         attach: attach,
    //         body: body,
    //         mch_id: mch_id,
    //         nonce_str: nonce_str,
    //         notify_url: notify_url,
    //         openid: openid,
    //         out_trade_no: out_trade_no,
    //         spbill_create_ip: spbill_create_ip,
    //         total_fee: total_fee,
    //         trade_type: trade_type
    //     };
    //     var string = raw(ret);
    //     string = string + '&key=' + key;
    //     var crypto = require('crypto');
    //     return crypto.createHash('md5').update(string, 'utf8').digest('hex');
    // },

    // raw: function (args) {
    //     var keys = Object.keys(args);
    //     keys = keys.sort()
    //     var newArgs = {};
    //     keys.forEach(function (key) {
    //         newArgs[key.toLowerCase()] = args[key];
    //     });

    //     var string = '';
    //     for (var k in newArgs) {
    //         string += '&' + k + '=' + newArgs[k];
    //     }
    //     string = string.substr(1);
    //     return string;
    // },

    // getXMLNodeValue: function (node_name, xml) {
    //     var tmp = xml.split("<" + node_name + ">");
    //     var _tmp = tmp[1].split("</" + node_name + ">");
    //     return _tmp[0];
    // }

})