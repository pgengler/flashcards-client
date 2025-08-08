import { on } from '@ember/modifier';
import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type Store from '@ember-data/store';
import Component from '@glimmer/component';
import type { CollectionResourceDocument } from '@warp-drive/core-types/spec/json-api-raw';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import { pluralize } from 'ember-inflector';
import preventDefault from 'flashcards/helpers/prevent-default';
import type Collection from 'flashcards/models/collection';
import autofocus from 'flashcards/modifiers/autofocus';
import fetch from 'flashcards/utils/fetch-with-waiter';

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
      // @ts-expect-error - ember-data types don't include pushPayload
      this.store.pushPayload(data); // eslint-disable-line @typescript-eslint/no-unsafe-call

      const count = data.meta!['cards_imported'] as number;
      this.flashMessages.success(`Imported ${pluralize(count, 'card')}`);
      this.router.transitionTo('collection', this.args.collection.slug);
    } catch (e) {
      this.flashMessages.danger('Failed to import cards');
      console.error(e); // eslint-disable-line no-console
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
