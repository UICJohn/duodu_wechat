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
  if (data.identifier){
    let channel = JSON.parse(data.identifier).channel
    if (channel === 'NotificationChannel' && data.message){
      eventHub.$emit('new-notification', data.message);
    } else if (channel == 'MessageChannel' && data.message){
      eventHub.$emit('new-message', data.message);
    }
  }
}

const setNotificationBadge = (count) => {
  if (count == 0){
    removeNotificationBadge();
  } else {
    wx.setTabBarBadge({ index: 2, text: String(count) });
  }
  // if (count < 10) {
  // } else {
  //   wx.showTabBarRedDot({ index: 2 });
  // }
}

const removeNotificationBadge = () => {
  wx.removeTabBarBadge({index: 2})
}

const fetchRoomId = (messageTo) => {
  return new Promise((resolve, reject) => { 
    request({
      url: BASE_URL + '/v1/chat_room/fetch_room',
      data: { message_to: messageTo },
      method: 'GET'      
    }).then(res => {
      resolve(res.data.room)
    }).catch(err => {
      reject(err);
    })
  });
}

const fetchMessages = (roomId, page = 1) => {
  return new Promise((resolve, reject) => { 
    request({
      url: BASE_URL + '/v1/messages',
      data: { room_id: roomId, page: page },
      method: 'GET'      
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err);
    })
  });
}

const sendMessage = (message, action, channel='MessageChannel') => {
  return new Promise((resolve, reject) => {
    wx.sendSocketMessage({
      data: JSON.stringify({
                            command: 'message',
                            identifier: JSON.stringify({ channel: channel }),
                            data: JSON.stringify({
                                                  action: action,
                                                  message: JSON.stringify(message)
                                                })
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

module.exports = {
  connectCable: connectCable,
  subscribe: subscribe,
  msgRouter: msgRouter,
  setNotificationBadge: setNotificationBadge,  
  fetchUnreadNotificationsCount: fetchUnreadNotificationsCount,
  fetchRoomId: fetchRoomId,
  fetchMessages: fetchMessages,
  sendMessage: sendMessage
}