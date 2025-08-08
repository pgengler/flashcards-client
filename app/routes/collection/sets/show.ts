import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type CardSet from 'flashcards/models/card-set';
import { hash } from 'rsvp';

type CollectionSetsShowRouteParams = { id: string };
export type CollectionSetsShowRouteModel = {
  cardSet: CardSet;
};

export default class CollectionShowSetRoute extends Route {
  @service declare store: Store;

  model({ id }: CollectionSetsShowRouteParams): Promise<CollectionSetsShowRouteModel> {
    return hash({
      cardSet: <Promise<CardSet>>this.store.findRecord('card-set', id, {
        include: 'cards',
      }),
    });
  }
}
