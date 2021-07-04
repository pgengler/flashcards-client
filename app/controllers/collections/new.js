import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CollectionsNewController extends Controller {
  @service router;
  @service store;

  @tracked name;

  @action
  async save() {
    if (!this.name) return;
    let collection = this.store.createRecord('collection', { name: this.name });
    await collection.save();
    this.router.transitionTo('collection', collection.slug);
  }
}
