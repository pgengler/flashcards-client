import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionRoute extends Route {
  @service currentCollection;
  @service store;

  async model({ slug }) {
    let result = await this.store.query('collection', {
      filter: { slug },
      include: 'cards',
    });
    return result.firstObject;
  }

  afterModel(collection) {
    this.currentCollection.currentCollection = collection;
  }

  @action
  willTransition(transition) {
    if (!transition.to.name.startsWith('collection.')) {
      this.currentCollection.currentCollection = null;
    }
  }
}
