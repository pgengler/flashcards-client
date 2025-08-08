import { on } from '@ember/modifier';
import { action } from '@ember/object';
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import CardForm from 'flashcards/components/card-form';
import FlippableCard from 'flashcards/components/flippable-card';
import type Card from 'flashcards/models/card';

interface CardComponentSignature {
  Args: {
    card: Card;
  };
  Element: HTMLDivElement;
}

export default class CardComponent extends Component<CardComponentSignature> {
  @service declare router: RouterService;

  @tracked declare editFront: string;
  @tracked declare editBack: string;
  @tracked isEditing = false;
  @tracked isResetting = false;
  @tracked side: 'front' | 'back' = 'front';

  @action
  async deleteCard() {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    const card = this.args.card;
    const collection = card.collection;
    await card.destroyRecord();
    this.router.transitionTo('collection.index', collection.slug);
  }

  @action
  edit() {
    const card = this.args.card;
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
  flip(side: 'front' | 'back') {
    this.side = side;
  }

  @action
  resetToFront() {
    this.isResetting = true;
    this.side = 'front';
    window.requestAnimationFrame(() => (this.isResetting = false));
  }

  <template>
    {{#if this.isEditing}}
      <CardForm @card={{@card}} @submitLabel="Save" @onSave={{this.exitEdit}} data-test-edit-form>
        <button
          type="button"
          class="btn btn-outline-secondary ms-3"
          data-test-cancel-button
          {{on "click" this.cancelEdit}}
        >
          Cancel
        </button>
        <div class="flex-grow-1"></div>
        <button type="button" class="btn btn-danger" data-test-delete-button {{on "click" this.deleteCard}}>
          Delete
        </button>

      </CardForm>
    {{else}}
      <FlippableCard
        @card={{@card}}
        @side={{this.side}}
        @flip={{this.flip}}
        class="mb-4 {{if this.isResetting 'no-transition'}}"
        data-test-card
        {{didUpdate this.resetToFront @card}}
        ...attributes
      />
      <button type="button" class="btn btn-primary" data-test-edit-button {{on "click" this.edit}}>
        Edit
      </button>
    {{/if}}
  </template>
}
