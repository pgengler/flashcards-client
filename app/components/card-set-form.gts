import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { InvalidError } from '@ember-data/adapter/error';
import { on } from '@ember/modifier';
import preventDefault from '../helpers/prevent-default';
import invalidClass from '../helpers/invalid-class';
import autofocus from '../modifiers/autofocus';
import validationErrors from '../helpers/validation-errors';
import type CardSet from 'flashcards/models/card-set';
import type FlashMessagesService from 'ember-flash-messages/services/flash-messages';
import type Store from '@ember-data/store';
import type Card from 'flashcards/models/card';

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
    let cardSet = this.args.cardSet;
    let cards = cardSet.collection.cards || [];
    return cards.map((card) => {
      return {
        checked: cardSet.cards.includes(card),
        card,
      };
    });
  }

  @action
  async save(event: Event) {
    let form = <HTMLFormElement>event.target!;

    let name = (<HTMLInputElement>form.querySelector('input[name=name]')).value;
    if (!name) return;

    let checked = <NodeListOf<HTMLInputElement>>form.querySelectorAll('input:is(:checked)');
    let ids = Array.from(checked).map((elem) => elem.value);
    let cards = <Card[]>ids.map((id) => this.store.peekRecord('card', id));

    let cardSet = this.args.cardSet;
    cardSet.cards = cards;
    cardSet.name = name;
    try {
      await cardSet.save();
      this.args.saved();
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new card set');
      }
      console.error(e);
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
            {{validationErrors @cardSet.errors.name}}
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
