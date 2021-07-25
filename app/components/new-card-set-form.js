import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { InvalidError } from '@ember-data/adapter/error';

export default class NewCardSetForm extends Component {
  @service flashMessages;
  @service router;

  get submitButtonDisabled() {
    return isEmpty(this.args.cardSet.name);
  }

  @action
  async createSet() {
    try {
      let set = this.args.cardSet;
      await set.save();
      this.router.transitionTo('collection.sets.show', set.collection.get('slug'), set.id);
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new card set');
      }
      console.error(e);
    }
  }
}
