import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { tracked } from '@glimmer/tracking';

export default class CardComponent extends Component {
  @service router;

  @tracked editFront;
  @tracked editBack;
  @tracked isEditing = false;
  @tracked side = '';

  get sideToDisplay() {
    let selectedSide = this.side;
    if (selectedSide === 'front' || selectedSide === 'back') {
      return selectedSide;
    }
    if (Math.random() < 0.5) {
      return 'front';
    } else {
      return 'back';
    }
  }

  @action
  async deleteCard() {
    let card = this.args.card;
    card.deleteRecord();
    await card.save();
    this.isEditing = false;
    this.router.transitionTo('index');
  }

  @action
  edit() {
    let card = this.args.card;
    this.editFront = card.front;
    this.editBack = card.back;
    this.isEditing = true;
  }

  @action
  async save() {
    let card = this.args.card;
    card.editFront = this.editFront;
    card.editBack = this.editBack;
    await card.save();
    this.isEditing = false;
  }

  @action
  flipped(side) {
    this.side = side;
  }
}
