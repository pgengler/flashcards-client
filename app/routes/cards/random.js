import Ember from 'ember';

export default Ember.Route.extend({
	queryParams: {
		side: { reload: true }
	},
	model: function(params) {
		this.controllerFor('cards.show').set('side', params.side);
		return this.store.find('card');
	},

	afterModel: function(cards) {
		var numCards = cards.get('length');
		var pos = Math.floor(Math.random() * numCards);
		var card = cards.objectAt(pos);
		var side = this.controllerFor('cards.show').get('side');
		if (side) {
			this.replaceWith('cards.show', card.get('id'), { queryParams: { side } });
		} else {
			this.replaceWith('cards.show', card.get('id'));
		}
	}
});
