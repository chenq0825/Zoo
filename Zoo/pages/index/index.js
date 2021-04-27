// index.js
// 获取应用实例
const app = getApp()
var WXBizDataCrypt = require('../../utils/WXBizDataCrypt')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: false // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }
  },
  getPhoneNumber: function (e) {
    var that = this;
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      console.log(e.detail.encryptedData);
      console.log(e.detail.iv);

    }
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res1) => {
        var appId = app.globalData.appId
        var appSecret = app.globalData.appSecret
        var code = app.globalData.code
        var grant_type = app.globalData.grant_type
        var encryptedData = res1.encryptedData
        var iv = res1.iv
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
              appid:appId,
              secret:appSecret,
              js_code:code,
              grant_type:grant_type
          },
          header: {
              'content-type':'application/json'
          },
          success: function(res){
            var sessionKey = res.data.session_key
            
            var pc = new WXBizDataCrypt(appId, sessionKey)
            var data = pc.decryptData(encryptedData , iv)
            console.log('解密后 data: ', data)
          }
        })
        console.log("用户信息getUserProfile()");
        console.log(res1)
        this.setData({
          userInfo: res1.userInfo,
          hasUserInfo: true
         
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    var appId = app.globalData.appId
    var appSecret = app.globalData.appSecret
    var code = app.globalData.code
    var grant_type = app.globalData.grant_type
   
    wx.request({
      url: 'https://api.weixin.qq.com/sns/jscode2session',
      data: {
          appid:appId,
          secret:appSecret,
          js_code:code,
          grant_type:grant_type
      },
      header: {
          'content-type':'application/json'
      },
      success: function(res){
        var sessionKey = res.data.session_key
        var encryptedData = e.detail.encryptedData
        var iv = e.detail.iv
        var pc = new WXBizDataCrypt(appId, sessionKey)
        var data = pc.decryptData(encryptedData , iv)
        console.log('解密后 data: ', data)
      }
    })
    

    console.log("用户信息getUserInfo()");
    console.log(e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
