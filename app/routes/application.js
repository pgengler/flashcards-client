import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CollectionsShowRoute extends Route {
  @service store;

  model() {
    // preload collections, so they can appear in the top nav correctly
    return this.store.findAll('collection');
  }
}
