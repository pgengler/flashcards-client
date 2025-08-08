import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type Collection from 'flashcards/models/collection';

export type CollectionsNewRouteModel = {
  collection: Collection;
};

export default class CollectionsNewRoute extends Route {
  @service declare store: Store;

  model(): CollectionsNewRouteModel {
    return {
      collection: <Collection>this.store.createRecord('collection', {}),
    };
  }

  @action
  willTransition() {
    const { collection } = <CollectionsNewRouteModel>this.modelFor(this.routeName);
    if (collection.isNew) {
      collection.rollbackAttributes();
    }
  }
}
