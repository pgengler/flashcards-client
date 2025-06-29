import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class CollectionManageSetController extends Controller {
  @service flashMessages;
  @service router;

  @action
  redirectToCollection() {
    let cardSet = this.model;
    this.router.transitionTo('collection', cardSet.collection.slug);
  }

  @action
  redirectToSet() {
    let cardSet = this.model;
    this.router.transitionTo('collection.sets.show', cardSet.collection.slug, cardSet.id);
  }

  @action
  async remove() {
    if (!window.confirm('Really delete this card set?')) return;
    let cardSet = this.model;
    let collection = await cardSet.collection;
    try {
      await cardSet.destroyRecord();
      this.flashMessages.success(`Card set "${cardSet.name}" was removed`);
      this.router.transitionTo('collection', collection.slug);
    } catch (e) {
      this.flashMessages.danger(`Could not remove "${cardSet.name}"`);
      console.error(e);
    }
  }
}
