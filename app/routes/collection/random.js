import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CollectionRandomRoute extends Route {
  @service router;

  redirect() {
    let collection = this.modelFor('collection');
    if (collection.cards.length > 0) {
      let cards = collection.cards;
      let pos = Math.floor(Math.random() * cards.length);
      let card = cards.toArray()[pos];
      // this.intermediateTransitionTo(
      this.router.replaceWith(
        'collection.card.index',
        collection.slug,
        card.id
      );
    } else {
      this.router.transitionTo('collection', collection.slug);
    }
  }
}
