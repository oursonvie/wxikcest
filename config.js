/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

var host = "https://tonny.xjtudlc.com"

var config = {

    // 下面的地址配合云端 Server 工作
    host,

    // 登录地址，用于建立会话
    loginUrl: `${host}/api/wx/login`,

    userInfoUrl: `${host}/api/wx/userinfo`,

    bindInfomationUrl: `${host}/api/wx/bindInfo`,

    studentProgramUrl: `${host}/api/wx/studentprogram`,

    checkinUrl: `${host}/api/wx/checkin`,

    accountbindUrl: `${host}/api/wx/accountbind`,

    emailVertifyUrl: `${host}/api/wx/emailVertify`,


};

module.exports = config
