import Component from '@ember/component';
import { equal } from '@ember/object/computed';

export default Component.extend({
	classNames: [ 'flip-container' ],
	classNameBindings: [ 'isFlipped:flipped' ],
	isFlipped: equal('side', 'back'),
	side: 'front',

	click() {
		let side = this.get('side');
		side = (side === 'back') ? 'front' : 'back';
		this.set('side', side);
		this.sendAction('flipped', side);
	}
});
