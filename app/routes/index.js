import Route from '@ember/routing/route';

export default class IndexRoute extends Route {
  model() {
    return this.store.findAll('card');
  }

  redirect(cards) {
    if (cards.length === 0) {
      this.transitionTo('cards.new');
    } else {
      this.transitionTo('cards.random');
    }
  }
}
