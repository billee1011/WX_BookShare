// pages/waitingPay/waitingPay.js
var app = getApp()
import { $wuxPrompt } from '../../components/wux'
const sliderWidth = 96
Page({

  /**
   * 页面的初始数据
   */
  data: {
      phoneInfo: app.globalData.phoneInfo
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      wx.request({
          url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getWaitingPay&userId=' + app.globalData.userId).replace(/\s+/g, ""),
          method: "GET",
          header: {
              'content-type': 'application/json'
          },
          success: function (res) {
              console.log(res.data)
              if (res.data == "noPay") {
                  $wuxPrompt.init('msg1', {
                      title: '空空如也',
                      text: '您还没有未支付的图书！',
                  }).show()
                  that.setData({
                      returnBack: ""
                  })
              } else {
                  that.setData({
                      returnBack: res.data
                  })
              }
          },
          fail: function () {
              wx.showToast({
                  title: '获取数据失败，请稍后重试！',
                  image: '../../images/fail.png',
                  duration: 2000
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

  openPay:function(e){
      var sharingId = e.currentTarget.dataset.sharingid;
      var ownerId = e.currentTarget.dataset.ownerid;
      wx.navigateTo({
          url: '../pay/pay?sharingId=' + sharingId + "&ownerId=" + ownerId,
      })
  },

  openMore: function (e) {
      var canShareId = e.currentTarget.dataset.canshareid;
      var that = this

      if (canShareId != that.data.currentCanShare) {
          that.setData({
              currentCanShare: canShareId
          })
      } else {
          that.setData({
              currentCanShare: false
          })
      }
  },

})