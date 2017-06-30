// import promise
var util = require('../../utils/util')
var Promise = require('../../libs/es6-promise')

// import config
const adminProgramUrl = require('../../config').adminProgramUrl
const wxCourseSelect = require('../../config').wxCourseSelect
const wxLocationSelect = require('../../config').wxLocationSelect
const wxProgramLocation = require('../../config').wxProgramLocation

// change location format
var formatLocation = util.formatLocation

var wxRequest = util.wxPromisify(wx.request)
var wxChooseLocation = util.wxPromisify(wx.chooseLocation)

var app = getApp()

Page({


  data: {
    programs: {}
  },
  onLoad: function (options) {

  },
  onShow: function() {
    console.log('onShow')

    this.getAdminProgram().then(res => {
      // console.log(res)
    })

  },
  getCourseId: function(e) {
    var courseId = e.currentTarget.id

    app.getID().then(res => {
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
  },
  chooseLocation: function(e) {
    var that = this
    wxChooseLocation().then(res => {

      var programId = e.currentTarget.id

      console.log(res)

      console.log(programId)

      app.getID().then(meteorId => {
        wxRequest({
          url:wxLocationSelect,
          data: {
            programId: programId,
            meteorId: meteorId,
            location: res
          }
        }).then(res => {
          this.getAdminProgram()
        })
      })

    })
  }
})
