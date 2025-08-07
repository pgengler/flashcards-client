import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import type Collection from 'flashcards/models/collection';

export default class CurrentCollectionService extends Service {
  @tracked declare currentCollection?: Collection;
}
