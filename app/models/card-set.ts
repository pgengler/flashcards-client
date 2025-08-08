import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type Card from './card';
import type Collection from './collection';

export default class CardSet extends Model {
  @attr('string') declare name: string;
  @belongsTo('collection', { async: false, inverse: 'cardSets' }) declare collection: Collection;
  @hasMany('card', { async: false, inverse: 'cardSets' }) declare cards: Card[];
}
