import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class IndexRoute extends Route {
  @service router;
  @service store;

  model() {
    return this.store.findAll('card');
  }

  redirect(cards) {
    if (cards.length === 0) {
      this.router.transitionTo('cards.new');
    } else {
      this.router.transitionTo('cards.random');
    }
  }
}
