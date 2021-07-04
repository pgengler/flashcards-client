import Model, { attr, hasMany } from '@ember-data/model';

export default class Collection extends Model {
  @attr('string') name;
  @attr('string') slug;

  @hasMany cardSets;
  @hasMany cards;
}
