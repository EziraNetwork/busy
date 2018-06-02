import http from 'http';
import app from './app';

const server = http.createServer(app);
let currentApp = app;

require('dotenv').config();


server.listen(process.env.SSR_PORT || 3457, () => console.log(`SSR started on ${process.env.SSR_PORT}`));

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./app', () => {
    console.log('🔁  HMR Reloading `./app`...');
    server.removeListener('request', currentApp);
    const newApp = require('./app').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}
