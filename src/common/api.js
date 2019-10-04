import { request } from './utils'
import eventHub from './eventHub';
import wepy from '@wepy/core';

// console.log(wepy);
const host = 'http://192.168.31.224:3000'


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
        method:'POST',
        data: data,
        header: header
      }).then((res) => {
        resolve(res);
      })
    })
  })
}


const updateEmail = (data) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: host + "/v1/profiles/update_email",
        method: 'PUT',
        data: data,
        header: header
      }).then(res => {
        resolve(res);
      })
    })
  })
}

const fetchSuburbs = (region) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: host + "/v1/suburbs",
        method: 'GET',
        data: {region: region},
        header: header
      }).then(res => {
        resolve(res.data.suburbs)
      })
    })
  })
}

const updatePhone = (data) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: host + "/v1/profiles/update_phone",
        method: 'PUT',
        data: data,
        header: header
      }).then(res => {$
        resolve(res);
      })
    })
  })
}

const uploadPostImage = (post_id, image_path, data={}) => {
  return new Promise((resolve, reject) => { 
    fetchTokenHeader().then((header) => {
      wepy.wx.uploadFile({
        url: host + "/v1/posts/" + post_id + "/post/upload_images",
        filePath: image_path,
        name: 'attachment',
        formData: data,
        header: header
      }).then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
    })
  })
}

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

const fetchSchools = (key) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: host + "/v1/schools",
        header: header,
        data: {key: key},
        method: 'GET'
      }).then(res => {
        resolve(res.data.schools);
      }).catch(res => {
        reject(res);
      })
    })
  })
}

const createPost = (data) => {
  return new Promise((resolve, reject)=>{
    fetchTokenHeader().then((header) => {
      request({
        url: host + '/v1/posts',
        header: header,
        data: { post: data },
        method: 'POST'
      }).then(res => {
        resolve(res.data.post);
      }).catch(err => {
        reject(err);
      })
    })
  })
}

const fetchPost = (filters = {}) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header)=>{
      request({
        url: host + '/v1/posts',
        header: header,
        method: 'GET'
      }).then(res => {
        resolve(res.data.posts);
      }).catch(err => {
        reject(err);
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
  sendCode: sendCode,
  updateEmail: updateEmail,
  updatePhone: updatePhone,
  uploadPostImage: uploadPostImage,
  fetchPost: fetchPost,
  fetchSuburbs: fetchSuburbs
}