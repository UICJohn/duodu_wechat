import Vuex from '@wepy/x';

export default new Vuex.Store({

  state: {
    authencated: false,
    location: {
      city: '北京市',
      district: '朝阳区',
      id: '110000'
    },
  },

  mutations: {
    setLocation (state, locaiton ) {
      state.location = location
    },
  },

  actions: {

  }

});
