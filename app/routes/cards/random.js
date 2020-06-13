import Route from '@ember/routing/route';

export default class CardsRandomRoute extends Route {
	queryParams = {
		side: { reload: true }
	};

	model(params) {
		this.side = params.side;
		return this.store.findAll('card');
	}

	redirect(cards) {
		let pos = Math.floor(Math.random() * cards.length);
		let card = cards[pos];
		let side = this.side;
		if (side) {
			this.transitionTo('cards.show', card.id, { queryParams: { side } });
		} else {
			this.transitionTo('cards.show', card.id);
		}
	}
}
