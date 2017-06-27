// import promise
var util = require('../../utils/util')
var Promise = require('../../libs/es6-promise')

// import config
const adminProgramUrl = require('../../config').adminProgramUrl
const wxCourseSelect = require('../../config').wxCourseSelect

var wxRequest = util.wxPromisify(wx.request)

var app = getApp()

Page({


  data: {
    programs: {}
  },
  onLoad: function (options) {

  },
  onShow: function() {

    this.getAdminProgram()

  },
  getCourseId: function(e) {

    var courseId = e.currentTarget.id


    app.getID().then(res => {
      console.log(res)

      wxRequest({
        url: wxCourseSelect,
        data: {
          meteorId: res,
          courseId: courseId
        }
      }).then(res => {
        this.getAdminProgram()
      })
    })


  },
  getAdminProgram: function() {
    var that = this

    return new Promise((resolve, reject) => {
      app.getID().then(res => {
        wxRequest({
          url: adminProgramUrl,
          data: {
            meteorId: res
          }
        }).then(res => {
          //console.log(res)
          that.setData({
            programs:res.data.programs
          })
          resolve(res)
        }).catch(err => {
          reject(err)
        })
      })
    })
  },
  onPullDownRefresh: function(){
    this.getAdminProgram().then(res => {
      wx.stopPullDownRefresh()
    })
  }
})
