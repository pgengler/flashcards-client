import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import { tracked } from '@glimmer/tracking';

export default class CardShowController extends Controller {
  queryParams = ['side'];

  @service router;

  @tracked editFront;
  @tracked editBack;
  @tracked isEditing = false;
  @tracked side = '';

  get card() {
    return this.model;
  }

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
    this.card.deleteRecord();
    await this.card.save();
    this.isEditing = false;
    this.router.transitionTo('index');
  }

  @action
  edit() {
    this.editFront = this.card.front;
    this.editBack = this.card.back;
    this.isEditing = true;
  }

  @action
  async save() {
    this.card.editFront = this.editFront;
    this.card.editBack = this.editBack;
    await this.card.save();
    this.isEditing = false;
  }

  @action
  flipped(side) {
    this.side = side;
  }
}
