import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { InvalidError } from '@ember-data/adapter/error';
import type Store from '@ember-data/store';
import Component from '@glimmer/component';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import invalidClass from 'flashcards/helpers/invalid-class';
import preventDefault from 'flashcards/helpers/prevent-default';
import validationErrors from 'flashcards/helpers/validation-errors';
import type Card from 'flashcards/models/card';
import type CardSet from 'flashcards/models/card-set';
import autofocus from 'flashcards/modifiers/autofocus';

interface CardSetFormSignature {
  Args: {
    cardSet: CardSet;
    cancelled: () => void;
    saved: () => void;
  };
  Blocks: {
    default: [];
  };
  Element: HTMLFormElement;
}

export default class CardSetForm extends Component<CardSetFormSignature> {
  @service declare flashMessages: FlashMessagesService;
  @service declare store: Store;

  get listItems() {
    const cardSet = this.args.cardSet;
    const cards = cardSet.collection.cards || [];
    return cards.map((card) => {
      return {
        checked: cardSet.cards.includes(card),
        card,
      };
    });
  }

  @action
  async save(event: Event) {
    const form = <HTMLFormElement>event.target!;

    const name = (<HTMLInputElement>form.querySelector('input[name=name]')).value;
    if (!name) return;

    const checked = form.querySelectorAll('input:is(:checked)');
    const ids = Array.from(checked).map((elem) => (elem as HTMLInputElement).value);
    const cards = <Card[]>ids.map((id) => this.store.peekRecord('card', id));

    const cardSet = this.args.cardSet;
    cardSet.cards = cards;
    cardSet.name = name;
    try {
      await cardSet.save();
      this.args.saved();
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new card set');
      }
      console.error(e); // eslint-disable-line no-console
    }
  }

  <template>
    <form {{on "submit" (preventDefault this.save)}} data-test-card-set-form ...attributes>
      <div class="container">
        <div class="row mb-4">
          <label for="name" class="form-label">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={{@cardSet.name}}
            class="form-control {{invalidClass @cardSet 'name'}}"
            required
            {{autofocus}}
          />
          <div class="invalid-feedback" data-test-errors-for="name">
            {{validationErrors @cardSet.errors "name"}}
          </div>

        </div>
      </div>

      <h3>Cards in this set</h3>
      <table class="table">
        <tbody>
          {{#each this.listItems as |item|}}
            <tr data-test-card>
              <td>
                <label for="include-{{item.card.id}}" class="visually-hidden">
                  Include
                </label>
                <input type="checkbox" value={{item.card.id}} checked={{item.checked}} id="include-{{item.card.id}}" />
              </td>
              <td>
                {{item.card.front}}
              </td>
              <td>
                {{item.card.back}}
              </td>
            </tr>
          {{/each}}
        </tbody>
      </table>

      <div class="row">
        <div class="col d-flex align-items-center">
          <button type="submit" class="btn btn-primary me-4">
            Save
          </button>

          <button type="button" class="btn btn-outline-secondary" data-test-cancel-button {{on "click" @cancelled}}>
            Cancel
          </button>

          {{yield}}
        </div>
      </div>
    </form>
  </template>
}
