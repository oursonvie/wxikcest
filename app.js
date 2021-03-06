// import promise
var util = require('./utils/util')
var Promise = require('./libs/es6-promise')

// import config
const loginUrl = require('./config').loginUrl
const userInfoUrl = require('./config').userInfoUrl
const bindInfomationUrl = require('./config').bindInfomationUrl

// turn wx methods into promise
var wxLogin = util.wxPromisify(wx.login)
var wxGetUserInfo = util.wxPromisify(wx.getUserInfo)
var wxRequest = util.wxPromisify(wx.request)
var wxCheckSession = util.wxPromisify(wx.checkSession)


//app.js
App({
  onLaunch: function () {
    // console.log(loginUrl)
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
              url:loginUrl,
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
              url:userInfoUrl,
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
          url:bindInfomationUrl,
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
