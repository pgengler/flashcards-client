import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import { InvalidError } from '@ember-data/adapter/error';

export default class NewCardForm extends Component {
  @service flashMessages;
  @service router;
  @service store;

  @tracked addAnother = false;

  get submitButtonDisabled() {
    let card = this.args.card;
    return isEmpty(card.front) || isEmpty(card.back);
  }

  @action
  async create() {
    let card = this.args.card;
    try {
      await card.save();
      if (this.addAnother) {
        // someday this will be possible:
        // this.router.refresh();
        // until then, here's a hack:
        this.router._router._routerMicrolib.refresh(); // eslint-disable-line ember/no-private-routing-service
      } else {
        this.router.transitionTo('collection.card.show', card.collection.get('slug'), card.id);
      }
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new card');
      }
      console.error(e);
    }
  }
}
