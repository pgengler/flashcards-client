import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

import type CardSet from './card-set';
import type Collection from './collection';

export default class Card extends Model {
  @attr('string') declare front: string;
  @attr('string') declare back: string;

  @belongsTo('collection', { async: false, inverse: 'cards' }) declare collection: Collection;
  @hasMany('card-set', { async: false, inverse: 'cards' }) declare cardSets: CardSet[];
}
