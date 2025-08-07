import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { cached } from 'tracked-toolbox';
import CardComponent from './card';
import onKey from 'ember-keyboard/modifiers/on-key';
import { on } from '@ember/modifier';
import type Card from 'flashcards/models/card';

interface StudySessionSignature {
  Args: {
    cards: Card[];
  };
}

export default class StudySession extends Component<StudySessionSignature> {
  @tracked currentIndex = 0;

  @cached
  get cards() {
    let cards = [...this.args.cards];

    for (let i = cards.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  get currentCard() {
    return this.cards[this.currentIndex]!;
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

  <template>
    <span data-test-progress>{{this.displayIndex}} / {{this.cards.length}}</span>

    <CardComponent
      @card={{this.currentCard}}
      data-test-id={{this.currentCard.id}}
      {{onKey "ArrowLeft" this.goBack}}
      {{onKey "ArrowRight" this.goForward}}
      {{onKey "," this.goBack}}
      {{onKey "." this.goForward}}
      {{onKey "j" this.goForward}}
      {{onKey "k" this.goBack}}
    />

    <div class="row">
      <div class="btn-group" role="group">
        <button
          type="button"
          class="btn btn-outline-primary"
          disabled={{this.disablePreviousButton}}
          data-test-previous
          {{on "click" this.goBack}}
        >
          Previous
        </button>

        <button
          type="button"
          class="btn btn-outline-primary"
          disabled={{this.disableNextButton}}
          data-test-next
          {{on "click" this.goForward}}
        >
          Next
        </button>
      </div>
    </div>
  </template>
}
