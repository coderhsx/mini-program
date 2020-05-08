const app = getApp();
let reqCount = 0;
const request = (url, options, extraOption) => {
  let msg = '加载中';
  wx.showLoading({
    title: msg,
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
          } else if (request.data.code === 401){//未登录
            //采用将当前路由作为参数传递到登录页而不直接跳转到登录页
            //避免保存当前页面路由。解决点击返回时，返回到当前页面的BUG
            let currentPage = getCurrentPages().pop();
            let navType = "nav";
            let params = "?";
            let options = currentPage.options;
            let tabList = [
              "pages/tabBar/index/index",
              "pages/tabBar/mine/mine"
            ];
            if (tabList.indexOf(currentPage.route) > -1){
              navType = "tab";
            }
            params += Object.keys(options).map((key) => key + "=" + options[key]).join("&");
            wx.redirectTo({
              url: `/pages/tabBar/login/login?navType=${navType}&redirectUrl=/${encodeURIComponent(currentPage.route + params)}`,
            })
          } else {
            if (showToast) {
              setTimeout(() => {
                wx.showToast({
                  title: (request.data || {}).msg || "",
                  icon: 'none',
                  duration: 3000,
                  mask: true
                })
              }, 500)
            }
            reject(request.data);
          }
        } else if (request.statusCode == 401) {
          // wx.navigateTo({
          //   url: '/pages/authorize/authorize',
          // });
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