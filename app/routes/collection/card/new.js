import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class extends Route {
  @service store;

  model() {
    let collection = this.modelFor('collection');
    return this.store.createRecord('card', {
      collection,
    });
  }
}
