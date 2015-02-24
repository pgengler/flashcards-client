import Ember from 'ember';

export default Ember.Controller.extend({
	actions: {
		create: function() {
			var controller = this;
			var card = this.store.createRecord('card', {
				front: this.get('front'),
				back: this.get('back')
			});
			card.save().then(function() {
				controller.transitionToRoute('cards.show', card.get('id'));
			});
		}
	}
});
