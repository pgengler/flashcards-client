import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentCollectionService extends Service {
  @tracked currentCollection;
}
