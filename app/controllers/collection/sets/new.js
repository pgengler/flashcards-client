import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionSetsNewController extends Controller {
  @service router;

  @action
  redirectToCollection() {
    let cardSet = this.model;
    this.router.transitionTo('collection', cardSet.collection.get('slug'));
  }

  @action
  redirectToSet() {
    let cardSet = this.model;
    this.router.transitionTo('collection.sets.show', cardSet.collection.get('slug'), cardSet.id);
  }
}
