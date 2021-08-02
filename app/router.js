import EmberRouter from '@ember/routing/router';
import config from 'flashcards/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('collections', function () {
    this.route('new');
  });

  this.route('collection', { path: 'collection/:slug' }, function () {
    this.route('list');
    this.route('study');

    this.route('card', function () {
      this.route('new');
      this.route('random');
      this.route('show', { path: '/:id' });
    });

    this.route('sets', function () {
      this.route('new');
      this.route('show', { path: '/:id' });
      this.route('manage', { path: '/:id/manage' });
      this.route('study', { path: '/:id/study' });
    });
  });
});
