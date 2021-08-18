import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { InvalidError } from '@ember-data/adapter/error';
import { tracked } from '@glimmer/tracking';

export default class CollectionForm extends Component {
  @service flashMessages;
  @service router;

  @tracked name = this.args.collection.name;

  get submitButtonDisabled() {
    return isEmpty(this.name);
  }

  @action
  async save() {
    let collection = this.args.collection;
    collection.name = this.name;
    if (!collection.name) return;
    try {
      await collection.save();
      this.router.transitionTo('collection', collection.slug);
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the collection');
      }
      console.error(e);
    }
  }
}
