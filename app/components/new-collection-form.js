import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { InvalidError } from '@ember-data/adapter/error';

export default class NewCollectionForm extends Component {
  @service flashMessages;
  @service router;

  get submitButtonDisabled() {
    return isEmpty(this.args.collection.name);
  }

  @action
  async save() {
    let collection = this.args.collection;
    if (!collection.name) return;
    try {
      await collection.save();
      this.router.transitionTo('collection', collection.slug);
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new collection');
      }
      console.error(e);
    }
  }
}
