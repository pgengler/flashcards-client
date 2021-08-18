import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CardSet extends Model {
  @attr('string') name;
  @belongsTo collection;
  @hasMany cards;
}
