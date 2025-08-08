import Route from '@ember/routing/route';
import type Card from 'flashcards/models/card';
import type { CollectionRouteModel } from 'flashcards/routes/collection';

type CollectionShowCardRouteParams = { id: string };
export type CollectionShowCardRouteModel = {
  card: Card;
};

export default class CollectionShowCardRoute extends Route {
  model({ id }: CollectionShowCardRouteParams): CollectionShowCardRouteModel {
    const { collection } = <CollectionRouteModel>this.modelFor('collection');
    return {
      card: collection.cards.find((card) => card.id === id)!,
    };
  }
}
