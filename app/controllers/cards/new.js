import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CardsNewController extends Controller {
  @service router;

  @tracked front;
  @tracked back;

  @action create(event) {
    event.preventDefault();
    let card = this.store.createRecord('card', {
      front: this.front,
      back: this.back,
    });
    card.save().then(() => {
      this.router.transitionTo('cards.show', card.id);
    });
  }
}
