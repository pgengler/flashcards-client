import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { tracked } from '@glimmer/tracking';

export default class CardComponent extends Component {
  @service router;

  @tracked editFront;
  @tracked editBack;
  @tracked isEditing = false;
  @tracked side = 'front';

  @action
  async deleteCard() {
    let card = this.args.card;
    let collection = card.collection;
    await card.destroyRecord();
    this.router.transitionTo('collection.index', collection.get('slug'));
  }

  @action
  edit() {
    let card = this.args.card;
    this.editFront = card.front;
    this.editBack = card.back;
    this.isEditing = true;
  }

  @action
  cancelEdit() {
    this.args.card.rollbackAttributes();
    this.isEditing = false;
  }

  @action
  exitEdit() {
    this.isEditing = false;
  }

  @action
  flip(side) {
    this.side = side;
  }
}
