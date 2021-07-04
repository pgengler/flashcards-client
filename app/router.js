import EmberRouter from '@ember/routing/router';
import config from 'flashcards/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('cards', function () {
    this.route('new');
    this.route('random');
    this.route('show', { path: '/:id' });
  });
  this.route('card-sets', { path: '/sets' }, function () {
    this.route('new');
  });

  this.route('collections', function () {
    this.route('new');
    this.route('show', { path: '/:slug' });
  });
});
