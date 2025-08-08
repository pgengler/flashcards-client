import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type { CollectionRouteModel } from 'flashcards/routes/collection';
import type Card from 'flashcards/models/card';
import type RouterService from '@ember/routing/router-service';

export type CollectionRandomCardRouteModel = {
  card: Card;
};

export default class CollectionRandomCardRoute extends Route {
  @service declare router: RouterService;

  model() {
    const { collection } = <CollectionRouteModel>this.modelFor('collection');
    if (collection.cards.length > 0) {
      const cards = collection.cards;
      const pos = Math.floor(Math.random() * cards.length);
      return { card: cards[pos] };
    }
    return null;
  }

  redirect(model: CollectionRandomCardRouteModel | null) {
    if (!model) {
      const { collection } = <CollectionRouteModel>this.modelFor('collection');
      this.router.transitionTo('collection.card.new', collection.slug);
    }
  }
}
