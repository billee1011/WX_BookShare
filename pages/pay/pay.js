// pages/pay/pay.js
var app = getApp();
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
    var sharingId = options.sharingId;
    wx.request({
        url: ('https://' + app.globalData.apiUrl + '?m=home&c=New&a=getNoneReturnDetail&sharingId=' + sharingId).replace(/\s+/g, ""),
        method: "GET",
        header: {
            'content-type': 'application/json',
        },
        success: function (res) {
            that.setData({
                orderDetail:res.data[0]
            })
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
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

  //图片加载
  imageLoad: function (e) {
      console.log(e)
      var $width = e.detail.width,    //获取图片真实宽度
          $height = e.detail.height,
          ratio = $width / $height;    //图片的真实宽高比例
      var viewHeight = 500,           //设置图片显示宽度，左右留有16rpx边距
          viewWidth = 500 * ratio;    //计算的高度值
      var marginLeftWidth = (750 * 0.97 - viewWidth) / 2;
      var image = this.data.images;
      //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
      image = {
          width: viewWidth,
          height: viewHeight,
          marginLeftWidth: marginLeftWidth
      }
      this.setData({
          images: image
      })
  },

  //支付
  pay: function () {
      var that = this
      wx.request({
          url: ('https://' + app.globalData.apiUrl + '?m=home&c=Pay&a=pay').replace(/\s+/g, ""),
          method: 'POST',
          data: {
              total_fee: 1,   /*订单金额*/
              openId: "oWTnu0CyhnBeafnFu4WCfECkf2rs",
              body: "刘鑫测试"
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
})