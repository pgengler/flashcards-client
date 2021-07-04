import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionsShowRoute extends Route {
  @service currentCollection;
  @service store;

  model({ slug }) {
    return this.store.peekAll('collection').findBy('slug', slug);
  }

  afterModel(collection) {
    this.currentCollection.currentCollection = collection;
  }

  @action
  willTransition() {
    this.currentCollection.currentCollection = null;
  }
}
