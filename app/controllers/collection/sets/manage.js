import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionSetsShowController extends Controller {
  @service router;

  @action
  redirectToSet() {
    let cardSet = this.model;
    this.router.transitionTo('collection.sets.show', cardSet.collection.get('slug'), cardSet.id);
  }
}
