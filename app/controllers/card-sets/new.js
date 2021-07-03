import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CardSetsNewController extends Controller {
  @service router;

  @tracked setName = '';

  @action
  async createSet(event) {
    event.preventDefault();
    let name = this.setName;
    let set = this.store.createRecord('card-set', { name });
    try {
      await set.save();
      this.setName = '';
      this.router.transitionTo('index');
    } catch {
      alert('Saving failed');
    }
  }
}
