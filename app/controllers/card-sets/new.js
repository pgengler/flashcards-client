import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CardSetsNewController extends Controller {
  @tracked setName = '';

  @action createSet(event) {
    event.preventDefault();
    let name = this.setName;
    let set = this.store.createRecord('card-set', { name });
    set.save().then(() => {
      this.setName = '';
      this.transitionToRoute('index');
    }).catch(() => alert('Saving failed'));
  }
}
