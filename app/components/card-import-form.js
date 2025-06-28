import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import fetch from 'flashcards/utils/fetch-with-waiter';

export default class CardImportForm extends Component {
  @service flashMessages;
  @service router;
  @service store;

  @action
  async import(event) {
    let form = event.target;
    let csvData = form.querySelector('#csv').value;

    let url = `/api/collections/${this.args.collection.id}/import`;
    try {
      let response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvData,
      });
      if (!response.ok) {
        throw new Error(`Import failed: got code ${response.status}`);
      }
      let data = await response.json();
      this.store.pushPayload(data);

      this.flashMessages.success(`Imported ${data.meta.cards_imported} cards`);
      this.router.transitionTo('collection', this.args.collection.slug);
    } catch (e) {
      this.flashMessages.danger('Failed to import cards');
      console.error(e);
    }
  }

  @action
  redirectToCollection() {
    this.router.transitionTo('collection', this.args.collection.slug);
  }
}
