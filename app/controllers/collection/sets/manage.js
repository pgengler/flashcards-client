import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class CollectionSetsManageController extends Controller {
  @service flashMessages;
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

  @action
  async remove() {
    if (!window.confirm('Really delete this card set?')) return;
    let cardSet = this.model;
    try {
      await cardSet.destroyRecord();
      this.flashMessages.success(`Card set "${cardSet.name}" was removed`);
      this.router.transitionTo('collection', cardSet.collection.get('slug'));
    } catch (e) {
      this.flashMessages.danger(`Could not remove "${cardSet.name}"`);
      console.error(e);
    }
  }
}
