import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';

export default class ApplicationRoute extends Route {
  @service declare store: Store;

  beforeModel() {
    // preload collections, so they can appear in the top nav correctly
    return this.store.findAll('collection');
  }
}
