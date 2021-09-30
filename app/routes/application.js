import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service flashMessages;
  @service store;

  beforeModel() {
    // preload collections, so they can appear in the top nav correctly
    return this.store.findAll('collection');
  }

  model() {
    return this.flashMessages;
  }
}
