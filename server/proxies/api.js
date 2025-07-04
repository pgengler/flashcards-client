const proxyPath = '/api';

module.exports = function (app) {
  if (process.env.MIRAGE_ENABLED) return;

  // For options, see:
  // https://github.com/nodejitsu/node-http-proxy
  let proxy = require('http-proxy').createProxyServer({});

  proxy.on('error', function (err, req) {
    console.error(err, req.url);
  });

  app.use(proxyPath, function (req, res /* , next */) {
    // include root path in proxied request
    req.url = `${proxyPath}/${req.url}`;
    proxy.web(req, res, { target: 'http://localhost:3000' });
  });
};
