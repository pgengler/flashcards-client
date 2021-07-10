import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';

export default class NewCardSetForm extends Component {
  @service router;
  @service store;

  @tracked name = '';

  get submitButtonDisabled() {
    return isEmpty(this.name);
  }

  @action
  async createSet() {
    let set = this.store.createRecord('card-set', {
      collection: this.args.collection,
      name: this.name.trim(),
    });
    try {
      await set.save();
      this.name = '';
      this.router.transitionTo('collection.sets.show', this.args.collection.slug, set.id);
    } catch (e) {
      console.error(e);
    }
  }
}
