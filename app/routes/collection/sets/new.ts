import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type CardSet from 'flashcards/models/card-set';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

export type CollectionSetsNewRouteModel = {
  cardSet: CardSet;
};

export default class CollectionNewSetRoute extends Route {
  @service declare store: Store;

  model(): CollectionSetsNewRouteModel {
    const { collection } = <CollectionRouteModel>this.modelFor('collection');
    return {
      cardSet: <CardSet>this.store.createRecord('card-set', {
        collection,
      }),
    };
  }

  @action
  willTransition() {
    const { cardSet } = <CollectionSetsNewRouteModel>this.modelFor(this.routeName);
    if (cardSet.isNew) {
      cardSet.rollbackAttributes();
    }
  }
}
