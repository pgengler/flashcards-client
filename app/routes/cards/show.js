import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
		return Ember.RSVP.hash({
			card: this.store.find('card', params.id),
			side: params.side
		});
	},

	setupController: function(controller, model) {
		controller.set('model', model.card);
		controller.set('side', model.side);
	}
});
