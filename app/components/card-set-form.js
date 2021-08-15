import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { InvalidError } from '@ember-data/adapter/error';

export default class CardSetForm extends Component {
  @service flashMessages;
  @service store;

  get listItems() {
    let cardSet = this.args.cardSet;
    return cardSet.collection.get('cards').map((card) => {
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
      this.args.close();
    } catch (e) {
      if (!(e instanceof InvalidError)) {
        this.flashMessages.danger('Failed to save the new card set');
      }
      console.error(e);
    }
  }
}
