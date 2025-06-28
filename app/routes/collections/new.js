import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class CollectionsNewRoute extends Route {
  @service store;

  model() {
    return this.store.createRecord('collection');
  }

  @action
  willTransition() {
    let collection = this.modelFor(this.routeName);
    if (collection.isNew) {
      collection.rollbackAttributes();
    }
  }
}
