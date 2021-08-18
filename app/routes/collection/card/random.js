import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CollectionRandomRoute extends Route {
  @service router;

  model() {
    let collection = this.modelFor('collection');
    if (collection.cards.length > 0) {
      let cards = collection.cards;
      let pos = Math.floor(Math.random() * cards.length);
      return cards.toArray()[pos];
    }
    return null;
  }

  redirect(model) {
    if (!model) {
      let collection = this.modelFor('collection');
      this.router.transitionTo('collection.card.new', collection.slug);
    }
  }
}
