var app = getApp()
module.exports = {
    save:save,
    sendPushTemplete: sendPushTemplete
}

//保存formId方法
function save(formId){
    var that = this;
    var userID = app.globalData.userId;
    var postData = {
        user_id: userID,
        form_id: formId,
        expire: parseInt(new Date().getTime() / 1000) + 604800
    }
    wx.request({
        url: (app.globalData.apiUrl + '?m=home&c=Api&a=saveFormIds').replace(/\s+/g, ""),
        method: "POST",
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: postData,
        success: function (res) {
           console.log(res.data) 
        },
        fail: function () {
            wx.showToast({
                title: '获取数据失败，请检查网络配置！',
                image: '../../images/fail.png',
                duration: 2000
            })
        }
    })
}

//formData 包括touser、form_id
function sendPushTemplete(formData){
    wx.request({
        url: (app.globalData.apiUrl + '?m=home&c=Push&a=pushTemplate').replace(/\s+/g, ""),
        data: formData,
        method: "POST",
        header: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
            console.log(res.data)
        }
    })
}
