import eventHub from './eventHub';
import wepy from '@wepy/core';

const MAXRETRY = 3;

const fetchTokenHeader = () =>{
  let data = wx.getStorageSync('accessToken')
  if (!data){
    eventHub.$emit('auth-user', err);
    return false
  }
  return data
};

const requestHeader = (authRequire = true) => {
  return new Promise((resolve, reject) => {
    let header = {
      'content-type': 'application/json',
      'Accept':'*/*'
    }

    if (authRequire == true) {
      let authHeader = fetchTokenHeader()
      authHeader ? resolve({ ...header, 'Authorization': authHeader }) : reject({error: 'Token not found'})
    } else {
      resolve(header);
    }
  })
}

const numberValidator = (min, max) =>{
  return (v) => {
    let valid = true, num = Number(v);
    if (isNaN(num)) {
      valid = false;
    }
    if (min !== undefined) {
      valid = valid && num >= min;
    }
    if (max !== undefined) {
      valid = valid && num <= max;
    }
    return valid;
  };
};

const stringToBoolean = () =>{
  return (v) => {
    if (typeof v === 'string' && (v === '0' || v === 'false'))
      return false;
    return !!v;
  };
};

const request = (options, authRequire = true) => {
  return new Promise((resolve, reject) => {
    sendRequest(options, authRequire).then( (res) => {
      resolve(res)
    }).catch((err) => {
      eventHub.$emit('wx-error', err);
      reject(err)
    })
  });
};


const sendRequest = (options, authRequire, retryCount = 0) => {
  return new Promise((resolve, reject) => {
    if (retryCount == MAXRETRY) {
      reject('Reach Max Retry Times')
    } else {
      setTimeout(function(){
        requestHeader(authRequire).then( headers => {
          wepy.wx.request({ ...options, header: headers }).then( res => {
            errorHanlder(res).then(res => resolve(res)).catch( err => {
              sendRequest(options, true, retryCount + 1).then(res => resolve(res)).catch((err) => {
                reject(err)
              })
            })
          }).catch(err => eventHub.$emit('wx-error', err))
        }).catch(err => eventHub.$emit('wx-error', err))
      }, retryCount * 2000);
    }
  })
}

const errorHanlder = (res) => {
  return new Promise((resolve, reject) => {
    if (res.statusCode === 401){
      eventHub.$emit('auth-user');
      reject(res);
    } else if([400, 404, 422, 500].includes(res.statusCode)){
      eventHub.$emit('bad-request', res);
      // reject(res);
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
      avatar_url: userInfo.avatarUrl
    }
    return user_info
  }
  return false
}

module.exports = {
  userMapping: userMapping,
  request: request,
  numberValidator: numberValidator,
  stringToBoolean: stringToBoolean 
}