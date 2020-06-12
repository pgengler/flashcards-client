import Controller from '@ember/controller';

export default Controller.extend({
	setName: '',

	actions: {
		createSet() {
			let name = this.setName;
			let set = this.store.createRecord('card-set', { name });
			set.save().then(() => {
				this.set('setName', '');
				this.transitionToRoute('index');
			}).catch(() => alert("Saving failed"));
		}
	}
});
