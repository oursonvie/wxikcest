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
    console.log('onLaunch')
  },
  getUserInfo:function(){
    var that = this
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
      } else {
        wxGetUserInfo()
        .then( res => {
          that.globalData.userInfo = res.userInfo
          resolve(res)
        })
        .catch( err => {
          reject(err)
        })
      }
    })
  },
  getSession: function(){
    var that = this

    return new Promise((resolve, reject) => {

      if (this.globalData.session) {
        resolve(this.globalData.session)
      } else {
        wxLogin()
        .then( res => {
          if(res.code) {

            // exchange jscode to meteor session code
            wxRequest({
              url:'https://tonny.xjtudlc.com/api/wx/test/login',
              data: {
                code:res.code
              }
            })
            .then( res => {

              that.globalData.session = res.data.session
              resolve(res.data.session)

            })
            .catch( err => {
              console.log(err)
              reject(err)
            })

          }
        })
        .catch( err => {
          console.log(err)
          reject(err)
        })
      }

    })
  },
  updateBindInformation: function() {
    var that = this
    console.log('update called')

    return new Promise((resolve, reject) => {
      this.getSession()
      .then(res => {
        console.log('session: ' + res)

        wxRequest({
          url:'https://tonny.xjtudlc.com/api/wx/test/bindInfo',
          data: {
            session:res
          }
        })
        .then( res => {
          resolve(res)
        })

      })
      .catch(err => reject(err))
    })

  },
  globalData:{
    userInfo:null,
    session:null,
    bindInfomation:null
  }
})
