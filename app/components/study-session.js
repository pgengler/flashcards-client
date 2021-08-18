import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { cached } from 'tracked-toolbox';

export default class StudySession extends Component {
  @tracked currentIndex = 0;

  @cached
  get cards() {
    let originalCards = this.args.cards.toArray();
    let cards = [...originalCards];

    for (let i = cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  get currentCard() {
    return this.cards.objectAt(this.currentIndex);
  }

  get displayIndex() {
    return this.currentIndex + 1;
  }

  get disablePreviousButton() {
    return this.currentIndex === 0;
  }

  get disableNextButton() {
    return this.currentIndex === this.cards.length - 1;
  }

  @action
  goBack() {
    this.currentIndex = Math.max(this.currentIndex - 1, 0);
  }

  @action
  goForward() {
    this.currentIndex = Math.min(this.currentIndex + 1, this.cards.length - 1);
  }
}
