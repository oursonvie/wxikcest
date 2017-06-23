// import promise
var util = require('./utils/util')

// import promise
var Promise = require('./libs/es6-promise')

// turn wx methods into promise
var wxLogin = util.wxPromisify(wx.login)
var wxGetUserInfo = util.wxPromisify(wx.getUserInfo)
var wxRequest = util.wxPromisify(wx.request)
var wxCheckSession = util.wxPromisify(wx.checkSession)


//app.js
App({
  onLaunch: function () {
    // console.log('onLaunch')
  },
  getID: function() {
    var that = this

    return new Promise((resolve, reject) => {
      // if meteor id exist, return meteor id, else wxlogin
      if (this.globalData.meteorId) {
        resolve(this.globalData.meteorId)
      } else {
        wxLogin()
        .then(res => {
          if (res.code) {
            wxRequest({
              url:'https://tonny.xjtudlc.com/api/wx/test/login',
              data: {
                code:res.code
              }
            })
            .then( res => {
              // console.log(res.data)
              resolve(res.data.meteorId)
              that.globalData.meteorId = res.data.meteorId
            })
          }
        })
      }
    })

  },
  getUserInfo: function () {
    var that = this

    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
      } else {
        wxLogin()
        .then(wxGetUserInfo)
        .then( res => {
          that.globalData.userInfo = res.userInfo

          // send user info to meteor

          this.getID()
          .then(meteorId => {
            wxRequest({
              url:'https://tonny.xjtudlc.com/api/wx/test/userInfo',
              data: {
                meteorId:meteorId,
                userInfo:res.userInfo
              }
            })
          })

          resolve(res.userInfo)
        })
      }
    })

  },
  updateBindInfo: function () {
    var that = this

    return new Promise((resolve, reject) => {
      this.getID()
      .then(res => {
        wxRequest({
          url:'https://tonny.xjtudlc.com/api/wx/test/bindInfo',
            data: {
              meteorId:res,
            }
        })
        .then(res => {
          // console.log(res.data.bindInformation)
          that.globalData.bindInfomation = res.data.bindInfomation
          resolve(res)
        })
      })
    })

  },
  globalData:{
    userInfo:null,
    meteorId:null,
    bindInfomation:null
  }
})
