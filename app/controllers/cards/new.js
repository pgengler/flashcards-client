import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class CardsNewController extends Controller {
  front = null;
  back = null;

	@action create(event) {
    event.preventDefault();
		let card = this.store.createRecord('card', {
			front: this.front,
			back: this.back
		});
		card.save().then(() => {
			this.transitionToRoute('cards.show', card.id);
		});
	}
}
