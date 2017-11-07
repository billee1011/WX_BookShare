// //login.js 登录
// //获取应用实例
var app = getApp()
var detailList = [
    { datetime: '2017-01-01 17:00', count: 100, unit: 'ml', type: '开水', remark: '哈哈哈哈', book_image:'https://img3.doubanio.com/lpic/s24551042.jpg',book_name:'冒险大王邓肯',location:"计算机科学与软件学院" },
    { datetime: '2017-01-01 17:01', count: 100, unit: 'ml', type: '开水', book_image: 'https://img3.doubanio.com/lpic/s24551042.jpg', book_name: '冒险大王邓肯', location: "计算机科学与软件学院"  },
    { datetime: '2017-01-01 17:02', count: 100, unit: 'ml', type: '开水', book_image: 'https://img3.doubanio.com/lpic/s24551042.jpg', book_name: '冒险大王邓肯', location: "计算机科学与软件学院"  }
];
var recordStartX = 0;
var currentOffsetX = 0;
Page(
    {
        data: {
            detailList: detailList,
            phoneInfo: app.globalData.phoneInfo,
        }
        ,
        recordStart: function (e) {
            recordStartX = e.touches[0].clientX;
            currentOffsetX = this.data.detailList[0].offsetX;
            console.log('start x ', recordStartX);
        }
        ,
        recordMove: function (e) {
            var detailList = this.data.detailList;
            var item = detailList[0];
            var x = e.touches[0].clientX;
            var mx = recordStartX - x;
            console.log('move x ', mx);

            var result = currentOffsetX - mx;
            if (result >= -80 && result <= 0) {
                item.offsetX = result;
            }
            this.setData({
                detailList: detailList
            });
        }
        ,
        recordEnd: function (e) {
            var detailList = this.data.detailList;
            var item = detailList[0];
            console.log('end x ', item.offsetX);

            if (item.offsetX < -40) {
                item.offsetX = -80;

            } else {
                item.offsetX = 0;

            }
            this.setData({
                detailList: detailList
            });
        }

    }
);

// pages/leftSwiperDel/index.js  

// var initdata = function (that) {
//     var list = that.data.list
//     for (var i = 0; i < list.length; i++) {
//         list[i].txtStyle = ""
//     }
//     that.setData({ list: list })
// }

// Page({
//     data: {
//         delBtnWidth: 180,//删除按钮宽度单位（rpx）  
//         list: [
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },
//             {
//                 txtStyle: "",
//                 icon: "/images/qcm.png",
//                 txt: "指尖快递"
//             },

//         ]
//     },
//     onLoad: function (options) {
//         // 页面初始化 options为页面跳转所带来的参数  
//         this.initEleWidth();
//     },
//     onReady: function () {
//         // 页面渲染完成  
//     },
//     onShow: function () {
//         // 页面显示  
//     },
//     onHide: function () {
//         // 页面隐藏  
//     },
//     onUnload: function () {
//         // 页面关闭  
//     },
//     touchS: function (e) {
//         if (e.touches.length == 1) {
//             this.setData({
//                 //设置触摸起始点水平方向位置  
//                 startX: e.touches[0].clientX
//             });
//         }
//     },
//     touchM: function (e) {
//         var that = this
//         initdata(that)
//         if (e.touches.length == 1) {
//             //手指移动时水平方向位置  
//             var moveX = e.touches[0].clientX;
//             //手指起始点位置与移动期间的差值  
//             var disX = this.data.startX - moveX;
//             var delBtnWidth = this.data.delBtnWidth;
//             var txtStyle = "";
//             if (disX == 0 || disX < 0) {//如果移动距离小于等于0，文本层位置不变  
//                 txtStyle = "left:0px";
//             } else if (disX > 0) {//移动距离大于0，文本层left值等于手指移动距离  
//                 txtStyle = "left:-" + disX + "px";
//                 if (disX >= delBtnWidth) {
//                     //控制手指移动距离最大值为删除按钮的宽度  
//                     txtStyle = "left:-" + delBtnWidth + "px";
//                 }
//             }
//             //获取手指触摸的是哪一项  
//             var index = e.target.dataset.index;
//             var list = this.data.list;
//             list[index].txtStyle = txtStyle;
//             //更新列表的状态  
//             this.setData({
//                 list: list
//             });
//         }
//     },

//     touchE: function (e) {
//         if (e.changedTouches.length == 1) {
//             //手指移动结束后水平位置  
//             var endX = e.changedTouches[0].clientX;
//             //触摸开始与结束，手指移动的距离  
//             var disX = this.data.startX - endX;
//             var delBtnWidth = this.data.delBtnWidth;
//             //如果距离小于删除按钮的1/2，不显示删除按钮  
//             var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
//             //获取手指触摸的是哪一项  
//             var index = e.target.dataset.index;
//             var list = this.data.list;
//             list[index].txtStyle = txtStyle;
//             //更新列表的状态  
//             this.setData({
//                 list: list
//             });
//         }
//     },
//     //获取元素自适应后的实际宽度  
//     getEleWidth: function (w) {
//         var real = 0;
//         try {
//             var res = wx.getSystemInfoSync().windowWidth;
//             var scale = (750 / 2) / (w / 2);//以宽度750px设计稿做宽度的自适应  
//             // console.log(scale);  
//             real = Math.floor(res / scale);
//             return real;
//         } catch (e) {
//             return false;
//             // Do something when catch error  
//         }
//     },
//     initEleWidth: function () {
//         var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
//         this.setData({
//             delBtnWidth: delBtnWidth
//         });
//     },
//     //点击删除按钮事件  
//     delItem: function (e) {
//         var that = this
//         wx.showModal({
//             title: '提示',
//             content: '是否删除？',
//             success: function (res) {
//                 if (res.confirm) {
//                     //获取列表中要删除项的下标  
//                     var index = e.target.dataset.index;
//                     var list = that.data.list;
//                     //移除列表中下标为index的项  
//                     list.splice(index, 1);
//                     //更新列表的状态  
//                     that.setData({
//                         list: list
//                     });
//                 } else {
//                     initdata(that)
//                 }
//             }
//         })

//     }

// })  