import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { InvalidError } from '@ember-data/adapter/error';
import { localCopy } from 'tracked-toolbox';

export default class CollectionForm extends Component {
  @service flashMessages;
  @service router;

  @localCopy('args.collection.name') name;

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
