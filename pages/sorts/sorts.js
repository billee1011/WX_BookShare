// pages/sorts/sorts.js
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
      var url = ('https://' + app.globalData.apiUrl + '?m=home&c=Api&a=getSorts').replace(/\s+/g, "")
      wx.request({
          url: url,
          method: "GET",
          dataType: "json",
          success: function (res) {
              if (res.data == "none") {
                  wx.showToast({
                      title: '暂无分类',
                      image: '../../images/warning.png',
                      duration: 2000
                  })
              } else {
                  that.setData({
                      sortsIDArray: res.data["ID"],
                      sortsNameArray: res.data["sort_name"]
                  })
              }
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