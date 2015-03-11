import Ember from 'ember';

export default Ember.Controller.extend({
	setName: '',

	actions: {
		createSet: function() {
			var name = this.get('setName');
			var set = this.store.createRecord('cardSet', { name });
			set.save().then(function() {
				this.set('setName', '');
				this.transitionToRoute('index');
			}).catch(function() {
				alert("Saving failed");
			});
		}
	}
});
