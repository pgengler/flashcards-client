import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Card extends Model {
  @attr('string') front;
  @attr('string') back;

  @belongsTo collection;
  @hasMany('cardSet') cardSets;
}
