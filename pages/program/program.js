// import promise
var util = require('../../utils/util')
var Promise = require('../../libs/es6-promise')

// import config
const studentProgramUrl = require('../../config').studentProgramUrl
const checkinUrl = require('../../config').checkinUrl


var wxRequest = util.wxPromisify(wx.request)
var wxGetLocation = util.wxPromisify(wx.getLocation)

var app = getApp()


Page({
  data: {
    meteorId:{},
    programs:{},
    checked:{},
    err:{},
    errMsg:{}
  },
  onLoad: function(options) {
    // console.log('program page onLoad')
  },
  onShow: function () {
    this.getPrograms().then(res => {
      // console.log(res)
    })
  },
  getPrograms: function() {
    var that = this

    return new Promise((resolve, reject) => {

      app.getID().then(res => {

        wxRequest({
          url: studentProgramUrl,
          data: {
            meteorId: res
          }
        }).then(res => {
          resolve(res)
          console.log(res)

          if(res.data.err) {
            that.setData({
              err:true,
              errMsg:res.data.err
            })
          } else {
            that.setData({
              err:false,
              programs:res.data.programs,
              checked:res.data.checked
            })
          }
        })

      })


    })
  },
  checkin: function(e) {

    var that = this

    app.getID().then(meteorId => {
      wxGetLocation().then(location => {
        this.getPrograms().then(programs => {

          wxRequest({
            url: checkinUrl,
            data: {
              meteorId:meteorId,
              courseId:programs.data.programs[0].course[0].courseId,
              location:location
            }
          }).then(res => {
            // console.log(res)
            this.getPrograms().then(res => (console.log('checkin status updated')))
          })
        })
      })
    })


  }
})
