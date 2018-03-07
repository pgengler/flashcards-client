import Route from '@ember/routing/route';

export default Route.extend({
	model() {
		return this.store.findAll('card');
	},

	redirect(cards) {
		let numCards = cards.get('length');
		if (numCards === 0) {
			this.transitionTo('cards.new');
		} else {
			this.transitionTo('cards.random');
		}
	}
});
