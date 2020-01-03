import { request } from './utils'
import eventHub from './eventHub';
import wepy from '@wepy/core';

const authenticate = () => {
  return new Promise((resolve, reject) => { 
    wepy.wx.login().then((res) => {
      request({
        url: BASE_URL + '/users/wechat_auth',
        method: 'POST',
        data: { code: res.code }
      }, false).then((res) => {
        resolve(res)
      }).catch((err) => {
        eventHub.$emit('wx-error', err);
        reject(err);
      })
    }).catch((err) => { 
      eventHub.$emit('wx-error', err);
      reject(err);
    })
  });
}

const sendCode = (data) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + "/v1/verification_code",
      method:'POST',
      data: data,
      header: header
    }).then((res) => {
      resolve(res);
    })
  })
}

const updateEmail = (data) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + "/v1/profiles/update_email",
      method: 'PUT',
      data: data,
      header: header
    }).then(res => {
      resolve(res);
    })
  })
}

const fetchSuburbs = (region) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + "/v1/suburbs",
      method: 'GET',
      data: {region: region},
      header: header
    }).then(res => {
      resolve(res.data.suburbs)
    })
  })
}

const updatePhone = (data) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + "/v1/profiles/update_phone",
      method: 'PUT',
      data: data,
      header: header
    }).then(res => {$
      resolve(res);
    })
  })
}

const uploadPostImage = (post_id, image_path, data={}) => {
  return new Promise((resolve, reject) => { 
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
}

const updateUser = (profiles) => {
  return new Promise((resolve, reject) => {    
    request({
      url: BASE_URL + "/v1/profiles",
      data: {profiles: profiles},
      method: 'PUT'
    }).then((res) => {
      resolve(res);
    })
  })

}

const fetchUser = () => {
  return new Promise((resolve, reject) => {    
    request({
      url: BASE_URL + '/v1/profiles',
      method: 'GET'
    }).then((res) => {
      resolve(res)
    }).catch((err)=>{
      eventHub.$emit('wx-error', err)
    })
  })
}

const fetchSchools = (key) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + "/v1/schools",
      data: {key: key},
      method: 'GET'
    }).then(res => {
      resolve(res.data.schools);
    }).catch(res => {
      reject(res);
    })
  })
}

const createPost = (data) => {
  return new Promise((resolve, reject)=>{
    request({
      url: BASE_URL + '/v1/posts',
      data: { post: data },
      method: 'POST'
    }).then(res => {
      resolve(res.data.post);
    }).catch(err => {
      reject(err);
    })
  })
}

const fetchPosts = (filters = {}) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + '/v1/posts',
      method: 'GET'
    }).then(res => {
      resolve(res.data.posts);
    }).catch(err => {
      reject(err);
    })
  })
}


const fetchPost = (id) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + '/v1/posts/' + id,
      method: 'GET'
    }).then(res => {
      resolve(res.data.post);
    })
  })
}

const fetchSubways = (city) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + '/v1/subways',
      data: {region: city},
      method: 'GET'
    }).then(res => {
      resolve(res.data.subways);
    }).catch(err => {
      reject(err);
    })
  })
}

const likePost = (post_id, like = true) => {
  return new Promise((resolve, reject) => {
    let url = like ? "/v1/posts/"+post_id+"/like" :  "/v1/posts/"+post_id+"/dislike"
    let method = like ? "POST" : "DELETE"
    request({
      url: BASE_URL + url,
      method: method
    }).then(res => {
      resolve(res.data.subways);
    }).catch(err => {
      reject(err);
    })
  })
}

const postComment = (postId, comment) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + '/v1/post_comments',
      method: 'POST',
      data: {
        comment: {
          post_id: postId,
          body: comment
        }
      }
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    })
  })
}

const replyComment = (commentId, comment) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + '/v1/post_comments/' + commentId + '/reply',
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
}


const fetchSurvey = (survey_name) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + '/v1/report_posts/survey',
      method: 'get',
      data: { survey_name: survey_name }
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
    })
  })
}

const sendSurvey = (data) => {
  return new Promise((resolve, reject) => {
    request({
      url: BASE_URL + '/v1/report_posts',
      method: 'POST',
      data: data
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      reject(err);
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
  replyComment: replyComment,
  fetchSurvey: fetchSurvey,
  sendSurvey: sendSurvey
}