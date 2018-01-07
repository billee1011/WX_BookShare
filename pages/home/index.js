// pages/home/index.js
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
      wx.request({
          url: 'http://openapi.nanchangmama.com/make_post/',
          data: {
              'userName': '武妝妝',
              'userAvatar': 'http://static.dryeam.com/testIcon.jpg',
              'qrImg': 'http://static.dryeam.com/qrimg.jpg',
              'backGroundImg': 'http://static.dryeam.com/20170815112219.jpg',
              'textColor': { 'B': 45, 'R': 123, 'G': 9 }
          },
          method: 'POST',
          header:{
              'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (data) {
              console.log(data.data)
          },
          complete: function () {
              wx.hideLoading()
          },
          fail: function () {
              wx.hideLoading();
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
  
  }
})