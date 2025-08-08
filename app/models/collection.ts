import Model, { attr, hasMany } from '@ember-data/model';

import type Card from './card';
import type CardSet from './card-set';

export default class Collection extends Model {
  @attr('string') declare name: string;
  @attr('string') declare slug: string; // read-only on backend; not serialized

  @hasMany('card-set', { async: false, inverse: 'collection' }) declare cardSets: CardSet[];
  @hasMany('card', { async: false, inverse: 'collection' }) declare cards: Card[];
}
