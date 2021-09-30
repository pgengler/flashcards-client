import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionNewSetRoute extends Route {
  @service store;

  model() {
    let collection = this.modelFor('collection');
    return this.store.createRecord('card-set', {
      collection,
    });
  }

  @action
  willTransition() {
    let cardSet = this.modelFor(this.routeName);
    if (cardSet.isNew) {
      cardSet.rollbackAttributes();
    }
  }
}
