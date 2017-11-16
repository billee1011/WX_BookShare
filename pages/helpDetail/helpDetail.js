// pages/helpDetail/helpDetail.js
Page({
  data:{text:''},
  btn_good:function(){  
      this.setData({text:'solved'});
  },
  btn_bad:function(){
      this.setData({text:'unsolved'});
  }
})