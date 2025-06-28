import Model, { attr, hasMany } from '@ember-data/model';

export default class Collection extends Model {
  @attr('string') name;
  @attr('string') slug; // read-only on backend; not serialized

  @hasMany('card-set', { async: false, inverse: 'collection' }) cardSets;
  @hasMany('card', { async: false, inverse: 'collection' }) cards;
}
