import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { cached } from 'tracked-toolbox';
import Card from "./card.js";
import onKey from "ember-keyboard/modifiers/on-key";
import { on } from "@ember/modifier";

export default class StudySession extends Component {<template><span data-test-progress>{{this.displayIndex}} / {{this.cards.length}}</span>

<Card @card={{this.currentCard}} data-test-id={{this.currentCard.id}} {{onKey "ArrowLeft" this.goBack}} {{onKey "ArrowRight" this.goForward}} {{onKey "," this.goBack}} {{onKey "." this.goForward}} {{onKey "j" this.goForward}} {{onKey "k" this.goBack}} />

<div class="row">
  <div class="btn-group" role="group">
    <button type="button" class="btn btn-outline-primary" disabled={{this.disablePreviousButton}} data-test-previous {{on "click" this.goBack}}>
      Previous
    </button>

    <button type="button" class="btn btn-outline-primary" disabled={{this.disableNextButton}} data-test-next {{on "click" this.goForward}}>
      Next
    </button>
  </div>
</div></template>
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
    return this.cards[this.currentIndex];
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
