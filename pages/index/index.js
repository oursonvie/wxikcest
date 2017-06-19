// import promise
var util = require('../../utils/util')

var wxCheckSession = util.wxPromisify(wx.checkSession)

var app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    bindInfomation: {}
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this

    /*

    // proise call get userInfo
    app.getUserInfo().then(function (res) {
      that.setData({
        userInfo:res.userInfo
      })
    }).catch(function (err) {
      console.log(err)
    })

    */

  },
  onShow: function() {
    var that = this

    console.log('onShow')



    /*
    // check session
    app.getSession()
      .then( res => {
        console.log(res)
      })

      */


    app.getUserInfo()
    .then( res => {
      // console.log(res)
      that.setData({
        userInfo:res.userInfo
      })
    })


    app.updateBindInformation()
    .then(res => console.log(res))



  }
})
