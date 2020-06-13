import Controller from '@ember/controller';
import { action } from '@ember/object';

import { tracked } from '@glimmer/tracking';

export default class CardShowController extends Controller {
  queryParams = [ 'side' ];

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

  @action deleteCard() {
    this.card.deleteRecord();
    this.card.save().then(function() {
      this.isEditing = false;
      this.transitionToRoute('index');
    });
  }

  @action edit() {
    this.editFront = this.card.front;
    this.editBack = this.card.back;
    this.isEditing = true;
  }

  @action save() {
    this.card.editFront = this.editFront;
    this.card.editBack = this.editBack;
    this.card.save().then(() => this.isEditing = false);
  }

  @action flipped(side) {
    this.side = side;
  }
}
