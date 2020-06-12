import Controller from '@ember/controller';

export default Controller.extend({
	actions: {
		create() {
			let card = this.store.createRecord('card', {
				front: this.front,
				back: this.back
			});
			card.save().then(() => {
				this.transitionToRoute('cards.show', card.get('id'));
			});
		}
	}
});
