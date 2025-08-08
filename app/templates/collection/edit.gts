import Component from '@glimmer/component';
import CollectionHeader from 'flashcards/components/collection-header';
import CollectionForm from 'flashcards/components/collection-form';
import { on } from '@ember/modifier';
import type { CollectionRouteModel } from 'flashcards/routes/collection';
import type RouterService from '@ember/routing/router-service';
import type FlashMessagesService from 'ember-cli-flash/services/flash-messages';
import { service } from '@ember/service';
import { action } from '@ember/object';

interface CollectionEditSignature {
  Args: {
    model: CollectionRouteModel;
  };
}

export default class extends Component<CollectionEditSignature> {
  @service declare flashMessages: FlashMessagesService;
  @service declare router: RouterService;

  name = this.args.model.collection.name;

  @action
  async deleteCollection() {
    const collection = this.args.model.collection;
    if (!confirm(`Are you sure you want to delete "${collection.name}"?`)) return;
    try {
      await collection.destroyRecord();
      this.flashMessages.success(`Deleted "${collection.name}"`);
      this.router.transitionTo('collections.index');
    } catch (e) {
      this.flashMessages.danger(`Failed to delete "${collection.name}"`);
      console.error(e);
    }
  }

  @action
  redirectToCollection() {
    this.router.transitionTo('collection', this.args.model.collection.slug);
  }

  <template>
    <CollectionHeader @collection={{@model.collection}} @editable={{false}} @name={{this.name}} />

    <CollectionForm @collection={{@model.collection}} @submitLabel="Save">
      <button
        type="button"
        class="btn btn-outline-secondary ms-3"
        {{on "click" this.redirectToCollection}}
        data-test-action="cancel"
      >
        Cancel
      </button>
      <div class="flex-grow-1"></div>
      <button type="button" class="btn btn-danger" {{on "click" this.deleteCollection}} data-test-action="delete">
        Delete
      </button>
    </CollectionForm>
  </template>
}
