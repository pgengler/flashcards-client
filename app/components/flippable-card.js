import Ember from 'ember';

export default Ember.Component.extend({
	classNames: [ 'flip-container' ],
	classNameBindings: [ 'isFlipped:flipped' ],
	isFlipped: Ember.computed.equal('side', 'back'),
	side: 'front',
	markdownOptions: { gfm: true, breaks: true },

	click: function() {
		var side = this.get('side');
		side = (side === 'back') ? 'front' : 'back';
		this.set('side', side);
		this.sendAction('flipped', side);
	}
});
