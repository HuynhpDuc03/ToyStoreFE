const path = require('path');

module.exports = {
  devServer: {
    allowedHosts: 'all', // or specify the hostname you want to allow access
    proxy: {
      '/api': {
        target: 'https://toystorebe.onrender.com',
        changeOrigin: true,
      },
    },
  },
};