// import promise
var util = require('../../utils/util')

var wxCheckSession = util.wxPromisify(wx.checkSession)
var wxRequest = util.wxPromisify(wx.request)
var wxShowModal = util.wxPromisify(wx.showModal)

var app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    bindInfomation: {},
    status: {},
    email: {}
  },
  onLoad: function () {
    // console.log('onLoad')
    var that = this

    app.getID()
    .then(res => {
      // console.log('index calling getID ' + res)
      // console.log('globalData: ' + app.globalData.meteorId)
    })

    app.getUserInfo()
    .then(res => {
      that.setData({
        userInfo:res
      })
    })

  },
  onShow: function() {
    // console.log('onShow')
    var that = this

    app.updateBindInfo()
    .then(res => {

      var bindInfomation = res.data.bindInformation

      console.log(res.data.bindInformation)

      if(bindInfomation.vertified) {

        that.setData({
          status: 'Vertified'
        })

      } else if (bindInfomation.email) {

        that.setData({
          email:bindInfomation.email
        })

        that.setData({
          status: 'Pending'
        })

        console.log('email address entered')
      } else {

        that.setData({
          status: 'Init'
        })

      }
      console.log('status: ' + this.data.status)
    })

  },
  pushBindInformation: function(e) {
    var that = this
    var email = e.detail.value.bindingInformation.toLowerCase();

    app.getID()
    .then(res => {

      wxRequest({
        url:'https://tonny.xjtudlc.com/api/wx/test/accountbind',
        data: {
          meteorId:res,
          email:email
        }
      })
      .then(res => {
        console.log(res)

        if (res.data.err) {
          wxShowModal({
            content: res.data.err,
            showCancel: false,
          })
          .then(res => {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          })
        }

      })
      .then(this.onShow)

    })
    console.log('email: ' + email)
  },
  pushPassphase: function(e) {
    var that = this
    var passphase = e.detail.value.passphaseInput.toLowerCase();

    app.getID()
    .then(res => {

      wxRequest({
        url:'https://tonny.xjtudlc.com/api/wx/test/emailVertify',
        data: {
          meteorId:res,
          passphase:passphase
        }
      })
      .then(res => {
        console.log(res)

        if (res.data.err) {
          wxShowModal({
            content: res.data.err,
            showCancel: false,
          })
          .then(res => {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          })
        }
      })
      .then(this.onShow)

    })
  },
  goback: function() {
    var that = this
    that.setData({
      status:'Init'
    })
  }
})
