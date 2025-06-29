// To use it create some files under `mocks/`
// e.g. `server/mocks/ember-hamsters.js`
//
// module.exports = function(app) {
//   app.get('/ember-hamsters', function(req, res) {
//     res.send('hello');
//   });
// };

const path = require('path');

module.exports = function (app) {
  const globSync = require('glob').globSync;
  const paths = globSync('./proxies/**/*.js', { cwd: __dirname }).map((p) => path.join(__dirname, p));

  const proxies = paths.map(require);

  // Log proxy requests
  const morgan = require('morgan');
  app.use(morgan('dev'));

  proxies.forEach(function (route) {
    route(app);
  });
};
