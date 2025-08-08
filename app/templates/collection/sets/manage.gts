import { on } from '@ember/modifier';
import { action } from '@ember/object';
import RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import FlashMessageService from 'ember-cli-flash/services/flash-messages';
import CardSetForm from 'flashcards/components/card-set-form';
import CardSetHeader from 'flashcards/components/card-set-header';
import type { CollectionSetsManageRouteModel } from 'flashcards/routes/collection/sets/manage';

interface CollectionSetsManageSignature {
  Args: {
    model: CollectionSetsManageRouteModel;
  };
}

export default class extends Component<CollectionSetsManageSignature> {
  @service declare flashMessages: FlashMessageService;
  @service declare router: RouterService;

  @action
  redirectToCollection() {
    const { cardSet } = this.args.model;
    this.router.transitionTo('collection', cardSet.collection.slug);
  }

  @action
  redirectToSet() {
    const { cardSet } = this.args.model;
    this.router.transitionTo('collection.sets.show', cardSet.collection.slug, cardSet.id);
  }

  @action
  async remove() {
    if (!window.confirm('Really delete this card set?')) return;
    const { cardSet } = this.args.model;
    const collection = cardSet.collection;
    try {
      await cardSet.destroyRecord();
      this.flashMessages.success(`Card set "${cardSet.name}" was removed`);
      this.router.transitionTo('collection', collection.slug);
    } catch (e) {
      this.flashMessages.danger(`Could not remove "${cardSet.name}"`);
      console.error(e); // eslint-disable-line no-console
    }
  }

  <template>
    <CardSetHeader @cardSet={{@model.cardSet}} @editable={{false}} />

    <CardSetForm @cardSet={{@model.cardSet}} @saved={{this.redirectToSet}} @cancelled={{this.redirectToSet}}>
      <div class="flex-grow-1"></div>
      <button type="button" class="btn btn-danger" data-test-action="delete" {{on "click" this.remove}}>
        Delete
      </button>

    </CardSetForm>
  </template>
}
