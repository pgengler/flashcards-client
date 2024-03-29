import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionRoute extends Route {
  @service currentCollection;
  @service router;
  @service store;

  async model({ slug }) {
    let result = await this.store.query('collection', {
      filter: { slug },
      include: 'cards,card-sets',
    });
    return result.firstObject;
  }

  afterModel(collection) {
    if (collection) {
      this.currentCollection.currentCollection = collection;
    } else {
      this.router.transitionTo('collections.index');
    }
  }

  @action
  willTransition(transition) {
    if (!transition.to.name.startsWith('collection.')) {
      this.currentCollection.currentCollection = null;
    }
  }
}
