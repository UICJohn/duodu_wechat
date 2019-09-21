import eventHub from './eventHub';
import wepy from '@wepy/core';

const request = (options) => {
  return new Promise((resolve, reject) => {
    wepy.wx.request({ ...options }).then((res) => {
      errorHanlder(res).then((res) => {
        resolve(res)
      })
    }).catch((err) => {
      eventHub.$emit('wx-error', err);
      reject(err)
    })
  });
};

const errorHanlder = (res) => {
  return new Promise((resolve, reject) => {
    if (res.statusCode === 401){
      eventHub.$emit('auth-user');
      eventHub.$emit('server-error', res);
      reject(res);
    } else if([400, 404, 422, 500].includes(res.statusCode)){
      eventHub.$emit('bad-request', res);
      reject(res);
    } else {
      resolve(res);
    }
  })
}

const userMapping = (userInfo) => {
  if (userInfo && userInfo.nickName) {
    let user_info = {
      username: userInfo.nickName,
      gender: userInfo.gender,
      city: userInfo.city,
      province: userInfo.province,
      country: userInfo.country,
      avatar_url: userInfo.avatarUrl
    }
    return user_info
  }
  return false
}

module.exports = {
  userMapping: userMapping,
  request: request
}