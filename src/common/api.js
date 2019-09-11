import { request } from './utils'
import eventHub from './eventHub';
import wepy from '@wepy/core';

// console.log(wepy);
const host = 'http://192.168.31.224:3000'

const authenticate = () => {
  return new Promise((resolve, reject) => { 
    wepy.wx.login().then((res) => {
      request({
        url: host + '/users/wechat_auth',
        method: 'POST',
        data: { code: res.code }
      }).then((res) => {
        resolve(res)
      })
    }).catch((err) => { 
      eventHub.$emit('wx-error', err);
      reject(err);
    })
  });
}

module.exports = {
  authenticate: authenticate
}