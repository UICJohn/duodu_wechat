import { request } from './utils'
import eventHub from './eventHub';
import wepy from '@wepy/core';

// console.log(wepy);


let QQMapWX = require('./qqmap-wx-jssdk.min.js');
 
// 实例化API核心类
let qqmapsdk = new QQMapWX({
  key: 'JOSBZ-BQF66-UWJSP-M6TNG-SPBZQ-O7BS4'
})


const getLocationByGeo = (des) => {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: [des.latitude,des.longitude].join(","),
      success: function(res){
        resolve(res);
      },
      fail: function(err){
        reject(err);
      }
    })
  });
}

module.exports = {
  getLocationByGeo: getLocationByGeo
}