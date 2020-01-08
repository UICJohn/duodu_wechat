import { request, requestHeader } from './utils'
import eventHub from './eventHub';
import wepy from '@wepy/core';

const fetchUnreadNotificationsCount = () => {
  return new Promise((resolve, reject) => { 
    request({
      url: BASE_URL + '/v1/notifications/unread_count',
      method: 'GET'      
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err);
    })
  });
}

const connectCable = () => {
  return new Promise((resolve, reject) => {
    requestHeader().then(headers => {
      wx.connectSocket({
        url: SOCKET_URL,
        header: headers,
        method: "GET",
        success: function(res){
          resolve(res);
        },
        fail: function(err) {
          reject(err)
        }
      })
    })
  })
}

const subscribe = (channel, params={}) => {
  return new Promise((resolve, reject) => {
    wx.sendSocketMessage({
      data: JSON.stringify({
        command: "subscribe",
        identifier: JSON.stringify({ channel: channel, ...params })
      }),
      success: function(res) {
        resolve(res)
      },
      fail: function(err) {
        reject(err);
      }
    })
  })
}


const msgRouter = (data) => {
  console.log(data);
  let channel = JSON.parse(data.identifier).channel
  console.log(channel);
  if (channel === 'NotificationChannel' && data.message){
    eventHub.$emit('new-notification', data.message)
  }
}

const setNotificationBadge = (count) => {
  // if (count < 10) {
  wx.setTabBarBadge({ index: 2, text: String(count) });
  // } else {
  //   wx.showTabBarRedDot({ index: 2 });
  // }
}

const removeNotificationBadge = () => {
  wx.removeTabBarBadge({index: 2})
}
// wx.onSocketMessage(function(res){
//   console.log(res);
// })
// wx.onSocketClose(function(res){
//   console.log("连接已关闭")
//   console.log(res)
// })
// wx.onSocketError(function(err){
//   console.log("打开连接失败")
//   console.log(err)
// })
 

module.exports = {
  connectCable: connectCable,
  subscribe: subscribe,
  msgRouter: msgRouter,
  setNotificationBadge: setNotificationBadge,
  removeNotificationBadge: removeNotificationBadge,
  fetchUnreadNotificationsCount: fetchUnreadNotificationsCount
}