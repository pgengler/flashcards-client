import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class StudySession extends Component {
  @tracked currentIndex = 0;

  get currentCard() {
    return this.args.cards.objectAt(this.currentIndex);
  }

  get displayIndex() {
    return this.currentIndex + 1;
  }

  get disablePreviousButton() {
    return this.currentIndex === 0;
  }

  get disableNextButton() {
    return this.currentIndex === this.args.cards.length - 1;
  }

  @action
  goBack() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
  }

  @action
  goForward() {
    this.currentIndex = Math.min(this.currentIndex + 1, this.args.cards.length - 1);
  }
}
