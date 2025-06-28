import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class CollectionManageSetsRoute extends Route {
  @service store;

  model(params) {
    return this.store.findRecord('card-set', params.id, {
      include: 'cards',
    });
  }
}
