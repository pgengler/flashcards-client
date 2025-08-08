import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type CardSet from 'flashcards/models/card-set';
import { hash } from 'rsvp';

type CollectionSetsManageRouteParams = { id: string };
export type CollectionSetsManageRouteModel = {
  cardSet: CardSet;
};

export default class CollectionSetsManageRoute extends Route {
  @service declare store: Store;

  model({ id }: CollectionSetsManageRouteParams): Promise<CollectionSetsManageRouteModel> {
    return hash({
      cardSet: <Promise<CardSet>>this.store.findRecord('card-set', id, {
        include: 'cards',
      }),
    });
  }
}
