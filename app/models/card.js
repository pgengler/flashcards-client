import Model, { attr, hasMany } from '@ember-data/model';

export default class Card extends Model {
	@attr('string') front;
	@attr('string') back;

	@hasMany('cardSet') cardSets;
}
