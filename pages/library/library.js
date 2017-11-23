var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      phoneInfo: app.globalData.phoneInfo,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this 
      that.setData({
          userId:options.userId
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  openLibrary:function(){
      var that = this 
      wx.redirectTo({
          url: '../login/login?userId=' + that.data.userId,
      })
  }
})