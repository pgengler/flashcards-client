import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'flip-container' ],
	classNameBindings: [ 'flipped' ],
	flipped: Ember.computed.equal('side', 'back'),
	side: 'front',

	click: function() {
		var val = this.get('side');
		val = (val === 'back') ? 'front' : 'back';
		this.set('side', val);
		this.sendAction('flipped', val);
	}
});
