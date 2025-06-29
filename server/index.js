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
  console.log('loading proxies...');
  try {
    var globSync = require('glob').globSync;
    console.log(__dirname);
    console.log(globSync('./proxies/**/*.js', { cwd: __dirname }));
    const paths = globSync('./proxies/**/*.js', { cwd: __dirname }).map((p) => path.join(__dirname, p));
    console.log(paths);

  var proxies = paths.map(require);


  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));

  proxies.forEach(function (route) {
    route(app);
  });
} catch (e) {
  console.error(e);
}
};
