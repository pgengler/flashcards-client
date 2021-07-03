import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CardsRandomRoute extends Route {
  @service router;
  @service store;

  queryParams = {
    side: { reload: true },
  };

  model(params) {
    this.side = params.side;
    return this.store.findAll('card');
  }

  redirect(cards) {
    let pos = Math.floor(Math.random() * cards.length);
    let card = cards.toArray()[pos];

    if (!card) {
      this.router.transitionTo('cards.new');
      return;
    }

    let side = this.side;
    if (side) {
      this.router.transitionTo('cards.show', card.id, {
        queryParams: { side },
      });
    } else {
      this.router.transitionTo('cards.show', card.id);
    }
  }
}
