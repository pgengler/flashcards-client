import Ember from 'ember';

export default Ember.Controller.extend({
	isEditing: false,

	actions: {
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
		}
	}
});
