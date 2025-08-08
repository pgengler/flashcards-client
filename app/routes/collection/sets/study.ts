import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import type CardSet from 'flashcards/models/card-set';
import { hash } from 'rsvp';

type CollectionsSetsStudyRouteParams = { id: string };
export type CollectionSetsStudyRouteModel = {
  cardSet: CardSet;
};

export default class CollectionStudySetRoute extends Route {
  @service declare store: Store;

  model({ id }: CollectionsSetsStudyRouteParams): Promise<CollectionSetsStudyRouteModel> {
    return hash({
      cardSet: <Promise<CardSet>>this.store.findRecord('card-set', id, {
        include: 'cards',
      }),
    });
  }
}
