import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type Card from 'flashcards/models/card';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

export type CollectionNewCardRouteModel = {
  card: Card;
};

export default class CollectionNewCardRoute extends Route {
  @service declare store: Store;

  model(): CollectionNewCardRouteModel {
    const { collection } = <CollectionRouteModel>this.modelFor('collection');
    return {
      card: <Card>this.store.createRecord('card', {
        collection,
      }),
    };
  }

  @action
  willTransition() {
    const { card } = <CollectionNewCardRouteModel>this.modelFor(this.routeName);
    if (card.isNew) {
      card.rollbackAttributes();
    }
  }
}
