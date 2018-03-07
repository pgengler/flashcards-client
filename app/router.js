import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('cards', function() {
    this.route('new');
    this.route('random', { path: '/random'} );
    this.route('show', { path: '/:id' });
  });
  this.route('card-sets', { path: '/sets' }, function() {
    this.route('new');
  });
});

export default Router;
