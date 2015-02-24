import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'flip-container' ],
	classNameBindings: [ 'flipped' ],
	flipped: false,

	click: function() {
		var val = this.get('flipped');
		this.set('flipped', !val);
	}
});
