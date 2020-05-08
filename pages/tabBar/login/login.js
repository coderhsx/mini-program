// pages/login/login.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    options: {},
    isShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isShow: true
    });
    this.login().then(() => {
      /** 登陆成功 */
      this.getSetting();
    }, () => {
      wx.showToast({
        icon: "none",
        title: '未知错误，请稍后重试!',
      });
    }).catch(() => {
      /** 登陆失败 */
      wx.showToast({
        icon: "none",
        title: '网络错误，请稍后重试!',
      });
    });
  },

  login: function () {
    return new Promise((resolve, reject) => {
      // 登录
      wx.login({
        success: _res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          if (_res.code) {
            let _this = this;
            wx.request({
              url: `${app.globalData.host}/service/miniprogram/jscode2session`,
              method: "post",
              data: {
                code: _res.code,
              },
              success(res) {
                if (res.data.code === 200) {
                  res.data.result = res.data.result || {};
                  app.globalData.memberAuthorization = res.data.result.memberAuthorization;
                  app.globalData.memberToken = res.data.result.memberToken;
                  resolve();
                } else {
                  wx.showToast({
                    icon: "none",
                    title: res.data.msg,
                  });
                }
              },
              fail(res) {
                reject()
              }
            })
          } else {
            reject();
          }
        },
        fail: () => {
          reject();
        }
      })
    })
  },

  /**
   * 判断用户是否授权
   */
  getSetting: function () {
    let self = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {//已授权 更新信息
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo;
              self.updateUserInfo(res.userInfo);
            }
          })
        } else {//未授权，直接跳转页面
          self.navigate();
        }
      }
    })
  },

  /**
   * 更新用户信息
   */
  updateUserInfo: function (userInfo) {
    let self = this;
    let data = {
      avatarUrl: userInfo.avatarUrl,
      gender: userInfo.gender,
      language: userInfo.language,
      nickName: userInfo.nickName
    };
    wx.request({
      url: `${app.globalData.host}/service/miniprogram/updateUserInfo`,
      method: 'POST',
      data: data,
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'memberAuthorization': app.globalData.memberAuthorization
      },
      success(res) {
        self.navigate();
      },
      fail(error) {
        wx.showToast({
          title: error.errMsg || "",
          icon: 'none'
        })
      }
    })
  },

  //根据路由参数跳转到不同页面
  navigate() {
    let { navType, redirectUrl} = this.data.options;
    navType = navType || "tab";
    redirectUrl = redirectUrl || "/pages/tabBar/index/index";
    if (navType === "tab") {
      wx.switchTab({
        url: redirectUrl,
      });
    } else {
      wx.redirectTo({
        url: decodeURIComponent(redirectUrl),
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },


})