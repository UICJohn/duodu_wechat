import { request } from './utils'
import eventHub from './eventHub';
import wepy from '@wepy/core';

const fetchTokenHeader = () =>{
  return new Promise((resolve, reject) => {
    wepy.wx.getStorage({key: 'accessToken'})
      .then(res => resolve({
        'content-type': 'application/json',
        'Accept':'*/*',
        'Authorization': res.data
      })).catch( (err) => {
        eventHub.$emit('auth-user', err);
      })
  })
}

const authenticate = () => {
  return new Promise((resolve, reject) => { 
    wepy.wx.login().then((res) => {
      request({
        url: BASE_URL + '/users/wechat_auth',
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
        url: BASE_URL + "/v1/verification_code",
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
        url: BASE_URL + "/v1/profiles/update_email",
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
        url: BASE_URL + "/v1/suburbs",
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
        url: BASE_URL + "/v1/profiles/update_phone",
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
        url: BASE_URL + "/v1/posts/" + post_id + "/upload_images",
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
        url: BASE_URL + "/v1/profiles",
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
        url: BASE_URL + '/v1/profiles',
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
        url: BASE_URL + "/v1/schools",
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
        url: BASE_URL + '/v1/posts',
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

const fetchPosts = (filters = {}) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header)=>{
      request({
        url: BASE_URL + '/v1/posts',
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


const fetchPost = (id) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header)=>{
      request({
        url: BASE_URL + '/v1/posts/' + id,
        header: header,
        method: 'GET'
      }).then(res => {
        console.log(res);
        resolve(res.data.post);
      })
    })
  })
}

const fetchSubways = (city) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: BASE_URL + '/v1/subways',
        data: {region: city},
        header: header,
        method: 'GET'
      }).then(res => {
        resolve(res.data.subways);
      }).catch(err => {
        reject(err);
      })
    })
  })
}

const likePost = (post_id, like = true) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      let url = like ? "/v1/posts/"+post_id+"/like" :  "/v1/posts/"+post_id+"/dislike"
      let method = like ? "POST" : "DELETE"
      request({
        url: BASE_URL + url,
        header: header,
        method: method
      }).then(res => {
        resolve(res.data.subways);
      }).catch(err => {
        reject(err);
      })
    })
  }) 
}

const postComment = (postId, comment) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: BASE_URL + '/v1/post_comments',
        header: header,
        method: 'POST',
        data: {
          comment: {
            post_id: postId,
            body: comment
          }
        }
      }).then(res => {
        console.log(res);
        resolve(res);
      }).catch(err => {
        reject(err);
      })
    })
  })
}

const replyComment = (commentId, comment) => {
  return new Promise((resolve, reject) => {
    fetchTokenHeader().then((header) => {
      request({
        url: BASE_URL + '/v1/post_comments/' + commentId + '/reply',
        header: header,
        method: 'POST',
        data: {
          comment: {
            body: comment
          }
        }
      }).then(res => {
        resolve(res);
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
  fetchPosts: fetchPosts,
  fetchPost: fetchPost,
  fetchSuburbs: fetchSuburbs,
  fetchSubways: fetchSubways,
  likePost: likePost,
  postComment: postComment,
  replyComment: replyComment
}