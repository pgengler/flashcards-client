import { action } from '@ember/object';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import CardSetForm from 'flashcards/components/card-set-form';
import CollectionHeader from 'flashcards/components/collection-header';
import type { CollectionSetsNewRouteModel } from 'flashcards/routes/collection/sets/new';

interface CollectionSetsNewSignature {
  Args: {
    model: CollectionSetsNewRouteModel;
  };
}

export default class extends Component<CollectionSetsNewSignature> {
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
  <template>
    <CollectionHeader @collection={{@model.cardSet.collection}} @editable={{true}} class="mb-3" />

    <h2>New card set</h2>

    <CardSetForm @cardSet={{@model.cardSet}} @saved={{this.redirectToSet}} @cancelled={{this.redirectToCollection}} />
  </template>
}
