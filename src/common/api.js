import { request } from './utils'
import eventHub from './eventHub';
import wepy from '@wepy/core';

// console.log(wepy);
const host = 'http://192.168.1.32:3000'


const fetchTokenHeader = () =>{
  return new Promise((resolve, reject) => {
    wepy.wx.getStorage({key: 'accessToken'})
      .then(res => resolve({
        'content-type': 'application/json',
        'Accept':'*/*',
        'Authorization': res.data
      })).catch(err => eventHub.$emit('wx-error', err))
  })
}

const authenticate = () => {
  return new Promise((resolve, reject) => { 
    wepy.wx.login().then((res) => {
      request({
        url: host + '/users/wechat_auth',
        method: 'POST',
        data: { code: res.code },
        header: {'content-type': 'application/json'}
      }).then((res) => {
        resolve(res)
      })
    }).catch((err) => { 
      eventHub.$emit('wx-error', err);
      reject(err);
    })
  });
}

const sendCode = (data) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: host + "/v1/verification_code",
        method:'POST'
        data: data,
        header: header
      }).then((res) => {
        resolve(res);
      })
    })
  })
}

// const sentEmailCode = (email) => {
//   return new Promise((resolve, reject) => { 
//     fetchTokenHeader().then((header) => {
//       request({
//         url: host 
//       })
//     })
//   })
// }

const updateUser = (profiles) => {
  return new Promise((resolve, reject) => {    
    fetchTokenHeader().then((header) => {
      request({
        url: host + "/v1/profiles",
        data: {profiles: profiles},
        header: header,
        method: 'PUT'
      }).then((res) => {
        resolve(res);
      }).catch((res) => {
        reject(res);
      })
    })
  })

}

const fetchUser = () => {
  return new Promise((resolve, reject) => {    
    fetchTokenHeader().then((header) => {
      request({
        url: host + '/v1/profiles',
        header: header,
        method: 'GET'
      }).then((res) => {
        resolve(res)
      }).catch((err)=>{
        eventHub.$emit('wx-error', err)
      })
    })
  })
}

const createPost = (data) => {
  return new Promise((resolve, reject) => {
    request({
      url: host + ''
    })
  })
}

const fetchSchools = (key) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: host + "/v1/schools",
        header: header,
        data: {key: key},
        method: 'GET'
      }).then((res) => {
        resolve(res.data.schools);
      }).catch((res) => {
        reject(res);
      })
    })
  })
}

module.exports = {
  authenticate: authenticate,
  createPost: createPost,
  fetchUser: fetchUser,
  updateUser: updateUser,
  fetchSchools: fetchSchools,
}