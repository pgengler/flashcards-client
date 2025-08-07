import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { InvalidError } from '@ember-data/adapter/error';
import { on } from '@ember/modifier';
import preventDefault from '../helpers/prevent-default.ts';
import invalidClass from '../helpers/invalid-class.ts';
import autofocus from '../modifiers/autofocus.ts';
import validationErrors from '../helpers/validation-errors.ts';

export default class CardSetForm extends Component {
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
  @service flashMessages;
  @service store;

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
  async save(event) {
    let form = event.target;

    let name = form.querySelector('input[name=name]').value;
    if (!name) return;

    let checked = form.querySelectorAll('input:is(:checked)');
    let ids = Array.from(checked).map((elem) => elem.value);
    let cards = ids.map((id) => this.store.peekRecord('card', id));

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
}
