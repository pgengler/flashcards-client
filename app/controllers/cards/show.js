import Ember from 'ember';

export default Ember.Controller.extend({
	isEditing: false,
	queryParams: [ 'side' ],
	side: '',

	sideToDisplay: function() {
		var selectedSide = this.get('side');
		if (selectedSide === 'front' || selectedSide === 'back') {
			return selectedSide;
		}
		if (Math.random() < 0.5) {
			return 'front';
		} else {
			return 'back';
		}
	}.property('side'),

	actions: {
		delete: function() {
			var controller = this;

			var card = this.get('model');
			card.deleteRecord();
			card.save().then(function() {
				controller.set('isEditing', false);
				controller.transitionToRoute('index');
			});
		},

		edit: function() {
			this.set('editFront', this.get('model.front'));
			this.set('editBack', this.get('model.back'));
			this.set('isEditing', true);
		},

		save: function() {
			var controller = this;

			var card = this.get('model');
			card.setProperties({
				front: this.get('editFront'),
				back: this.get('editBack')
			});
			card.save().then(function() {
				controller.set('isEditing', false);
			});
		},

		flipped: function(side) {
			this.set('side', side);
		}
	}
});
