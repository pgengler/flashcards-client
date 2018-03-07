import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';

export default Controller.extend({
	isEditing: false,
	queryParams: [ 'side' ],
	side: '',

	card: alias('model'),

	sideToDisplay: computed('side', function() {
		let selectedSide = this.get('side');
		if (selectedSide === 'front' || selectedSide === 'back') {
			return selectedSide;
		}
		if (Math.random() < 0.5) {
			return 'front';
		} else {
			return 'back';
		}
	}),

	actions: {
		delete() {
			let card = this.get('card');
			card.deleteRecord();
			card.save().then(function() {
				this.set('isEditing', false);
				this.transitionToRoute('index');
			});
		},

		edit() {
			this.set('editFront', this.get('card.front'));
			this.set('editBack', this.get('card.back'));
			this.set('isEditing', true);
		},

		save() {
			let card = this.get('card');
			card.setProperties({
				front: this.get('editFront'),
				back: this.get('editBack')
			});
			card.save().then(() => this.set('isEditing', false));
		},

		flipped(side) {
			this.set('side', side);
		}
	}
});
