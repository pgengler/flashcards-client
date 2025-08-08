import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import type Store from '@ember-data/store';
import type CurrentCollectionService from 'flashcards/services/current-collection';
import type Collection from 'flashcards/models/collection';

type CollectionRouteParams = { slug: string };
export type CollectionRouteModel = {
  collection: Collection;
};

export default class CollectionRoute extends Route {
  @service declare currentCollection: CurrentCollectionService;
  @service declare router: RouterService;
  @service declare store: Store;

  async model({ slug }: CollectionRouteParams) {
    const result = await this.store.query('collection', {
      filter: { slug },
      include: 'cards,card-sets',
    });
    return { collection: result[0]! };
  }

  afterModel({ collection }: CollectionRouteModel) {
    if (collection) {
      this.currentCollection.currentCollection = collection;
    } else {
      this.router.transitionTo('collections.index');
    }
  }

  @action
  willTransition(transition: Transition) {
    if (!transition.to?.name.startsWith('collection.')) {
      this.currentCollection.currentCollection = null;
    }
  }
}
