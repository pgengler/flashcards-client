import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { InvalidError } from '@ember-data/adapter/error';

export default class NewCardForm extends Component {
  @service flashMessages;

  @tracked addAnother = false;

  get submitButtonDisabled() {
    let card = this.args.card;
    return isEmpty(card.front) || isEmpty(card.back);
  }

  @action
  async save() {
    let card = this.args.card;
    try {
      await card.save();
      this.args.onSave(card);
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new card');
      }
      console.error(e);
    }
  }
}
