import { $wuxButton } from '../../components/wux'
import { $wuxBackdrop } from '../../components/wux'
var utils = require('../../utils/util.js');
var app = getApp()
// pages/home/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        index: 3,
        opened: !1,

        //轮播广告
        imgUrls: [
            app.globalData.advertiseUrl + '/bookshare_svn/uploads/advertisement/3.jpg',
            app.globalData.advertiseUrl + '/bookshare_svn/uploads/advertisement/1.jpg',
            app.globalData.advertiseUrl + '/bookshare_svn/uploads/advertisement/2.jpg',
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 500,
        role: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        this.initButton()
        this.initButtonBorrow();
        this.$wuxBackdrop = $wuxBackdrop.init()
        //加载借书申请、代收书等数量
        wx.request({
            url: ( app.globalData.apiUrl + '?m=home&c=Api&a=getOperateNum&ownerId=' + app.globalData.userId).replace(/\s+/g, ""),
            method: "GET",
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    operateNum: res.data
                })
            },
            fail: function () {
                wx.showToast({
                    title: '获取数据失败，请检查网络配置！',
                    image: '../../images/fail.png',
                    duration: 2000
                })
            }
        })
    },

    onShow: function () {
        this.onLoad()
    },

    /**
     * 别人的借书申请
     */
    borrowApplication: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../borrowApplication/borrowApplication'
        })
    },

    /**
     * 借入
     */
    borrowIn: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../borrowIn/borrowIn'
        })
    },

    //待归还
    returnBack: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../returnBack/returnBack'
        })
    },

    //收书
    getBook: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../getBook/getBook'
        })
    },

    //图书管理
    bookMan: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../bookMan/bookMan'
        })
    },

    screenISBN: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../operateShare/operateShare',

        })
    },

    pilot: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../pilot/pilot'
        })
    },

    openComment: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../bookList/bookList'
        })
    },

    /***********更改后的页面方法*************/
    uploadBook: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../operateUpload/operateUpload',

        })
    },
    borrowBasket: function () {
      if (app.globalData.certificationOk != 2) {
        wx.showModal({
          title: '提示',
          content: '您还没有进行信息认证',
          showCancel: false,
          cancelText: '我知道了'
        })
        return;
      }
        wx.navigateTo({
            url: '../borrowBasket/borrowBasket',

        })
    },
    initButton(position = 'bottomRight') {
        var that = this
        that.setData({
            opened: !1,
        })

        that.button = $wuxButton.init('br', {
            position: position,
            buttons: [
                {
                    label: '生成个人海报',
                    icon: "data:image/png;base64,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",
                },
                // {
                //     label: '操作说明',
                //     icon: "data:image/png;base64,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",
                // },
                {
                    label: '待收回图书',
                    icon: "data:image/png;base64,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",
                }
            ],
            buttonClicked(index, item) {
                if (app.globalData.certificationOk == 2) {

                    index === 0 && wx.navigateTo({
                        url: '/pages/login/login'           //个人图书馆
                    })

                    // index === 1 && wx.navigateTo({
                    //     url: '/pages/operateIntr/operateIntr'//操作说明
                    // })

                    index === 1 && wx.navigateTo({
                        url: '../getBook/getBook'//待收回图书
                    })

                    return true
                } else {
                  wx.showModal({
                    title: '提示',
                    content: '您还没有进行信息认证',
                    showCancel: false,
                    cancelText: '我知道了'
                  })
                    return;
                }
            },
            callback(vm, opened) {
                console.log(opened)
                if (opened) {
                    that.retain()
                } else {
                    that.release()
                }
                vm.setData({
                    opened,
                })
            },
        })
    },

    //借书人更多按钮加载
    initButtonBorrow(position = 'bottomRight') {
        var that = this
        that.setData({
            opened: !1,
        })

        that.button = $wuxButton.init('br2', {
            position: position,
            buttons: [
                {
                    label: '待支付',
                    icon: "data:image/png;base64,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",
                },
                // {
                //     label: '操作说明',
                //     icon: "data:image/png;base64,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",
                // },
                {
                    label: '已借图书',
                    icon: "data:image/png;base64,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",
                }
            ],
            buttonClicked(index, item) {
                if (app.globalData.certificationOk == 2) {

                    index === 0 && that.openWaitingPay() //打开待支付页面

                    // index === 1 && wx.navigateTo({
                    //     url: '/pages/operateIntr/operateIntr'//操作说明
                    // })
                    index === 1 && wx.navigateTo({
                        url: '../haveBorrowed/haveBorrowed'//已借图书
                    })

                    return true
                } else {
                    wx.showModal({
                        title:'提示',
                        content:'您还没有进行信息认证',
                        showCancel:false,
                        cancelText:'我知道了'
                    })
                    return;
                }
            },
            callback(vm, opened) {
                console.log(opened)
                if (opened) {
                    that.retain()
                } else {
                    that.release()
                }
                vm.setData({
                    opened,
                })
            },
        })
    },

    switchChange(e) {
        e.detail.value ? this.button.open() : this.button.close()
    },
    pickerChange(e) {
        const index = e.detail.value
        const position = this.data.types[index]
        this.initButton(position)
    },

    //打开我的图书页面
    openMyBook: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
            })
            return;
        }
        wx.navigateTo({
            url: '../myBook/myBook',
        })
    },

    //切换角色
    changeRole: function () {
        var that = this
        that.setData({
            role: !that.data.role
        })
    },

    //切换至待归还页面
    openToReturn: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../returnBack/returnBack'
        })
    },

    openWaitingPay: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.navigateTo({
            url: '../waitingPay/waitingPay'
        })
    },

    //打开tabbar我要借书
    toBorrowed: function () {
        if (app.globalData.certificationOk != 2) {
          wx.showModal({
            title: '提示',
            content: '您还没有进行信息认证',
            showCancel: false,
            cancelText: '我知道了'
          })
            return;
        }
        wx.switchTab({
            url: '../index/index'
        });
    },
    retain() {
        this.$wuxBackdrop.retain()
        this.setData({
            locks: this.$wuxBackdrop.backdropHolds
        })
    },
    release() {
        this.$wuxBackdrop.release()
        this.setData({
            locks: this.$wuxBackdrop.backdropHolds
        })
    }

})