import Controller from '@ember/controller';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class CollectionEditController extends Controller {
  @service flashMessages;
  @service router;

  @action
  async deleteCollection() {
    let collection = this.model.collection;
    if (!confirm(`Are you sure you want to delete "${collection.name}"?`)) return;
    try {
      await collection.destroyRecord();
      this.flashMessages.success(`Deleted "${collection.name}"`);
      this.router.transitionTo('collections.index');
    } catch (e) {
      this.flashMessages.danger(`Failed to delete "${collection.name}"`);
      console.error(e);
    }
  }

  @action
  redirectToCollection() {
    this.router.transitionTo('collection', this.model.collection.slug);
  }
}
