import Model, { attr, hasMany } from '@ember-data/model';

export default class CardSet extends Model {
	@attr('string') name;
	@hasMany('card') cards;
}
