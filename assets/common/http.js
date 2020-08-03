const app = getApp();
let reqCount = 0;//唯一“加载中”标识，避免同一页面多个请求时，“加载中”闪烁问题
const request = (url, options, extraOption = {msg:"加载中"}) => {
  wx.showLoading({
    title: extraOption.msg,
  });
  reqCount++;
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${app.globalData.host}${url}`,
      method: options.method,
      data: options.method === 'GET' ? options.data : JSON.stringify(options.data),
      header: {
        'Content-Type': 'application/json; charset=UTF-8',
        'memberAuthorization': app.globalData.memberAuthorization
      },
      success(request) {
        if (request.statusCode == 200) {
          if (request.data.code === 200) {
            resolve(request.data)
          } else if (request.data.code === 401) { //未登录
            wx.redirectTo({
              url: `/pages/tabBar/login/login`,
            })
          } else {
            wx.showToast({
              title: (request.data || {}).msg || "",
              icon: 'none',
              duration: 3000,
              mask: true
            })
            reject(request.data);
          }
        } else {
          wx.showToast({
            title: "请求出错",
            icon: 'none',
            duration: 3000,
            mask: true
          });
          reject();
        }
      },
      fail(error) {
        wx.showToast({
          title: "请求超时",
          icon: 'none',
          duration: 3000,
          mask: true
        });
        reject(error.data);
      },
      complete() {
        reqCount--;
        if (!reqCount) {
          wx.hideLoading();
        }
      }
    })
  })
}

const get = (url, data = {}, option) => {
  return request(url, {
    method: 'GET',
    data: data
  }, option)
}

const post = (url, data, option) => {
  return request(url, {
    method: 'POST',
    data: data
  }, option)
}

const put = (url, data, option) => {
  return request(url, {
    method: 'PUT',
    data: data
  }, option)
}

// 不能声明DELETE（关键字）
const remove = (url, data, option) => {
  return request(url, {
    method: 'DELETE',
    data: data
  }, option)
}

module.exports = {
  get,
  post,
  put,
  remove
}