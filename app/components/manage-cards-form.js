import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ManageCardsForm extends Component {
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
  async saveCards(event) {
    let form = event.target;
    let checked = form.querySelectorAll('input:is(:checked)');
    let ids = Array.from(checked).map((elem) => elem.value);
    let cards = ids.map((id) => {
      return this.store.peekRecord('card', id);
    });

    let cardSet = this.args.cardSet;
    cardSet.cards = cards;
    try {
      await cardSet.save();
      this.args.close();
    } catch (e) {
      console.error(e);
    }
  }
}
