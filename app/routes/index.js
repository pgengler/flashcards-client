import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.find('card');
	},

	afterModel: function(cards) {
		var numCards = cards.get('length');
		if (numCards === 0) {
			this.replaceWith('cards.new');
		} else {
			var pos = Math.floor(Math.random() * numCards);
			var card = cards.objectAt(pos);
			this.replaceWith('cards.show', card.get('id'));
		}
	}
});
