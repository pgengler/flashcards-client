import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import CardForm from './card-form.js';
import { on } from '@ember/modifier';
import FlippableCard from './flippable-card.gjs';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';

export default class CardComponent extends Component {
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
  @service router;

  @tracked editFront;
  @tracked editBack;
  @tracked isEditing = false;
  @tracked isResetting = false;
  @tracked side = 'front';

  @action
  async deleteCard() {
    if (!window.confirm('Are you sure you want to delete this card?')) return;
    let card = this.args.card;
    let collection = await card.collection;
    await card.destroyRecord();
    this.router.transitionTo('collection.index', collection.slug);
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

  @action
  resetToFront() {
    this.isResetting = true;
    this.side = 'front';
    window.requestAnimationFrame(() => (this.isResetting = false));
  }
}
