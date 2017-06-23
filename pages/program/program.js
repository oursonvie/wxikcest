// import promise
var util = require('../../utils/util')
var Promise = require('../../libs/es6-promise')

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
          url: 'https://tonny.xjtudlc.com/api/wx/test/studentprogram',
          data: {
            meteorId: res
          }
        }).then(res => {
          resolve(res)

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
            url: 'https://tonny.xjtudlc.com/api/wx/test/checkin',
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
