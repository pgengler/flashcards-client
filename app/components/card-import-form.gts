import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import fetch from 'flashcards/utils/fetch-with-waiter';
import { on } from '@ember/modifier';
import preventDefault from 'flashcards/helpers/prevent-default';
import autofocus from 'flashcards/modifiers/autofocus';
import type Collection from 'flashcards/models/collection';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import type RouterService from '@ember/routing/router-service';
import type Store from '@ember-data/store';
import { pluralize } from 'ember-inflector';

import type { CollectionResourceDocument } from '@warp-drive/core-types/spec/json-api-raw';

interface CardImportFormSignature {
  Args: {
    collection: Collection;
  };
  Element: HTMLFormElement;
}

export default class CardImportForm extends Component<CardImportFormSignature> {
  @service declare flashMessages: FlashMessagesService;
  @service declare router: RouterService;
  @service declare store: Store;

  @action
  async import(event: Event) {
    const form = <HTMLFormElement>event.target!;
    const csvData = (form.querySelector('#csv') as HTMLTextAreaElement).value;

    const url = `/api/collections/${this.args.collection.id}/import`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: csvData,
      });
      if (!response.ok) {
        throw new Error(`Import failed: got code ${response.status}`);
      }
      const data = <CollectionResourceDocument>await response.json();
      this.store.push(data);

      const count = data.meta!['cards_imported'] as number;
      this.flashMessages.success(`Imported ${pluralize(count, 'card')}`);
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

  <template>
    <form class="import-form" {{on "submit" (preventDefault this.import)}} ...attributes>
      <div class="mb-3">
        <label for="csv" class="form-label">CSV:</label>
        <textarea
          id="csv"
          name="csv"
          class="form-control"
          required
          aria-describedby="csv-help"
          {{autofocus}}
        ></textarea>
        <div id="csv-help" class="form-text">
          Input should be CSV, with one card per line. The order should be "front,back". Do not include a header
          row&mdash;it will be treated as a data row and added as a card.
        </div>
      </div>

      <button type="submit" class="btn btn-primary me-4">Import</button>

      <button type="button" class="btn btn-outline-secondary" {{on "click" this.redirectToCollection}}>
        Cancel
      </button>
    </form>
  </template>
}
