const path = require('path');
var prod = process.env.NODE_ENV === 'production';
var staging = process.env.NODE_ENV === 'staging';
const definePlugin = require('@wepy/plugin-define');

module.exports = {
  wpyExt: '.wpy',
  eslint: true,
  cliLogs: !prod,
  build: {
  },
  resolve: {
    alias: {
      assets: path.join(__dirname, 'assets'),
      components: path.join(__dirname, 'src/components'),
      '@': path.join(__dirname, 'src')
    },
    aliasFields: ['wepy', 'weapp'],
    modules: ['node_modules']
  },
  compilers: {
    less: {
      compress: (prod || staging)
    },
    babel: {
      sourceMap: true,
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
        '@wepy/babel-plugin-import-regenerator'
      ]
    }
  },
  static: "/assets",
  plugins: [
    definePlugin({
      BASE_URL: JSON.stringify(staging ? 'http://47.92.125.75' : 'http://192.168.31.224:3000'),
      SOCKET_URL: JSON.stringify(staging ? 'ws://47.92.125.75/cable' : 'ws://192.168.31.224:3000/cable'),
    })
  ],
  appConfig: {
    noPromiseAPI: ['createSelectorQuery']
  },
}