import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import fetch from 'flashcards/utils/fetch-with-waiter';
import { on } from "@ember/modifier";
import preventDefault from "../helpers/prevent-default.ts";
import autofocus from "../modifiers/autofocus.ts";

export default class CardImportForm extends Component {<template><form class="import-form" {{on "submit" (preventDefault this.import)}} ...attributes>
  <div class="mb-3">
    <label for="csv" class="form-label">CSV:</label>
    <textarea id="csv" name="csv" class="form-control" required aria-describedby="csv-help" {{autofocus}}></textarea>
    <div id="csv-help" class="form-text">
      Input should be CSV, with one card per line. The order should be
      "front,back". Do not include a header row&mdash;it will be treated as a
      data row and added as a card.
    </div>
  </div>

  <button type="submit" class="btn btn-primary me-4">Import</button>

  <button type="button" class="btn btn-outline-secondary" {{on "click" this.redirectToCollection}}>
    Cancel
  </button>
</form></template>
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
