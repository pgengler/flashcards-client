import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class CollectionNewCardRoute extends Route {
  @service store;

  model() {
    let collection = this.modelFor('collection');
    return this.store.createRecord('card', {
      collection,
    });
  }

  @action
  willTransition() {
    let card = this.modelFor(this.routeName);
    if (card.isNew) {
      card.rollbackAttributes();
    }
  }
}
