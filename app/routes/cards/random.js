import Route from '@ember/routing/route';

export default Route.extend({
	queryParams: {
		side: { reload: true }
	},

	model(params) {
		this.set('side', params.side);
		return this.store.findAll('card');
	},

	redirect(cards) {
		let numCards = cards.get('length');
		let pos = Math.floor(Math.random() * numCards);
		let card = cards.objectAt(pos);
		let side = this.side;
		if (side) {
			this.transitionTo('cards.show', card.get('id'), { queryParams: { side } });
		} else {
			this.transitionTo('cards.show', card.get('id'));
		}
	}
});
