import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class CardSet extends Model {
  @attr('string') name;
  @belongsTo('collection', { async: false, inverse: 'cardSets' }) collection;
  @hasMany('card', { async: false, inverse: 'cardSets' }) cards;
}
